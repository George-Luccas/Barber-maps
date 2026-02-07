/**
 * Busca barbeiros exclusivamente da API do Comercio
 */

const COMERCIO_API_URL = process.env.COMERCIO_API_URL || "http://localhost:3001";

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
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/barbers`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("[Barbers] Erro ao buscar da API:", response.status);
      return [];
    }

    const data = await response.json();
    const barbers = data.barbers || [];

    return barbers.map((barber: BarberFromAPI) => ({
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
    console.error("[Barbers] Erro ao buscar barbeiros:", error);
    return [];
  }
}

/**
 * Busca barbeiros populares (ordenados por bookings)
 */
export async function getPopularBarbers(): Promise<BarberWithShop[]> {
  try {
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/barbers?sort=popular`, {
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
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/barbers/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("[Barbers] Barbeiro não encontrado:", id);
      return null;
    }

    const barber: BarberFromAPI = await response.json();

    return {
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
    const response = await fetch(`${COMERCIO_API_URL}/api/external/v1/barbers?sort=popular`, {
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
