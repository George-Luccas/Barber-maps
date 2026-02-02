"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateReviewParams {
  barbershopId: string;
  userId: string;
  rating: number;
  comment?: string;
}

export const createBarbershopReview = async (params: CreateReviewParams) => {
  const { barbershopId, userId, rating, comment } = params;
  
  console.log(`[Review Action] Attempting to create review for User ${userId} at Shop ${barbershopId}`);

  // 1. Validate: User must have at least one COMPLETED booking at this shop
  // (Or we could be stricter: check if they reviewed THIS specific booking, 
  // but usually one review per shop or per recent visit is the pattern. 
  // The unique constraint userId_barbershopId suggests one review per shop.)
  const hasCompletedBooking = await db.booking.findFirst({
    where: {
      userId,
      barbershopId,
      status: "COMPLETED"
    }
  });

  if (!hasCompletedBooking) {
      throw new Error(`Você só pode avaliar após concluir um agendamento nesta barbearia. (Debug: User ${userId} Shop ${barbershopId})`);
  }

  try {
    // 2. Check if it's a new review (for Loyalty Points)
    const existingReview = await db.review.findUnique({
      where: { userId_barbershopId: { userId, barbershopId } }
    });

    const isNewReview = !existingReview;

    // 3. Upsert Review
    const review = await db.review.upsert({
        where: {
        userId_barbershopId: {
            userId,
            barbershopId,
        },
        },
        update: {
        rating,
        comment,
        },
        create: {
        userId,
        barbershopId,
        rating,
        comment,
        },
    });

    // 4. Award Point (Only if it was a new review)
    if (isNewReview) {
        await db.loyaltyCard.upsert({
            where: {
                userId_barbershopId: {
                    userId,
                    barbershopId
                }
            },
            create: {
                userId,
                barbershopId,
                currentPoints: 1,
                totalLifetimePoints: 1,
            },
            update: {
                currentPoints: { increment: 1 },
                totalLifetimePoints: { increment: 1 }
            }
        });
        console.log(`[Loyalty] Awarded 1 point to user ${userId} for reviewing shop ${barbershopId}`);
    }

    revalidatePath(`/barbershops/${barbershopId}`);
    revalidatePath("/");
    
    return review;

  } catch (error) {
    console.error("Error creating review:", error);
    // Return or throw detailed error to client
    if (error instanceof Error) {
        throw new Error(error.message); 
    }
    throw new Error("Erro ao salvar avaliação.");
  }
};

export const getBarbershopReviews = async (barbershopId: string) => {
  try {
    return await db.review.findMany({
      where: {
        barbershopId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const getBarbershopRating = async (barbershopId: string) => {
  try {
    const reviews = await db.review.findMany({
      where: { barbershopId },
      select: { rating: true },
    });

    if (reviews.length === 0) return { average: 0, count: 0 };

    const sum = reviews.reduce((acc: number, review) => acc + review.rating, 0);
    const average = sum / reviews.length;

    return {
      average: parseFloat(average.toFixed(1)),
      count: reviews.length,
    };
  } catch (error) {
    console.error("Error fetching rating:", error);
    return { average: 0, count: 0 };
  }
};
