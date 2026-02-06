import { prisma } from "@/lib/prisma";

export interface BarberWithShop {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  imageUrl: string | null;
  barbershopId: string;
  barbershop: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
  };
  _count?: {
    Booking: number;
  };
}

export async function getBarbers(): Promise<BarberWithShop[]> {
  try {
    const barbers = await prisma.barber.findMany({
      include: {
        Barbershop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    return barbers.map((barber) => ({
      id: barber.id,
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      imageUrl: barber.imageUrl,
      barbershopId: barber.barbershopId,
      barbershop: {
        id: barber.Barbershop.id,
        name: barber.Barbershop.name,
        address: barber.Barbershop.address,
        imageUrl: barber.Barbershop.imageUrl,
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar barbeiros:", error);
    return [];
  }
}

export async function getPopularBarbers(): Promise<BarberWithShop[]> {
  try {
    // Get barbers with most bookings
    const barbers = await prisma.barber.findMany({
      include: {
        Barbershop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
          }
        },
        _count: {
          select: { Booking: true }
        }
      },
      orderBy: {
        Booking: {
          _count: "desc"
        }
      },
      take: 10
    });

    return barbers.map((barber) => ({
      id: barber.id,
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      imageUrl: barber.imageUrl,
      barbershopId: barber.barbershopId,
      barbershop: {
        id: barber.Barbershop.id,
        name: barber.Barbershop.name,
        address: barber.Barbershop.address,
        imageUrl: barber.Barbershop.imageUrl,
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar barbeiros populares:", error);
    return [];
  }
}

export async function getBarberById(id: string): Promise<BarberWithShop | null> {
  try {
    const barber = await prisma.barber.findUnique({
      where: { id },
      include: {
        Barbershop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
          }
        },
        _count: {
          select: { Booking: true }
        }
      }
    });

    if (!barber) return null;

    return {
      id: barber.id,
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      imageUrl: barber.imageUrl,
      barbershopId: barber.barbershopId,
      barbershop: {
        id: barber.Barbershop.id,
        name: barber.Barbershop.name,
        address: barber.Barbershop.address,
        imageUrl: barber.Barbershop.imageUrl,
      },
      _count: barber._count,
    };
  } catch (error) {
    console.error("Erro ao buscar barbeiro:", error);
    return null;
  }
}

export interface BarberWithRanking {
  id: string;
  name: string;
  imageUrl: string | null;
  bookingsCount: number;
  barbershop: {
    id: string;
    name: string;
  };
}

export async function getBarberRanking(): Promise<BarberWithRanking[]> {
  try {
    const barbers = await prisma.barber.findMany({
      include: {
        Barbershop: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: { Booking: true }
        }
      },
      orderBy: {
        Booking: {
          _count: "desc"
        }
      },
      take: 10
    });

    return barbers.map((barber) => ({
      id: barber.id,
      name: barber.name,
      imageUrl: barber.imageUrl,
      bookingsCount: barber._count.Booking,
      barbershop: {
        id: barber.Barbershop.id,
        name: barber.Barbershop.name,
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar ranking de barbeiros:", error);
    return [];
  }
}

