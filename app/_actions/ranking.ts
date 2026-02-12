"use server";

import { prisma as db } from "@/lib/prisma";
import { getBarbers, BarberWithShop } from "@/data/barbers";

export interface BarberWithRating extends BarberWithShop {
  rating: number;
  reviewCount: number;
}

export async function getBarberRankingByRating(): Promise<BarberWithRating[]> {
  try {
    // 1. Fetch all barbers from External API (to get names, images, etc.)
    const allBarbers = await getBarbers();

    // 1. Calculate Start of Current Quarter
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3; // 0, 3, 6, 9
    const startOfQuarter = new Date(now.getFullYear(), quarterStartMonth, 1);
    
    // 2. Fetch All Reviews (Workaround for groupBy type error with new field)
    // @ts-ignore: Prisma types are stale
    const reviews = await db.review.findMany({
      where: {
        // @ts-ignore
        barberId: {
          not: null, // Ensure we only get reviews linked to a barber
        },
        createdAt: {
            gte: startOfQuarter
        }
      },
      select: {
        // @ts-ignore
        barberId: true,
        rating: true,
      },
    });

    // 3. Aggregate Manually
    const ratingMap = new Map<string, { total: number; count: number }>();

    // @ts-ignore
    reviews.forEach((r: any) => {
      if (!r.barberId) return;
      
      const current = ratingMap.get(r.barberId) || { total: 0, count: 0 };
      ratingMap.set(r.barberId, {
        total: current.total + r.rating,
        count: current.count + 1,
      });
    });

    // 4. Map ratings to barbers
    const barbersWithRatings = allBarbers.map((barber) => {
      const stats = ratingMap.get(barber.id);
      const avgRating = stats ? stats.total / stats.count : 0;
      
      return {
        ...barber,
        rating: avgRating,
        reviewCount: stats ? stats.count : 0,
      };
    });

    // 5. Filter & Sort
    // Filter out barbers with 0 reviews/rating in this period
    const activeBarbers = barbersWithRatings.filter(b => b.reviewCount > 0);

    const sortedBarbers = activeBarbers.sort((a, b) => {
        if (b.rating !== a.rating) {
            return b.rating - a.rating;
        }
        return b.reviewCount - a.reviewCount;
    });

    return sortedBarbers.slice(0, 10);
    
  } catch (error) {
    console.error("Error calculating barber ranking:", error);
    return [];
  }
}
