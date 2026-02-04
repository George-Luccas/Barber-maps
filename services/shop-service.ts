import { prisma } from "@/lib/prisma";

export interface ShopDetails {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
  phones: string[];
  city: string;
  isOpen: boolean;
  latitude: number;
  longitude: number;
  photos: string[];
  styles: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  products: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    priceInCents: number;
    quantity: number;
  }[];
  aboutUs?: string;
}

export interface ShopServices {
  services: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    priceInCents: number;
    points: number | null;
  }[];
  barbers: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
}

export const getShopDetails = async (id: string): Promise<ShopDetails | null> => {
  console.log(`[ShopService] Fetching details for ID: ${id}`);
  const barbershop = await prisma.barbershop.findUnique({
    where: { id },
    include: {
      Style: true,
      BarbershopProduct: true,
    },
  });

  if (!barbershop) {
    console.error(`[ShopService] Shop not found for ID: ${id}`);
    return null;
  }
  console.log(`[ShopService] Shop found: ${barbershop.name}`);

  return {
    id: barbershop.id,
    name: barbershop.name,
    address: barbershop.address,
    description: barbershop.description,
    imageUrl: barbershop.imageUrl || "",
    phones: barbershop.phones,
    city: barbershop.city || "",
    isOpen: barbershop.isOpen,
    latitude: barbershop.latitude ? Number(barbershop.latitude) : 0,
    longitude: barbershop.longitude ? Number(barbershop.longitude) : 0,
    photos: barbershop.photos,
    styles: barbershop.Style.map((s) => ({
      id: s.id,
      name: s.name,
      imageUrl: s.imageUrl,
    })),
    products: barbershop.BarbershopProduct.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      imageUrl: p.imageUrl,
      priceInCents: p.priceInCents,
      quantity: p.quantity,
    })),
    aboutUs: barbershop.aboutUs || undefined,
  };
};

export const getShopServicesData = async (id: string): Promise<ShopServices> => {
  const barbershop = await prisma.barbershop.findUnique({
    where: { id },
    include: {
      services: {
        where: {
          deletedAt: null
        }
      },
      Barber: true,
    },
  });

  if (!barbershop) {
    return { services: [], barbers: [] };
  }

  const services = barbershop.services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    imageUrl: s.imageUrl,
    priceInCents: s.priceInCents,
    points: s.points,
  }));

  const barbers = barbershop.Barber.map((b) => ({
    id: b.id,
    name: b.name,
    imageUrl: b.imageUrl || "",
  }));

  return { services, barbers };
};
