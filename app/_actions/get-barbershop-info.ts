"use server";

import { comercioApi } from "@/services/comercio-api";

export async function getBarbershopInfo(barbershopId: string) {
  try {
    const shop = await comercioApi.getShop(barbershopId);
    if (!shop) {
      return { error: "Barbearia não encontrada." };
    }
    return { 
        pixKey: shop.pixKey,
        name: shop.name 
    };
  } catch (error) {
    console.error("Erro ao buscar informações da barbearia:", error);
    return { error: "Erro ao buscar informações da barbearia." };
  }
}
