export const queryKeys = {
  getDateAvailableTimeSlots: (barbershopId: string, date?: Date, barberId?: string) => [
    "date-available-time-slots",
    barbershopId,
    date?.toISOString(),
    barberId,
  ],
};
