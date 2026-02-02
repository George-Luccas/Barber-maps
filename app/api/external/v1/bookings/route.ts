
import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");
  
  // NOTE: In production/remote scenario, we would validate apiKey strictly.
  // For local workaround, we are lenient or check against .env if we want.
  // if (apiKey !== process.env.COMERCIO_API_KEY) ...
  
  try {
    const body = await req.json();
    const { 
        barbershopId, 
        serviceId, 
        barberId, 
        date, 
        clientName, 
        clientEmail, 
        clientPhone,
        isSubscription
    } = body;

    console.log("[LOCAL API] Received Booking Request:", body);

    const missingFields = [];
    if (!barbershopId) missingFields.push("barbershopId");
    if (!serviceId) missingFields.push("serviceId");
    if (!date) missingFields.push("date");
    if (!clientEmail) missingFields.push("clientEmail");

    if (missingFields.length > 0) {
        const errorMessage = `Missing required fields: ${missingFields.join(", ")}`;
        console.error(`[LOCAL API] Validation Error: ${errorMessage}`);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Since we are running locally, the User should exist in our DB.
    const user = await db.user.findUnique({
        where: { email: clientEmail }
    });

    if (!user) {
        console.error(`[LOCAL API] User not found for email: ${clientEmail}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check availability (Optional but good)
    const bookingDate = new Date(date);
    
    // Create Booking
    const booking = await db.booking.create({
        data: {
            barbershopId,
            serviceId,
            userId: user.id,
            date: bookingDate,
            barberId: barberId || null,
            status: "CONFIRMED", // Default to confirmed for simplicity in this flow
            userName: clientName,
            isSubscription: isSubscription || false
        }
    });

    console.log("[LOCAL API] Booking Created:", booking.id);
    
    // Attempt to revalidate paths if possible (though this is API route)
    // revalidatePath("/"); 

    return NextResponse.json(booking, { status: 201 });

  } catch (error: any) {
    console.error("[LOCAL API] Create Booking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");

    // NOTE: Add strict API Key validation here if needed for production
    
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const bookings = await db.booking.findMany({
            where: {
                userId: user.id
            },
            include: {
                barbershop: {
                    select: {
                        name: true,
                        address: true,
                        imageUrl: true
                    }
                },
                service: {
                    select: {
                        name: true,
                        priceInCents: true,
                        description: true,
                        imageUrl: true
                    }
                },
                Barber: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json(bookings, { status: 200 });
    } catch (error: any) {
        console.error("[LOCAL API] Get Bookings Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
