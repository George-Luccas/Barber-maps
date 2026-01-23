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
    try {
        const start = startOfDay(date);
        const end = endOfDay(date);
        
        console.log("Processing Request:", { barbershopId, date, barberId });

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

        console.log("Prisma Where:", JSON.stringify(where, null, 2));

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

        // Determine total number of barbers for the shop when no specific barber is selected
        let totalBarbers = 1;
        if (!barberId) {
          const barbershop = await prisma.barbershop.findUnique({
            where: { id: barbershopId },
            select: { Barber: true },
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const count = (barbershop as any)?.Barber?.length ?? 0;
          totalBarbers = count > 0 ? count : 1;
        }

        // Count bookings per time slot
        const occupiedCount: Record<string, number> = {};
        bookings.forEach((booking: any) => {
          const slot = timeFormatter.format(booking.date);
          occupiedCount[slot] = (occupiedCount[slot] || 0) + 1;
        });

        const availableTimeSlots = TIME_SLOTS.filter((slot) => {
          const occupied = occupiedCount[slot] ?? 0;
          // If a specific barber is chosen, slot is free only when no booking for that barber
          // If no barber selected, slot is free when not all barbers are occupied
          return barberId ? occupied === 0 : occupied < totalBarbers;
        });

        return availableTimeSlots;
    } catch (error) {
        console.error("CRITICAL ERROR IN TIME SLOTS ACTION:", error);
        throw error; // Re-throw so client gets error
    }
  });
