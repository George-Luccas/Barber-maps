import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const filter = searchParams.get("filter"); // e.g., 'ranking'
    
    // NOTE: Add strict API Key validation here if needed for production
    const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");

    try {
        const whereClause: any = {
            // Default active shops only?
        };

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                // Add services search if needed via relation
            ];
        }

        if (city) {
            whereClause.city = { contains: city, mode: "insensitive" };
        }

        // Calculate Start of Current Quarter (Quarterly Reset)
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-11
        const startMonth = Math.floor(currentMonth / 3) * 3;
        const startOfCurrentQuarter = new Date(now.getFullYear(), startMonth, 1);

        console.log(`[API] Fetching shops with bookings from: ${startOfCurrentQuarter.toISOString()}`);

        // Fetch shops with booking counts (Filtered by Quarter)
        const shops = await db.barbershop.findMany({
            where: whereClause,
            include: {
                _count: {
                    select: { 
                        bookings: {
                            where: {
                                date: { gte: startOfCurrentQuarter }
                            }
                        } 
                    }
                },
                // Include Services/Products usually fetched via separate details call, 
                // but let's include basic info if needed for lists
                services: {
                    select: {
                        id: true,
                        name: true,
                        priceInCents: true,
                        imageUrl: true
                    },
                    take: 5 // Limit services in list view
                }
            },
            take: 50
        });

        // Transform to include bookingsCount property and dailyGoal defaults
        const result = shops.map(shop => ({
            ...shop,
            bookingsCount: shop._count.bookings,
            dailyGoal: Number(shop.dailyGoal), // Ensure decimal is number for JSON
            latitude: shop.latitude ? Number(shop.latitude) : null,
            longitude: shop.longitude ? Number(shop.longitude) : null,
        }));

        // Sort by bookings if requesting ranking
        // Note: Ideally do this in DB aggregation, but for < 50 shops JS sort is fine
        if (filter === 'ranking' || !search) { // Default to popularity if no search
            result.sort((a, b) => b.bookingsCount - a.bookingsCount);
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error: any) {
        console.error("[LOCAL API] Get Shops Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
