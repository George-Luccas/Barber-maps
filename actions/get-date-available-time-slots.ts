"use server";

import { actionClient } from "@/lib/action-client";
import { format } from "date-fns";
import { z } from "zod";
import { comercioApi } from "@/services/comercio-api";

const inputSchema = z.object({
  barbershopId: z.uuid(),
  date: z.date(),
  barberId: z.string().optional(),
});

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barbershopId, date } }) => {
    try {
        const formattedDate = format(date, "yyyy-MM-dd");
        
        console.log("Fetching availability from API:", { barbershopId, formattedDate });

        // Fetch directly from API
        const availableTimeSlots = await comercioApi.getAvailability(barbershopId, formattedDate);
        
        return availableTimeSlots;
    } catch (error) {
        console.error("CRITICAL ERROR IN TIME SLOTS ACTION:", error);
        throw error; // Re-throw so client gets error
    }
  });
