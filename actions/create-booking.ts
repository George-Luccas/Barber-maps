"use server"; // don't forget to add this!

import { z } from "zod";
import { protectedActionClient } from "@/lib/action-client";
import { returnValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { isPast } from "date-fns";
import { isServiceEligibleForPlan } from "@/lib/utils";

// import { authPrisma } from "@/lib/prisma"; // Removed
import { incrementLoyalty } from "@/app/_actions/loyalty";

// This schema is used to validate input from client.
const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
  barberId: z.string().optional(),
  isSubscription: z.boolean().optional(),
});

export const createBooking = protectedActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { serviceId, date, barberId, isSubscription } = parsedInput;
    if (isPast(date)) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já passaram."],
      });
    }

    if (isSubscription) {
        const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id },
            include: { Plan: true }
        });

        if (!subscription || subscription.status !== "ACTIVE") {
             returnValidationErrors(inputSchema, {
                _errors: ["Assinatura inativa ou não encontrada."],
             });
        }

        // Calculate Effective Balance
        // Balance = CurrentBalance - Pending Future Subscription Bookings
        const pendingBookingsCount = await prisma.booking.count({
            where: {
                userId: user.id,
                isSubscription: true,
                date: { gte: new Date() }, // Future bookings
                cancelledAt: null
            }
        });

        const effectiveBalance = subscription!.current_balance - pendingBookingsCount;

        if (effectiveBalance <= 0) {
            returnValidationErrors(inputSchema, {
                _errors: ["Saldo de créditos insuficiente para este agendamento."],
             });
        }
    }

    const service = await prisma.barbershopService.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        barbershop: true,
      },
    });
    // Serviço existe?
    if (!service) {
      returnValidationErrors(inputSchema, {
        _errors: [
          "Serviço não encontrado. Por favor, selecione outro serviço.",
        ],
      });
    }
    
    // Barbearia aberta?
    if (!service.barbershop.isOpen) {
      returnValidationErrors(inputSchema, {
        _errors: ["A barbearia está fechada no momento."],
      });
    }

    // Validate Subscription Eligibility for Service Type
    if (isSubscription) {
        if (!isServiceEligibleForPlan(service.name)) {
             returnValidationErrors(inputSchema, {
                _errors: ["O plano de assinatura é exclusivo para cortes de cabelo (não inclui combos, barba, etc)."],
            });
        }
    }

    // Já tem agendamento pra esse horário?
    const existingBooking = await prisma.booking.findFirst({
      where: {
        barbershopId: service.barbershopId,
        date,
        cancelledAt: null,
      },
    });
    if (existingBooking) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já estão agendadas."],
      });
    }

    // Check for Welcome Discount
    let isWelcomeDiscount = false;
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (dbUser?.welcomeDiscountClaimed && !dbUser.welcomeDiscountUsed) {
        isWelcomeDiscount = true;
    }

    console.log(
      "Creating booking for service",
      serviceId,
      "at barbershop",
      service.barbershopId,
    );
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date: date,
        userId: user.id,
        userName: user.name,
        barbershopId: service.barbershopId,
        barberId: parsedInput.barberId,
        isSubscription: !!isSubscription,
        isWelcomeDiscount: isWelcomeDiscount,
      },
    });

    if (isWelcomeDiscount) {
        await prisma.user.update({
            where: { id: user.id },
            data: { welcomeDiscountUsed: true } as any
        });
    }

    // Increment loyalty card immediately
    await incrementLoyalty(booking.id);

    return booking;
  });
