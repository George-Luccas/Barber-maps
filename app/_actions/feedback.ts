
"use server";

import { prisma, authPrisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Assuming you have an auth helper to get current session
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitFeedback(data: { type: string; message: string }) {
    try {
        // Safe check for DB URL to debug connection issues
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined");
        }

        let userId: string | null = null;
        try {
            const session = await auth.api.getSession({
                headers: await headers()
            });
            userId = session?.user?.id || null;
        } catch (authError) {
             console.error("Auth session check failed, proceeding as anonymous:", authError);
        }

        console.log(`Submitting feedback for user: ${userId || 'anonymous'}, type: ${data.type}`);

        if (userId) {
            // 1. Check if user exists in the AUTH database (Source of Truth)
            const authUser = await authPrisma.user.findUnique({
                where: { id: userId }
            });

            if (!authUser) {
                 console.error(`User ID ${userId} not found in AUTH database.`);
                 throw new Error("Usuário não encontrado. Por favor, faça login novamente.");
            }

            // 2. Check if user exists in the MAIN database (For Feedback FK)
            const mainUser = await prisma.user.findUnique({
                where: { id: userId }
            });

            // 3. Replicate User to Main DB if missing
            if (!mainUser) {
                console.log(`Replicating user ${userId} to Main DB...`);
                await prisma.user.create({
                    data: {
                        id: authUser.id,
                        name: authUser.name,
                        email: authUser.email,
                        emailVerified: authUser.emailVerified,
                        image: authUser.image,
                        createdAt: authUser.createdAt,
                        updatedAt: authUser.updatedAt,
                        role: authUser.role || "CLIENT",
                    }
                });
            }
        }

        await prisma.platformFeedback.create({
            data: {
                type: data.type as any,
                message: data.message,
                userId: userId,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("FULL ERROR DETAILS:", JSON.stringify(error, null, 2));
        const errorMessage = (error as Error).message || "Unknown error occurred";
        console.error("Error message:", errorMessage);
        return { success: false, error: errorMessage };
    }
}

export async function getFeedbackMetrics() {
    try {
        const total = await prisma.platformFeedback.count();
        
        const byType = await prisma.platformFeedback.groupBy({
            by: ["type"],
            _count: {
                type: true
            }
        });

        return { total, byType };
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return { total: 0, byType: [] };
    }
}

export async function getFeedbacks() {
    try {
        const feedbacks = await prisma.platformFeedback.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            take: 50 // Limit for now
        });
        return feedbacks;
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
}

export async function deleteFeedback(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        await prisma.platformFeedback.delete({
            where: {
                id
            }
        });
        
        revalidatePath("/admin/feedback");
        return { success: true };
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return { success: false, error: "Failed to delete feedback" };
    }
}
