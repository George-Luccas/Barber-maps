"use server";

import { prisma as db } from "@/lib/prisma";
import { comercioApi } from "@/services/comercio-api";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

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
  let hasCompletedBooking = await db.booking.findFirst({
    where: {
      userId,
      barbershopId,
      OR: [
        { status: "COMPLETED" },
        { status: "CONFIRMED", date: { lt: new Date() } }
      ]
    }
  });

  // If match not found locally, check external API
  if (!hasCompletedBooking) {
      console.log(`[Review Action] Local booking not found. Checking external API for User ${userId}...`);
      
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user?.email) {
          const externalBookings = await comercioApi.getUserBookings(user.email);
          const matched = externalBookings.find((b: any) => 
              b.barbershopId === barbershopId && 
              (
                b.status === "COMPLETED" || 
                b.status === "FINISHED" ||
                (b.status === "CONFIRMED" && new Date(b.date) < new Date())
              )
          );
          
          if (matched) {
              console.log("[Review Action] Found matching external booking!", matched.id);
              hasCompletedBooking = matched;
          }
      }
  }

  if (!hasCompletedBooking) {
      throw new Error(`Você só pode avaliar após concluir um agendamento nesta barbearia. (Debug: User ${userId} Shop ${barbershopId})`);
  }

  try {
    // 2. Ensure Barbershop exists locally (Sync for external shops)
    const shopExists = await db.barbershop.findUnique({ where: { id: barbershopId } });
    if (!shopExists) {
        console.log(`[Review Action] Syncing external shop ${barbershopId} to local DB...`);
        const externalShop = await comercioApi.getShop(barbershopId);
        if (externalShop) {
            // SAFE DATA SANITIZATION
            const safePhones = Array.isArray(externalShop.phones) ? externalShop.phones : [];
            const safeName = externalShop.name || "Barbearia Externa";
            const safeAddress = externalShop.address || "Endereço não disponível";
            const safeImageUrl = externalShop.imageUrl || "";
            const safeDescription = externalShop.description || "Sem descrição";

            await db.barbershop.create({
                data: {
                    id: externalShop.id,
                    name: safeName,
                    address: safeAddress,
                    imageUrl: safeImageUrl,
                    phones: safePhones,
                    description: safeDescription
                }
            });
        } else {
            console.warn(`[Review Action] Could not fetch shop details for ${barbershopId}.`);
            throw new Error("Não foi possível identificar a barbearia para salvar a avaliação. Tente novamente.");
        }
    }

    // 3. Check if it's a new review (for Loyalty Points)
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

    try {
      revalidatePath(`/barbershops/${barbershopId}`);
      revalidatePath("/");
    } catch (revalError) {
      console.error("Revalidation failed (non-critical):", revalError);
    }
    
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

import { headers } from "next/headers";

export const deleteBarbershopReview = async (reviewId: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user;

  if (!user || user.role !== "ADMIN") {
      throw new Error("Acesso negado.");
  }

  try {
      await db.review.delete({
          where: { id: reviewId }
      });
      
      revalidatePath("/");
      revalidatePath("/barbershops/[id]"); // Revalidate dynamic routes properly? No, path should be specific or 'layout'
      // revalidatePath("/barbershops/" + "..."); we don't know the ID here easily without firing another query, 
      // but revalidating layout or generic paths usually works for catch-all. 
      // Actually, we can just return success and let client refresh.
      
      return { success: true };
  } catch (error) {
      console.error("Error deleting review:", error);
      throw new Error("Erro ao excluir avaliação.");
  }
};
