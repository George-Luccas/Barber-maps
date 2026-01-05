"use server"; // don't forget to add this!

import { z } from "zod";
import { protectedActionClient } from "@/lib/action-client";
import { returnValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { isPast } from "date-fns";

// This schema is used to validate input from client.
const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
  barberId: z.string().optional(),
});

export const createBooking = protectedActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { serviceId, date, barberId } = parsedInput;
    if (isPast(date)) {
      returnValidationErrors(inputSchema, {
        _errors: ["Data e hora selecionadas já passaram."],
      });
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
        displayDate: new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          dateStyle: "long",
          timeStyle: "short",
        }).format(date),
      },
    });
    return booking;
  });
