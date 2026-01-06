import { authPrisma, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import z from "zod";

const metadataSchema = z.object({
  serviceId: z.uuid(),
  barbershopId: z.uuid(),
  userId: z.string(),
  date: z.string(),
  appliedDiscount: z.string().optional(),
});

export const POST = async (request: Request) => {
  if (
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.STRIPE_WEBHOOK_SECRET_KEY
  ) {
    console.error("STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const body = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET_KEY,
  ); // SHA256 HMAC signature
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Check if it is a subscription checkout
    if (session.mode === 'subscription') {
        // Validation for subscription checkout
        const subMetadataSchema = z.object({
            userId: z.string(),
            planId: z.string().uuid(),
        });
        const subMetadata = subMetadataSchema.parse(session.metadata);
        
        await prisma.subscription.create({
            data: {
                userId: subMetadata.userId,
                planId: subMetadata.planId,
                gateway_subscription_id: session.subscription as string,
                current_balance: 2, // Initial balance
                status: "ACTIVE",
                // Set billing date to 1 month from now for simplicity, or fetch from stripe subscription object
                next_billing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            }
        });
        console.log("Subscription activated for user:", subMetadata.userId);
        return NextResponse.json({ received: true });
    }

    // Normal Booking Checkout
    const metadata = metadataSchema.parse(session.metadata);
    const expandedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["payment_intent"],
      },
    );
    const paymentIntent =
      expandedSession.payment_intent as Stripe.PaymentIntent;
    const chargeId =
      typeof paymentIntent.latest_charge === "string"
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id;
    await prisma.booking.create({
      data: {
        serviceId: metadata.serviceId,
        barbershopId: metadata.barbershopId,
        userId: metadata.userId,
        date: metadata.date,
        stripeChargeId: chargeId,
      },
    });
    
    if (metadata.appliedDiscount === "500") {
      await authPrisma.user.update({
        where: { id: metadata.userId },
        data: { welcomeDiscountUsed: true } as any,
      });
    }

    console.log(
      "Booking created via webhook for service",
      metadata.serviceId,
      "at barbershop",
      metadata.barbershopId,
    );
  } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((invoice as any).subscription) {
          const subscriptionId = (invoice as any).subscription as string;
          // Find our subscription record
          const dbSubscription = await prisma.subscription.findFirst({
              where: { gateway_subscription_id: subscriptionId }
          });

          if (dbSubscription) {
              await prisma.subscription.update({
                  where: { id: dbSubscription.id },
                  data: {
                      current_balance: 2, // Reset balance on renewal
                      status: "ACTIVE",
                      next_billing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Extend validity
                  }
              });
              console.log("Subscription renewed for user:", dbSubscription.userId);
          }
      }
  }

  return NextResponse.json({ received: true });
};
