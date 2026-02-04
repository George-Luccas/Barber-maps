import { prisma as db } from "@/lib/prisma";

export interface BookingWithDetails {
  id: string;
  date: Date;
  status: string;
  barbershopId: string;
  barbershop: {
    name: string;
    address: string;
    imageUrl: string | null;
  };
  service: {
    name: string;
    priceInCents: number;
    description: string;
    imageUrl: string;
  };
  Barber: {
    name: string;
  } | null;
  cancelledAt?: Date | null;
}

/**
 * Finds all bookings for a user by email.
 * @param email The user's email address
 * @returns List of bookings with details
 */
export const findUserBookings = async (email: string): Promise<BookingWithDetails[]> => {
  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user) {
    return [];
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: user.id
    },
    include: {
      barbershop: {
        select: {
          name: true,
          address: true,
          imageUrl: true
        }
      },
      service: {
        select: {
          name: true,
          priceInCents: true,
          description: true,
          imageUrl: true
        }
      },
      Barber: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  });

  return bookings;
};
