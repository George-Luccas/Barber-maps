
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Assuming you have an auth helper to get current session
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitFeedback(data: { type: string; message: string }) {
    try {
        let userId: string | null = null;
        try {
            const session = await auth.api.getSession({
                headers: await headers()
            });
            userId = session?.user?.id || null;
        } catch (authError) {
             console.error("Auth session check failed, proceeding as anonymous:", authError);
        }

        await prisma.platformFeedback.create({
            data: {
                type: data.type as any, // Cast to enum
                message: data.message,
                userId: userId || null,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("FULL ERROR DETAILS:", JSON.stringify(error, null, 2));
        console.error("Error message:", (error as Error).message);
        return { success: false, error: "Failed to submit feedback" };
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
