"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.COMERCIO_API_URL || "http://localhost:3001";

export interface BarberProfileData {
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
 * Atualiza o perfil do barbeiro-divulgação
 */
export async function updateBarberProfileAction(data: BarberProfileData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Não autenticado" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/barber-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
        "x-user-email": session.user.email || "",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Erro ao atualizar perfil" };
    }

    revalidatePath("/barbers");
    revalidatePath("/profile");
    
    return { success: true };
  } catch (error) {
    console.error("[updateBarberProfileAction] Erro:", error);
    return { success: false, error: "Erro de conexão com servidor" };
  }
}

/**
 * Atualiza foto de perfil do barbeiro
 */
export async function updateBarberImageAction(imageUrl: string) {
  return updateBarberProfileAction({ image: imageUrl });
}

/**
 * Atualiza bio/sobre do barbeiro
 */
export async function updateBarberBioAction(bio: string) {
  return updateBarberProfileAction({ bio });
}

/**
 * Atualiza especialidades do barbeiro
 */
export async function updateBarberSpecialtiesAction(specialties: string[]) {
  return updateBarberProfileAction({ specialties });
}

/**
 * Atualiza informações de trabalho do barbeiro
 */
export async function updateBarberWorkInfoAction(data: {
  workplaceName?: string;
  isAutonomous?: boolean;
  yearsOfExperience?: number;
}) {
  return updateBarberProfileAction(data);
}

/**
 * Busca perfil do barbeiro logado
 */
export async function getMyBarberProfileAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/barber-profile`, {
      headers: {
        "x-user-id": session.user.id,
        "x-user-email": session.user.email || "",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[getMyBarberProfileAction] Erro:", error);
    return null;
  }
}
