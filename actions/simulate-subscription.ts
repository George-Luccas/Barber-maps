"use server";

import { protectedActionClient } from "@/lib/action-client";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const inputSchema = z.object({
  planId: z.string().uuid(),
});

export const simulateSubscription = protectedActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { planId }, ctx: { user } }) => {
    
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error("Plano não encontrado");

    // Create or Update Subscription directly
    await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
            status: "ACTIVE",
            current_balance: plan.service_limit,
            next_billing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            planId: plan.id
        },
        create: {
            userId: user.id,
            planId: plan.id,
            current_balance: plan.service_limit,
            status: "ACTIVE",
            next_billing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            gateway_subscription_id: "simulated_" + Math.random().toString(36).substring(7)
        }
    });

    revalidatePath("/settings");
    revalidatePath("/");
    
    return { success: true };
  });
