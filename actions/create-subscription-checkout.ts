"use server";

import { protectedActionClient } from "@/lib/action-client";
import z from "zod";
import Stripe from "stripe";
import { returnValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  planId: z.string().uuid(),
});

export const createSubscriptionCheckoutSession = protectedActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { planId }, ctx: { user } }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      returnValidationErrors(inputSchema, {
        _errors: ["Chave de API do Stripe não encontrada."],
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-07-30.basil", // Use latest or matching api version
    });

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      returnValidationErrors(inputSchema, {
        _errors: ["Plano não encontrado."],
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findUnique({
        where: { userId: user.id }
    });
    if (existingSubscription && existingSubscription.status === "ACTIVE") {
         returnValidationErrors(inputSchema, {
            _errors: ["Você já possui uma assinatura ativa."],
         });
    }

    // Create session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
      metadata: {
        userId: user.id,
        planId: plan.id,
      },
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: Number(plan.price) * 100, // Convert to cents
            recurring: {
                interval: "month"
            },
            product_data: {
              name: plan.name,
              description: plan.description ?? "Assinatura Mensal",
            },
          },
          quantity: 1,
        },
      ],
    });

    return checkoutSession;
  });
