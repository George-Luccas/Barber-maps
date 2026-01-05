import { getDateAvailableTimeSlots } from "@/actions/get-date-available-time-slots";
import { queryKeys } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useGetDateAvailableTimeSlots = ({
  barbershopId,
  date,
  barberId,
}: {
  barbershopId: string;
  date?: Date;
  barberId?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.getDateAvailableTimeSlots(barbershopId, date, barberId),
    queryFn: () =>
      getDateAvailableTimeSlots({
        barbershopId,
        date: date!,
        barberId,
      }),
    enabled: Boolean(date),
  });
};
