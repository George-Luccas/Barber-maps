const API_URL = process.env.NEXT_PUBLIC_COMERCIO_API_URL;
const API_KEY = process.env.COMERCIO_API_KEY;

if (!API_URL || !API_KEY) {
  console.warn("⚠️ Configurações da API do Comercio (URL ou KEY) estão ausentes no .env");
}

// --- Tipos Atualizados ---
export interface Style {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  priceInCents: number;
  quantity: number;
}

export interface Barbershop {
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
  // Novos campos adicionados
  photos: string[];
  styles: Style[];
  products: Product[];
  aboutUs?: string; // Adding optional aboutUs as it was used in the page
}

export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceInCents: number;
  points: number | null;
}

export interface Barber {
  id: string;
  name: string;
  imageUrl: string;
}

export interface AvailabilityResponse {
  date: string;
  availableSlots: string[];
  message?: string;
}

export interface CreateBookingPayload {
  barbershopId: string;
  serviceId: string;
  barberId: string;
  date: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
}

// --- Funções da API ---
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};

export const comercioApi = {
  getShop: async (id: string): Promise<Barbershop | null> => {
    try {
      // Revalidate em 60s para manter dados frescos
      const res = await fetch(`${API_URL}/shops/${id}`, { headers, next: { revalidate: 60 } });
      if (!res.ok) throw new Error(`Erro ao buscar loja: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error("API Error (getShop):", error);
      return null;
    }
  },

  getShopServices: async (id: string): Promise<{ services: Service[], barbers: Barber[] }> => {
    try {
      const res = await fetch(`${API_URL}/shops/${id}/services`, { headers, cache: 'no-store' });
      if (!res.ok) throw new Error(`Erro ao buscar serviços: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error("API Error (getShopServices):", error);
      return { services: [], barbers: [] };
    }
  },

  getAvailability: async (shopId: string, date: string): Promise<string[]> => {
    try {
      const res = await fetch(`${API_URL}/shops/${shopId}/availability?date=${date}`, { headers, cache: 'no-store' });
      if (!res.ok) throw new Error(`Erro ao buscar disponibilidade: ${res.statusText}`);
      const data: AvailabilityResponse = await res.json();
      return data.availableSlots || [];
    } catch (error) {
      console.error("API Error (getAvailability):", error);
      return [];
    }
  },

  getShops: async (params?: { search?: string; city?: string }): Promise<Barbershop[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.city) queryParams.append("city", params.city);

        const res = await fetch(`${API_URL}/shops?${queryParams.toString()}`, { headers, next: { revalidate: 60 } });
        if (!res.ok) throw new Error(`Erro ao buscar lojas: ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error("API Error (getShops):", error);
        return [];
    }
  },

  createBooking: async (payload: CreateBookingPayload) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erro ao criar agendamento");
    }
    return data;
  }
};
