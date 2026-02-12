import { prisma as db } from "@/lib/prisma";
/**
 * Busca barbeiros exclusivamente da API do Comercio
 */

const COMERCIO_API_URL = process.env.NEXT_PUBLIC_COMERCIO_API_URL || process.env.COMERCIO_API_URL || "http://localhost:3001/api/external/v1";
const COMERCIO_API_KEY = process.env.COMERCIO_API_KEY || "";

// Log para debug
console.log("[Barbers] API URL:", COMERCIO_API_URL);
console.log("[Barbers] API Key exists:", !!COMERCIO_API_KEY);

// Headers padrão para autenticação na API do Comercio
const getApiHeaders = () => ({
  "Content-Type": "application/json",
  ...(COMERCIO_API_KEY && { "Authorization": `Bearer ${COMERCIO_API_KEY}` }),
});

export interface BarberFromAPI {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  imageUrl: string | null;
  bio: string | null;
  yearsOfExperience: number;
  workplaceName: string | null;
  isAutonomous: boolean;
  specialties: string[];
  bookingsCount: number;
  accountType: string;
}

export interface BarberWithShop {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  instagram?: string | null;
  imageUrl: string | null;
  bio?: string | null;
  yearsOfExperience?: number;
  specialties?: string[];
  bookingsCount?: number;
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

/**
 * Busca todos os barbeiros da API do Comercio
 */
export async function getBarbers(): Promise<BarberWithShop[]> {
  try {
    const response = await fetch(`${COMERCIO_API_URL}/barbers`, {
      headers: getApiHeaders(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("[Barbers] Erro ao buscar da API:", response.status);
      return [];
    }

    const data = await response.json();
    const barbers = data.barbers || [];

    // Fetch local overrides (Instagram)
    let localBarbersMap = new Map<string, string | null>();
    try {
        const localBarbers = await db.barber.findMany({
            // @ts-ignore
            select: { id: true, instagram: true }
        });
        localBarbers.forEach(b => localBarbersMap.set(b.id, b.instagram));
    } catch (e) {
        console.error("Failed to fetch local barber attributes", e);
    }

    return barbers.map((barber: any) => ({
      id: barber.id,
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      instagram: localBarbersMap.get(barber.id) || null,
      imageUrl: barber.image || barber.imageUrl, // API pode retornar image ou imageUrl
      bio: barber.bio || "Barbeiro profissional com anos de experiência em cortes modernos e clássicos.",
      yearsOfExperience: barber.yearsOfExperience || Math.floor(Math.random() * 10) + 1, // Fallback randomico se não tiver na API
      specialties: barber.specialties || ["Corte Degradê", "Barba Lenhador", "Pigmentação"],
      bookingsCount: barber.bookingsCount || 0,
      barbershopId: barber.isAutonomous ? "autonomo" : (barber.barbershopId || barber.id),
      barbershop: {
        id: barber.isAutonomous ? "autonomo" : (barber.barbershopId || barber.id),
        name: barber.workplaceName || "Autônomo",
        address: barber.isAutonomous ? "Barbeiro Autônomo" : (barber.workplaceName || ""),
        imageUrl: barber.image || barber.imageUrl,
      },
      _count: {
        Booking: barber.bookingsCount || 0,
      }
    }));
  } catch (error) {
    console.error("[Barbers] Erro ao buscar barbeiros:", error);
    return [];
  }
}

/**
 * Busca barbeiros populares (ordenados por bookings)
 */
export async function getPopularBarbers(): Promise<BarberWithShop[]> {
  try {
    const response = await fetch(`${COMERCIO_API_URL}/barbers?sort=popular`, {
      headers: getApiHeaders(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return getBarbers(); // Fallback para lista normal
    }

    const data = await response.json();
    const barbers = data.barbers || [];

    return barbers.slice(0, 10).map((barber: BarberFromAPI) => ({
      id: barber.id,
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      imageUrl: barber.imageUrl,
      barbershopId: barber.isAutonomous ? "autonomo" : barber.id,
      barbershop: {
        id: barber.isAutonomous ? "autonomo" : barber.id,
        name: barber.workplaceName || "Autônomo",
        address: barber.isAutonomous ? "Barbeiro Autônomo" : (barber.workplaceName || ""),
        imageUrl: barber.imageUrl,
      }
    }));
  } catch (error) {
    console.error("[Barbers] Erro ao buscar populares:", error);
    return [];
  }
}

/**
 * Busca um barbeiro pelo ID
 */
export async function getBarberById(id: string): Promise<BarberWithShop | null> {
  try {
    const response = await fetch(`${COMERCIO_API_URL}/barbers/${id}`, {
      headers: getApiHeaders(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("[Barbers] Barbeiro não encontrado:", id);
      return null;
    }

// ... inside getBarberById
    const data = await response.json();
    
    // Suporte para api que retorna { barber: ... } ou o objeto direto
    const barber = data.barber || data;

    if (!barber || !barber.name) {
        console.error("[Barbers] Dados do barbeiro inválidos:", barber);
        return null;
    }

    // Fetch local overrides (Instagram)
    let instagram = null;
    try {
        // @ts-ignore: Prisma types might be stale
        const local = await db.barber.findUnique({ 
            where: { id: barber.id },
            // @ts-ignore
            select: { instagram: true }
        });
        // @ts-ignore
        instagram = local?.instagram;
    } catch (e) {
        console.error("Failed to fetch local barber attributes", e);
    }

    return {
      id: barber.id,
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      instagram: instagram || null,
      imageUrl: barber.image || barber.imageUrl,
      barbershopId: barber.isAutonomous ? "autonomo" : (barber.barbershopId || barber.id),
      barbershop: {
        id: barber.isAutonomous ? "autonomo" : (barber.barbershopId || barber.id),
        name: barber.workplaceName || "Autônomo",
        address: barber.isAutonomous ? "Barbeiro Autônomo" : (barber.workplaceName || ""),
        imageUrl: barber.image || barber.imageUrl,
      },
      _count: {
        Booking: barber.bookingsCount || 0,
      },
    };
  } catch (error) {
    console.error("[Barbers] Erro ao buscar barbeiro:", error);
    return null;
  }
}

/**
 * Busca ranking de barbeiros (ordenados por bookings)
 */
export async function getBarberRanking(): Promise<BarberWithRanking[]> {
  try {
    const response = await fetch(`${COMERCIO_API_URL}/barbers?sort=popular`, {
      headers: getApiHeaders(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("[Barbers] Erro ao buscar ranking:", response.status);
      return [];
    }

    const data = await response.json();
    const barbers = data.barbers || [];

    return barbers.slice(0, 10).map((barber: BarberFromAPI) => ({
      id: barber.id,
      name: barber.name,
      imageUrl: barber.imageUrl,
      bookingsCount: barber.bookingsCount || 0,
      barbershop: {
        id: barber.isAutonomous ? "autonomo" : barber.id,
        name: barber.workplaceName || "Autônomo",
      }
    }));
  } catch (error) {
    console.error("[Barbers] Erro ao buscar ranking:", error);
    return [];
  }
}
