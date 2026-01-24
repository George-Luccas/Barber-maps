"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LoyaltyTier } from "@prisma/client";

// Constants
const POINTS_FOR_REWARD = 100;

export async function getLoyaltyCard(barbershopId: string, userId: string) {
    try {
        const card = await prisma.loyaltyCard.findUnique({
            where: {
                userId_barbershopId: {
                    userId,
                    barbershopId
                }
            }
        });
        return card;
    } catch (error) {
        console.error("Error fetching loyalty card:", error);
        return null;
    }
}

export async function getUserLoyaltyCards(userId: string) {
    try {
        const cards = await prisma.loyaltyCard.findMany({
            where: {
                userId,
            },
            include: {
                barbershop: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    }
                }
            }
        });

        // Enrich with history (Last 5 completed bookings)
        const cardsWithHistory = await Promise.all(cards.map(async (card) => {
            const lastBookings = await prisma.booking.findMany({
                where: {
                    userId,
                    barbershopId: card.barbershopId,
                    status: "COMPLETED" // Only completed bookings give points
                },
                take: 5,
                orderBy: {
                    date: 'desc'
                },
                include: {
                    service: {
                        select: {
                            name: true,
                            points: true
                        }
                    }
                }
            });

            return {
                ...card,
                transactions: lastBookings.map(booking => ({
                    id: booking.id,
                    serviceName: booking.service.name,
                    points: booking.service.points || 10,
                    date: booking.date
                }))
            };
        }));

        return cardsWithHistory;
    } catch (error) {
        console.error("Error fetching user loyalty cards:", error);
        return [];
    }
}

export async function incrementLoyalty(bookingId: string) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { service: true } // Need service to get points
        });

        if (!booking) throw new Error("Booking not found");
        
        // Ensure user exists (Safety Check)
        const userExists = await prisma.user.findUnique({
            where: { id: booking.userId }
        });

        if (!userExists) {
             console.error(`User ${booking.userId} missing in DB. Cannot create Loyalty Card.`);
             return { success: false, error: "User not found" };
        }

        // Get or Create Loyalty Card
        let card = await prisma.loyaltyCard.upsert({
            where: {
                userId_barbershopId: {
                    userId: booking.userId,
                    barbershopId: booking.barbershopId
                }
            },
            create: {
                userId: booking.userId,
                barbershopId: booking.barbershopId,
                currentPoints: 0,
                totalLifetimePoints: 0,
                freeCuts: 0,
                tier: "BRONZE"
            },
            update: {}
        });

        const pointsEarned = booking.service.points || 10; // Default to 10 if null

        // Calculate new state
        let currentPoints = card.currentPoints + pointsEarned;
        let totalLifetimePoints = card.totalLifetimePoints + pointsEarned;
        let freeCuts = card.freeCuts;
        let tier = card.tier;

        // Check for Reward
        if (currentPoints >= POINTS_FOR_REWARD) {
            // How many rewards earned? (Usually 1 per completion, but handle multiple just in case)
            const rewardsEarned = Math.floor(currentPoints / POINTS_FOR_REWARD);
            freeCuts += rewardsEarned;
            currentPoints = currentPoints % POINTS_FOR_REWARD; // Keep overflow points
        }

        // Tier Progression Logic
        // Bronze: 0-1 Rewards
        // Silver: 2+ Rewards (Reaching 2nd card)
        // Gold: 5+ Rewards (Reaching 5th card)
        // OR based on totalLifetimePoints?
        // Let's use freeCuts (rewards claimed) as a proxy for "cards filled"
        if (freeCuts >= 5) {
            tier = "GOLD";
        } else if (freeCuts >= 2) {
            tier = "SILVER";
        } else {
            tier = "BRONZE";
        }

        // Update Card
        await prisma.loyaltyCard.update({
            where: { id: card.id },
            data: {
                currentPoints,
                totalLifetimePoints,
                freeCuts,
                tier,
                // Keep deprecated field in sync if needed, or ignore.
                completedCuts: Math.floor(currentPoints / 10) // Approx for backward compat
            }
        });

        revalidatePath("/bookings"); 
        revalidatePath(`/barbershops/${booking.barbershopId}`);
        revalidatePath("/"); 

        return { success: true, pointsEarned, totalLifetimePoints };

    } catch (error) {
        console.error("Error updating loyalty:", error);
        return { success: false, error: "Failed to update loyalty" };
    }
}

export async function decrementLoyalty(bookingId: string) {
    try {
        const booking = await prisma.booking.findUnique({
             where: { id: bookingId },
             include: { service: true }
        });

        if (!booking) return;

        const card = await prisma.loyaltyCard.findUnique({
            where: {
                userId_barbershopId: {
                    userId: booking.userId,
                    barbershopId: booking.barbershopId
                }
            }
        });

        if (!card) return;

        const pointsToRevert = booking.service.points || 10;

        let currentPoints = card.currentPoints - pointsToRevert;
        let totalLifetimePoints = card.totalLifetimePoints - pointsToRevert;
        let freeCuts = card.freeCuts;
        let tier = card.tier;

        // Handle points going negative (User un-earned a reward)
        while (currentPoints < 0) {
            if (freeCuts > 0) {
                freeCuts -= 1;
                currentPoints += POINTS_FOR_REWARD;
            } else {
                currentPoints = 0; // Floor at 0 if no rewards to take back
                break;
            }
        }
        
        if (totalLifetimePoints < 0) totalLifetimePoints = 0;

        // Re-evaluate Tier (Downgrade possible)
        if (freeCuts >= 5) {
            tier = "GOLD";
        } else if (freeCuts >= 2) {
            tier = "SILVER";
        } else {
            tier = "BRONZE";
        }

        await prisma.loyaltyCard.update({
            where: { id: card.id },
            data: {
                currentPoints,
                totalLifetimePoints,
                freeCuts,
                tier,
                completedCuts: Math.floor(currentPoints / 10)
            }
        });

        revalidatePath("/bookings"); 
        revalidatePath(`/barbershops/${booking.barbershopId}`);
        revalidatePath("/"); 

    } catch (error) {
        console.error("Error decrementing loyalty:", error);
    }
}
