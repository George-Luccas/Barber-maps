"use server";

import { prisma } from "@/lib/prisma";
import { protectedActionClient } from "@/lib/action-client";

export const getUserMembership = protectedActionClient
  .action(async ({ ctx: { user } }) => {
    
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        Plan: true,
      },
    });

    if (!subscription) {
        return null; // Not a subscriber
    }

    // Check if subscription is active or technically valid (e.g. within grace period logic if any, but simplistic for now)
    // We rely on status ENUM
    
    return subscription;
  });
