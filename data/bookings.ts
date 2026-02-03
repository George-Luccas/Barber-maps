import { prisma } from "@/lib/prisma";
import { comercioApi } from "@/services/comercio-api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { barbershop: true; service: true };
}> & {
  user?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  isSubscription?: boolean;
};

// Helper to separate Booking data from Auth data
// import { authPrisma } from "@/lib/prisma"; // Removed

export const getUserBookings = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { confirmedBookings: [], finishedBookings: [] };
  }
  const now = new Date();
  
  // 1. Fetch Bookings from Main DB and External API
  const [confirmedBookingsData, finishedBookingsData, externalBookingsData] = await Promise.all([
    prisma.booking.findMany({
      where: {
        userId: session.user.id,
        date: { gte: now },
        cancelledAt: null,
      },
      include: {
        barbershop: true,
        service: true,
      },
      orderBy: { date: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        userId: session.user.id,
        OR: [{ date: { lt: now } }, { cancelledAt: { not: null } }],
      },
      include: {
        barbershop: true,
        service: true,
      },
      orderBy: { date: "desc" },
    }),
    // 2. Fetch Bookings from External API (Comercio)
    session.user.email ? comercioApi.getUserBookings(session.user.email) : Promise.resolve([])
  ]);

  // Map external bookings to match internal schema
  const externalBookings = (Array.isArray(externalBookingsData) ? externalBookingsData : []).map(b => ({
      ...b,
      // Ensure barbershop has required fields for UI
      barbershop: {
          id: b.barbershopId,
          name: b.barbershop?.name || "Barbearia Externa",
          imageUrl: b.barbershop?.imageUrl || "",
          address: b.barbershop?.address || "",
          ...b.barbershop
      },
      service: {
          id: b.serviceId,
          name: b.service?.name || "Serviço",
          priceInCents: b.service?.priceInCents || 0,
          ...b.service
      },
      barber: b.Barber ? {
          id: b.barberId,
          name: b.Barber.name,
          ...b.Barber
      } : null,
      isExternal: true // Flag to identify API bookings
  }));

  // Split external bookings into confirmed/finished
  const confirmedExternal = externalBookings.filter(b => new Date(b.date) >= now && !b.cancelledAt && b.status !== 'CANCELLED');
  const finishedExternal = externalBookings.filter(b => new Date(b.date) < now || b.cancelledAt || b.status === 'CANCELLED');

  // Combine lists
  const allConfirmed = [...confirmedBookingsData, ...confirmedExternal].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const allFinished = [...finishedBookingsData, ...finishedExternal].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  // 2. Extract User IDs (in this case it's just the session user, but good pattern for admin views)
  // For the 'User View', the user IS the session user.
  // But if this function is used elsewhere or modified for barbers, we need to map IDs.
  const userIds = new Set([
     ...confirmedBookingsData.map(b => b.userId),
     ...finishedBookingsData.map(b => b.userId)
     // External bookings might not have local user IDs, so we skip adding them here or handle carefully
  ]);

  // 3. Fetch Users from Auth DB
  const users = await prisma.user.findMany({
    where: {
      id: { in: Array.from(userIds) }
    }
  });

  const userMap = new Map(users.map((u: any) => [u.id, u]));

  // 4. Merge Data (User Info)
  
  // Helper to attach user info (only for internal bookings usually, but we apply generally)
  const attachUser = (booking: any) => {
      // If it's external, it might not have a mapped userId in our auth DB, 
      // but 'session.user' is effectively the user. 
      // For now, only map if we found it in userMap.
      const user = userMap.get(booking.userId);
      return {
          ...booking,
          user: user ? {
              id: user.id,
              name: user.name,
              image: user.image
          } : null
      };
  };

  const confirmedBookings = allConfirmed.map(attachUser);
  const finishedBookings = allFinished.map(attachUser);



  return { confirmedBookings, finishedBookings };
};
