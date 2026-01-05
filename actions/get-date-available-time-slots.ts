"use server";

import { actionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { endOfDay, format, startOfDay } from "date-fns";
import { z } from "zod";

const inputSchema = z.object({
  barbershopId: z.uuid(),
  date: z.date(),
  barberId: z.string().optional(),
});

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barbershopId, date, barberId } }) => {
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    const where: any = {
      barbershopId,
      date: {
        gte: start,
        lte: end,
      },
      cancelledAt: null,
    };

    if (barberId) {
      where.barberId = barberId;
    }

    const bookings = await prisma.booking.findMany({
      where,
    });
    
    // Use Intl.DateTimeFormat to ensure we get the time in Sao Paulo time, regardless of server timezone
    const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const occupiedSlots = bookings.map(
      (booking) => timeFormatter.format(booking.date), // "09:00"
    );
    
    const availableTimeSlots = TIME_SLOTS.filter(
      (slot) => !occupiedSlots.includes(slot),
    );

    return availableTimeSlots;
  });
