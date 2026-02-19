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
  receiptUrl?: string | null;
};

// Helper to separate Booking data from Auth data
// import { authPrisma } from "@/lib/prisma"; // Removed

export const getUserBookings = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { confirmedBookings: [], pendingBookings: [], finishedBookings: [] };
  }
  const now = new Date();
  
  // 1. Fetch Bookings from Main DB and External API
  const [confirmedBookingsData, pendingBookingsData, finishedBookingsData, externalBookingsData] = await Promise.all([
    prisma.booking.findMany({
      where: {
        userId: session.user.id,
        date: { gte: now },
        cancelledAt: null,
        status: "CONFIRMED"
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
        date: { gte: now },
        cancelledAt: null,
        status: "PENDING"
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
        OR: [{ date: { lt: now } }, { cancelledAt: { not: null } }, { status: "CANCELLED" }, { status: "COMPLETED" }],
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

  // ... (mapping external bookings code is same) ...
  const externalBookings = (Array.isArray(externalBookingsData) ? externalBookingsData : []).map(b => ({
      ...b,
      date: new Date(b.date),
      // Ensure barbershop has required fields for UI
      barbershop: {
          id: b.barbershopId,
          name: b.barbershop?.name || "Barbearia Externa",
          imageUrl: b.barbershop?.imageUrl || "",
          address: b.barbershop?.address || "",
          phones: b.barbershop?.phones || [], 
          ...b.barbershop
      },
      service: {
          id: b.serviceId,
          name: b.service?.name || "Serviço",
          priceInCents: Number(b.service?.priceInCents) || 0,
          ...b.service
      },
      barber: b.Barber ? {
          id: b.barberId,
          name: b.Barber.name,
          ...b.Barber
      } : null,
      isExternal: true 
  }));

  // Split external bookings
  const confirmedExternal = externalBookings.filter(b => new Date(b.date) >= now && !b.cancelledAt && b.status === 'CONFIRMED');
  const pendingExternal = externalBookings.filter(b => new Date(b.date) >= now && !b.cancelledAt && b.status === 'PENDING');
  const finishedExternal = externalBookings.filter(b => new Date(b.date) < now || b.cancelledAt || b.status === 'CANCELLED' || b.status === 'COMPLETED');

  // Combine lists
  const allConfirmed = [...confirmedBookingsData, ...confirmedExternal]
    .filter(b => !isNaN(new Date(b.date).getTime())) 
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const allPending = [...pendingBookingsData, ...pendingExternal]
    .filter(b => !isNaN(new Date(b.date).getTime())) 
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const allFinished = [...finishedBookingsData, ...finishedExternal]
    .filter(b => !isNaN(new Date(b.date).getTime())) 
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  // 2. Extract User IDs
  const userIds = new Set([
     ...confirmedBookingsData.map(b => b.userId),
     ...pendingBookingsData.map(b => b.userId),
     ...finishedBookingsData.map(b => b.userId)
  ]);

  // 3. Fetch Users from Auth DB
  // ... (same user fetching block) ...
  const users = await prisma.user.findMany({
    where: {
      id: { in: Array.from(userIds) }
    }
  });

  const userMap = new Map(users.map((u: any) => [u.id, u]));

  const attachUser = (booking: any) => {
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

  return { 
      confirmedBookings: allConfirmed.map(attachUser), 
      pendingBookings: allPending.map(attachUser),
      finishedBookings: allFinished.map(attachUser) 
  };
};
