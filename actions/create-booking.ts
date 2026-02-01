"use server"; // don't forget to add this!

import { z } from "zod";
import { protectedActionClient } from "@/lib/action-client";
import { returnValidationErrors } from "next-safe-action";
import { isPast } from "date-fns";
import { comercioApi } from "@/services/comercio-api";

// This schema is used to validate input from client.
const inputSchema = z.object({
  serviceId: z.uuid(),
  barbershopId: z.uuid(),
  date: z.date(),
  barberId: z.string().optional(),
  isSubscription: z.boolean().optional(),
});

export const createBooking = protectedActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { serviceId, barbershopId, date, barberId } = parsedInput;

    if (isPast(date)) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já passaram."],
      });
    }

    try {
        console.log(
            "Creating booking via API for service",
            serviceId,
            "at barbershop",
            barbershopId
        );

        const booking = await comercioApi.createBooking({
             barbershopId,
             serviceId,
             barberId: barberId || "",
             date: date.toISOString(),
             clientName: user.name || "Cliente",
             clientEmail: user.email || undefined,
             clientPhone: undefined,
             isSubscription: parsedInput.isSubscription
        });

        return booking;

    } catch (error: any) {
        returnValidationErrors(inputSchema, {
            _errors: [error.message || "Erro ao criar agendamento na API."],
        });
    }
  });
