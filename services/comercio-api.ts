// Helper to determine the base URL dynamically
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_COMERCIO_API_URL) {
    return process.env.NEXT_PUBLIC_COMERCIO_API_URL;
  }
  // Vercel automatically sets VERCEL_URL (without https://)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/external/v1`;
  }
  return "http://localhost:3000/api/external/v1";
};

const RAW_API_URL = getBaseUrl();
const API_URL = RAW_API_URL?.endsWith("/") ? RAW_API_URL.slice(0, -1) : RAW_API_URL;
const API_KEY = process.env.COMERCIO_API_KEY;

// Runtime check to prevent crashes and infinite loading due to missing environment variables
const isConfigured = !!(
  API_URL && 
  API_KEY && 
  API_URL.startsWith("http") && 
  !API_URL.includes("undefined")
);

if (!isConfigured) {
  console.error("❌ CRITICAL: Comercio API internal configuration is missing or invalid. Check NEXT_PUBLIC_COMERCIO_API_URL (must start with https://) and COMERCIO_API_KEY.");
} else {
  console.log(`✅ Comercio API configured with URL: ${API_URL}`);
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
  isSubscription?: boolean;
}

// --- Funções da API ---
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};

export const comercioApi = {
  getShop: async (id: string): Promise<Barbershop | null> => {
    if (!isConfigured) return null;
    try {
      const url = `${API_URL}/shops/${id}`;
      const res = await fetch(url, { headers, next: { revalidate: 60 } });
      if (!res.ok) {
        console.error(`❌ API error at ${url}: ${res.status} ${res.statusText}`);
        return null;
      }
      return await res.json();
    } catch (error) {
      console.error("API Exception (getShop):", error);
      return null;
    }
  },

  getShopServices: async (id: string): Promise<{ services: Service[], barbers: Barber[] }> => {
    if (!isConfigured) return { services: [], barbers: [] };
    const url = `${API_URL}/shops/${id}/services`;
    console.log(`[API] Fetching services from: ${url}`);
    try {
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (!res.ok) {
        console.error(`❌ API error at ${url}: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.error(`Response body: ${text}`);
        return { services: [], barbers: [] };
      }
      const data = await res.json();
      console.log(`[API] Services fetched: ${data.services?.length ?? 0}, Barbers: ${data.barbers?.length ?? 0}`);
      return data;
    } catch (error) {
      console.error("API Exception (getShopServices):", error);
      return { services: [], barbers: [] };
    }
  },

  getAvailability: async (shopId: string, date: string): Promise<string[]> => {
    if (!isConfigured) return [];
    try {
      const url = `${API_URL}/shops/${shopId}/availability?date=${date}`;
      console.log(`[API] Fetching availability from: ${url}`);
      const res = await fetch(url, { headers, cache: 'no-store' });
      if (!res.ok) {
         const text = await res.text();
         console.error(`❌ API error at ${url}: ${res.status} ${res.statusText} - Body: ${text}`);
         throw new Error(`Erro ao buscar disponibilidade: ${res.statusText}`);
      }
      const data: AvailabilityResponse = await res.json();
      console.log(`[API] Availability fetched for ${date}: ${data.availableSlots?.length ?? 0} slots`);
      return data.availableSlots || [];
    } catch (error) {
      console.error("API Error (getAvailability):", error);
      return [];
    }
  },

  getShops: async (params?: { search?: string; city?: string }): Promise<Barbershop[]> => {
    if (!isConfigured) return [];
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
    if (!isConfigured) throw new Error("API não configurada corretamente.");
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.error || "Erro ao criar agendamento"} (URL: ${API_URL}/bookings)`);
    }
    return data;
  }
};

