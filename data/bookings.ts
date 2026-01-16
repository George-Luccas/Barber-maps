import { prisma } from "@/lib/prisma";
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
import { authPrisma } from "@/lib/prisma";

export const getUserBookings = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { confirmedBookings: [], finishedBookings: [] };
  }
  const now = new Date();
  
  // 1. Fetch Bookings from Main DB
  const [confirmedBookingsData, finishedBookingsData] = await Promise.all([
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
  ]);

  // 2. Extract User IDs (in this case it's just the session user, but good pattern for admin views)
  // For the 'User View', the user IS the session user.
  // But if this function is used elsewhere or modified for barbers, we need to map IDs.
  const userIds = new Set([
     ...confirmedBookingsData.map(b => b.userId),
     ...finishedBookingsData.map(b => b.userId)
  ]);

  // 3. Fetch Users from Auth DB
  // @ts-ignore
  const users = await authPrisma.user.findMany({
    where: {
      id: { in: Array.from(userIds) }
    }
  });

  const userMap = new Map(users.map((u: any) => [u.id, u]));

  // 4. Merge Data
  const confirmedBookings = confirmedBookingsData.map(booking => {
    const user = userMap.get(booking.userId) as any;
    return {
      ...booking,
      user: user ? {
        id: user.id,
        name: user.name,
        image: user.image
      } : null
    };
  });

  const finishedBookings = finishedBookingsData.map(booking => {
     const user = userMap.get(booking.userId) as any;
     return {
      ...booking,
      user: user ? {
        id: user.id,
        name: user.name,
        image: user.image
      } : null
    };
  });

  return { confirmedBookings, finishedBookings };
};
