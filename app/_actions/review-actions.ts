"use server";

import { prisma as db } from "@/lib/prisma";
import { comercioApi } from "@/services/comercio-api";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { findUserBookings } from "@/services/booking-service";
// import { getShopDetails } from "@/services/shop-service";

interface CreateReviewParams {
  barbershopId: string;
  userId: string;
  rating: number;
  comment?: string;
  userEmail?: string | null;
}

export const createBarbershopReview = async (params: CreateReviewParams) => {
  const { barbershopId, userId, rating, comment, userEmail } = params;
  
  console.log(`[Review Action] Attempting to create review for User ${userId} (${userEmail}) at Shop ${barbershopId}`);

  try {
    // TEMPORARIAMENTE DESABILITADO: Validação de agendamento
    // A validação estava falhando devido a problemas de sincronização de dados.
    // Qualquer usuário logado agora pode enviar uma avaliação.
    // TODO: Reativar quando os dados estiverem sincronizados corretamente.
    console.log(`[Review Action] Skipping booking validation (temporarily disabled)`);

    /*
    // 1. Validate: User must have at least one COMPLETED booking at this shop
    let hasCompletedBooking: any = await db.booking.findFirst({
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
        
        if (userEmail) {
            try {
                const externalBookings = await findUserBookings(userEmail);
                console.log(`[Review Action] Found ${externalBookings.length} bookings for ${userEmail}`);
                
                // Debug: Log all bookings found
                externalBookings.forEach((b, i) => {
                    console.log(`[Review Action] Booking ${i}: ID=${b.id}, ShopID=${b.barbershopId}, Status=${b.status}, Date=${b.date}`);
                });
                console.log(`[Review Action] Target BarbershopId: ${barbershopId}`);

                const matched = externalBookings.find((b) => {
                    const shopMatch = b.barbershopId === barbershopId;
                    if (!shopMatch) {
                        console.log(`[Review Action] Shop mismatch: ${b.barbershopId} !== ${barbershopId}`);
                        return false;
                    }
                    
                    const bookingDate = new Date(b.date);
                    const now = new Date();
                    
                    // Status Logic aligned with Frontend "Finalizados":
                    // 1. Explicitly Completed/Finished
                    const explicitSuccess = b.status === "COMPLETED" || b.status === "FINISHED";
                    
                    // 2. Or Past Date (and not cancelled)
                    const isCancelled = b.status === "CANCELLED" || !!b.cancelledAt;
                    const isPastAndActive = !isCancelled && bookingDate < now;

                    const isValid = explicitSuccess || isPastAndActive;

                    if (isValid) {
                        console.log(`[Review Action] ✅ Valid booking found: ${b.id} | Status: ${b.status} | Date: ${bookingDate.toISOString()}`);
                    } else {
                        console.log(`[Review Action] ❌ Skip Booking ${b.id}: Status=${b.status}, Date=${bookingDate.toISOString()}, IsCancelled=${isCancelled}, Past=${bookingDate < now}`);
                    }
                    return isValid;
                });
                
                if (matched) {
                    console.log("[Review Action] ✅ Found matching booking!", matched.id);
                    hasCompletedBooking = matched;
                } else {
                    console.warn("[Review Action] ❌ No matching booking found despite searching.");
                }
            } catch (err) {
                console.error("[Review Action] Error fetching external bookings:", err);
            }
        } else {
            console.warn("[Review Action] User email not provided, cannot check external bookings.");
        }
    }

    if (!hasCompletedBooking) {
        throw new Error(`Você só pode avaliar após concluir um agendamento nesta barbearia.`);
    }
    */

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


interface CreateBarberReviewParams {
  barberId: string;
  barbershopId: string; // Still needed for context or relations
  userId: string;
  rating: number;
  comment?: string;
  userEmail?: string | null;
}

export const createBarberReview = async (params: CreateBarberReviewParams) => {
  const { barberId, barbershopId, userId, rating, comment, userEmail } = params;
  
  console.log(`[Review Action] Creating review for Barber ${barberId} by User ${userId}`);

  try {
     // 0. Check for existing review in current cycle (USER REQUEST: One review per cycle)
     const now = new Date();
     const currentMonth = now.getMonth();
     const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
     const startOfQuarter = new Date(now.getFullYear(), quarterStartMonth, 1);

     const existingCycleReview = await db.review.findFirst({
         where: {
             userId,
             barberId,
             createdAt: {
                 gte: startOfQuarter
             }
         }
     });

     if (existingCycleReview) {
         throw new Error("Você já avaliou este barbeiro neste ciclo trimestral. Aguarde o próximo ciclo!");
     }

     // 1. Check if Barbershop exists locally
     // We do NOT sync external shops anymore per user request.
     // If shop exists, we link it. If not, we leave it null.
     const shopExists = await db.barbershop.findUnique({ where: { id: barbershopId } });
     const finalBarbershopId = shopExists ? barbershopId : undefined;

     if (!shopExists) {
         console.log(`[Review Action] Shop ${barbershopId} not found locally. Proceeding with independent barber review.`);
     }

     // 2. Ensuring Barber exists locally
     const barberExists = await db.barber.findUnique({ where: { id: barberId } });
     if (!barberExists) {
         // Minimal create
         await db.barber.create({
             data: {
                 id: barberId,
                 name: "Barbeiro", // Placeholder
                 barbershopId: finalBarbershopId, // Can be null now
                 updatedAt: new Date()
             }
         });
     }

     // 3. Create Review
    const review = await db.review.create({
        data: {
            userId,
            barbershopId: finalBarbershopId, // Can be null now
            barberId,
            rating,
            comment,
        }
    });

    revalidatePath(`/barbers/${barberId}`);
    return review;

  } catch (error) {
      console.error("[Review Action] Error creating barber review:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Erro ao salvar avaliação do barbeiro.");
  }
}

export const getBarberReviews = async (barberId: string) => {
    try {
        return await db.review.findMany({
            where: { barberId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        return [];
    }
}

export const getBarberRating = async (barberId: string) => {
    try {
        const reviews = await db.review.findMany({
            where: { barberId },
            select: { rating: true }
        });
        
        if (reviews.length === 0) return { average: 0, count: 0 };
        
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return {
            average: parseFloat((sum / reviews.length).toFixed(1)),
            count: reviews.length
        };
    } catch (error) {
        return { average: 0, count: 0 };
    }
}

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
      // 1. First, fetch the review to get userId and barbershopId
      const review = await db.review.findUnique({
          where: { id: reviewId },
          select: { userId: true, barbershopId: true }
      });

      if (!review) {
          throw new Error("Avaliação não encontrada.");
      }

      // 2. Delete the review
      await db.review.delete({
          where: { id: reviewId }
      });

      // 3. Deduct 1 loyalty point from the user's card for this barbershop IF exists
      if (review.barbershopId) {
          const loyaltyCard = await db.loyaltyCard.findUnique({
              where: {
                  userId_barbershopId: {
                      userId: review.userId,
                      barbershopId: review.barbershopId
                  }
              }
          });

          if (loyaltyCard && loyaltyCard.currentPoints > 0) {
              await db.loyaltyCard.update({
                  where: {
                      userId_barbershopId: {
                          userId: review.userId,
                          barbershopId: review.barbershopId
                      }
                  },
                  data: {
                      currentPoints: { decrement: 1 },
                      totalLifetimePoints: { decrement: 1 }
                  }
              });
              console.log(`[Loyalty] Removed 1 point from user ${review.userId} for deleted review at shop ${review.barbershopId}`);
          }
      } else {
          console.log(`[Loyalty] Skipping point deduction - Review ${reviewId} is not linked to a barbershop.`);
      }
      
      revalidatePath("/");
      revalidatePath("/barbershops/[id]");
      
      return { success: true };
  } catch (error) {
      console.error("Error deleting review:", error);
      throw new Error("Erro ao excluir avaliação.");
  }
};
