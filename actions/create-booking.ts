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

    console.log("CREATE BOOKING INPUT:", { serviceId, barbershopId, date, barberId, userEmail: user.email });

    if (!user.email) {
        console.error("User has no email!", user);
        returnValidationErrors(inputSchema, {
            _errors: ["Usuário sem e-mail cadastrado. Por favor, atualize seu perfil."],
        });
    }

    try {
        console.log(
            "Creating booking via API for service",
            serviceId,
            "at barbershop",
            barbershopId,
            "User Email:",
            user.email 
        );

        const booking = await comercioApi.createBooking({
             barbershopId,
             serviceId,
             barberId: barberId || "",
             date: date.toISOString(),
             // Send both formats to be safe, or prioritizing the one the error requested
             clientName: user.name || "Cliente",  // Keep for legacy/local if needed
             user: {
                name: user.name || "Cliente",
                email: user.email || undefined,
             },
             clientEmail: user.email || undefined,
             clientPhone: (user as any).phone || undefined, // Send phone if available
             isSubscription: parsedInput.isSubscription,
             status: "PENDING"
        });

        return booking;

    } catch (error: any) {
        console.error("CREATE BOOKING ACTION ERROR:", error);
        returnValidationErrors(inputSchema, {
            _errors: [`Erro ao criar agendamento: ${error.message || "Erro desconhecido"}`],
        });
    }
  });
