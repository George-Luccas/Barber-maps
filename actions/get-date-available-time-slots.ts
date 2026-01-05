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
    const where: any = {
      barbershopId,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      cancelledAt: null,
    };

    // If a barber is selected, check availability specifically for them
    if (barberId) {
      where.barberId = barberId;
    }

    const bookings = await prisma.booking.findMany({
      where,
    });
    const occupiedSlots = bookings.map(
      (booking) => format(booking.date, "HH:mm"), // [12:00, 14:00]
    );
    const availableTimeSlots = TIME_SLOTS.filter(
      (slot) => !occupiedSlots.includes(slot),
    );
    return availableTimeSlots;
  });
