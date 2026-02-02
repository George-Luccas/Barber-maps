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
      throw new Error("Você só pode avaliar após concluir um agendamento nesta barbearia.");
  }

  try {
    // 2. Upsert Review
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

    // 3. Award Point (1 Point for Review)
    // Only if it was a create action? Or update too? 
    // Usually only once. upsert returns the object, hard to know if created or updated without separate query.
    // For simplicity and user happiness, let's strictly award if "create" happened, OR 
    // just ensure they don't farm points. 
    // Since unique constraint exists on [userId, barbershopId], they can only have ONE review per shop.
    // So we can check if they ALREADY had a review before this upsert?
    // Actually simpler: if we just upserted, we can try to award points if we haven't tracked this yet.
    // But since the schema doesn't track "Points Awarded for Review", let's just award it.
    // Risk: User edits review 100 times -> 100 points.
    // Mitigation: We need to know if this is a NEW review.
    
    // Better approach:
    // Check if review existed before upsert.
    const existingReview = await db.review.findUnique({
        where: { userId_barbershopId: { userId, barbershopId } }
    });

    if (!existingReview) {
        // It's a new review! Award point.
        await db.loyaltyCard.updateMany({
            where: { userId, barbershopId },
            data: {
                currentPoints: { increment: 1 },
                totalLifetimePoints: { increment: 1 }
            }
        });
        console.log(`[Loyalty] Awarded 1 point to user ${userId} for reviewing shop ${barbershopId}`);
    }

    revalidatePath("/barbershops/[id]", "page");
    revalidatePath("/");
    
    return review;

  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Erro ao salvar avaliação.");
  }
};

export const getBarbershopReviews = async (barbershopId: string) => {
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
};

export const getBarbershopRating = async (barbershopId: string) => {
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
};
