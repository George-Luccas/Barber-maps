// Data Access Layer
import { prisma } from "@/lib/prisma";

interface GetBarbershopsProps {
  city?: string;
  state?: string;
  search?: string;
}

export const getBarbershops = async (props?: GetBarbershopsProps) => {
  const where: any = {};
  if (props?.city) {
      where.city = {
          contains: props.city,
          mode: "insensitive",
      };
  }
  if (props?.state) where.state = props.state;
  if (props?.search) {
      where.name = {
        contains: props.search,
        mode: "insensitive",
      };
  }

  const barbershops = await prisma.barbershop.findMany({
    where,
  });
  return barbershops;
};

export const getAvailableLocations = async () => {
   const barbershops = await prisma.barbershop.findMany({
    select: {
      city: true,
      state: true,
    },
    distinct: ['city', 'state'],
   });
   return barbershops.filter(b => b.city && b.state);
};

export const getPopularBarbershops = async () => {
  const popularBarbershops = await prisma.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  });
  return popularBarbershops;
};

export const getBarbershopById = async (id: string) => {
  const barbershop = await prisma.barbershop.findUnique({
    where: { id },
    include: {
      services: true,
      Style: true,
      BarbershopProduct: true,
      Barber: true,
    },
  });
  return barbershop;
};

export const getBarbershopsByServiceName = async (serviceName: string) => {
  const barbershops = await prisma.barbershop.findMany({
    where: {
      services: {
        some: {
          name: {
            contains: serviceName,
            mode: "insensitive",
          },
        },
      },
    },
  });
  return barbershops;
};
export const getBarbershopsWithStories = async () => {
    const barbershops = await prisma.barbershop.findMany({
        orderBy: {
            name: "asc", 
        },
        include: {
           Style: {
               orderBy: {
                   createdAt: 'desc'
               },
               take: 5 
           }
        },
        take: 10 // Limit stories to 10 barbershops for now
    });
    // Filter out barbershops without styles if we strictly want work photos, 
    // or keep them to show cover photo as story.
    // User plan: "Se não houver cortes recentes, mostramos a foto de capa."
    return barbershops;
};
export const getBarbershopRanking = async () => {
  const barbershops = await prisma.barbershop.findMany({
    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      bookings: {
        _count: "desc",
      },
    },
    take: 10,
  });

  return barbershops.map((b) => ({
    ...b,
    bookingsCount: b._count.bookings,
  }));
};
