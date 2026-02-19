import { isFuture } from "date-fns";

export type BookingStatus = "confirmed" | "finished" | "cancelled" | "pending";

export function getBookingStatus(
  date: Date,
  cancelledAt: Date | null,
  status?: string // Optional for backward compatibility, but preferred
): BookingStatus {
  if (cancelledAt || status === "CANCELLED") {
    return "cancelled";
  }
  if (status === "PENDING") {
      return "pending";
  }
  if (date < new Date() && status !== "CONFIRMED") {
      return "finished";
  }
  if (isFuture(date)) {
    return "confirmed";
  }
  return "finished";
}
