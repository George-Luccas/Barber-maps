/**
 * Serviço para integração com API de Perfil do Barbeiro-Divulgação
 */

const API_BASE_URL = process.env.COMERCIO_API_URL || "http://localhost:3001";

export interface BarberProfile {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  phone: string | null;
  yearsOfExperience: number;
  workplaceName: string | null;
  isAutonomous: boolean;
  specialties: string[];
  accountType: "DIVULGACAO";
}

export interface BarberProfileUpdateData {
  image?: string;
  bio?: string;
  yearsOfExperience?: number;
  workplaceName?: string;
  isAutonomous?: boolean;
  specialties?: string[];
  name?: string;
  phone?: string;
}

/**
 * Busca lista de barbeiros de divulgação
 */
export async function getBarberProfiles(): Promise<BarberProfile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/external/v1/barbers`, {
      next: { revalidate: 60 }, // Cache por 1 minuto
    });

    if (!response.ok) {
      console.error("[BarberService] Erro ao buscar barbeiros:", response.status);
      return [];
    }

    const data = await response.json();
    return data.barbers || [];
  } catch (error) {
    console.error("[BarberService] Erro ao buscar barbeiros:", error);
    return [];
  }
}

/**
 * Busca detalhes de um barbeiro de divulgação
 */
export async function getBarberProfileById(id: string): Promise<BarberProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/external/v1/barbers/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("[BarberService] Barbeiro não encontrado:", id);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[BarberService] Erro ao buscar barbeiro:", error);
    return null;
  }
}

/**
 * Atualiza perfil do barbeiro (requer autenticação)
 */
export async function updateBarberProfile(
  data: BarberProfileUpdateData,
  authToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/barber-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Erro ao atualizar perfil" };
    }

    return { success: true };
  } catch (error) {
    console.error("[BarberService] Erro ao atualizar perfil:", error);
    return { success: false, error: "Erro de conexão" };
  }
}
