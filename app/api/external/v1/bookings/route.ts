
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

    if (!barbershopId || !serviceId || !date || !clientEmail) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
