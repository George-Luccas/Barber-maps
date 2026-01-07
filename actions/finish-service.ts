"use server";

import { prisma } from "@/lib/prisma";
import { protectedActionClient } from "@/lib/action-client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const finishServiceSchema = z.object({
  bookingId: z.string().uuid(),
  // Potentially add barberId or other verification here
});

export const finishService = protectedActionClient
  .inputSchema(finishServiceSchema)
  .action(async ({ parsedInput: { bookingId }, ctx: { user } }) => {
    
    // 1. Fetch Booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Agendamento não encontrado.");
    }

    if (!booking.isSubscription) {
        // If not subscription, just potentially mark as completed if we had a status field (currently inferred by date)
        // For now, this action is specifically for "Check-in" of Subscription usage
        return { message: "Agendamento não é via assinatura. Nenhuma ação necessária." };
    }

    // 2. Fetch User Subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: booking.userId },
    });

    if (!subscription) {
      throw new Error("Assinatura do cliente não encontrada.");
    }

    // 3. Transactions: Deduct Credit & Log Usage & Update Booking (if we added a status field, which we haven't yet, so we just log)
    // We check if it was already used to avoid double deduction? 
    const existingLog = await prisma.usageLog.findUnique({
        where: { bookingId: booking.id }
    });

    if (existingLog) {
         return { message: "Crédito já foi descontado para este agendamento." };
    }

    await prisma.$transaction(async (tx) => {
        // Decrement Balance
        await tx.subscription.update({
            where: { id: subscription.id },
            data: {
                current_balance: {
                    decrement: 1
                }
            }
        });

        // Create Log
        await tx.usageLog.create({
            data: {
                subscriptionId: subscription.id,
                bookingId: booking.id,
                date_used: new Date()
            }
        });
    });

    revalidatePath("/admin"); // Refresh admin dashboard
    revalidatePath("/bookings"); 
    revalidatePath("/"); 
    revalidatePath("/settings"); 

    return { success: true, message: "Check-in realizado e crédito descontado." };
});
