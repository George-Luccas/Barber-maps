"use server";

import { comercioApi } from "@/services/comercio-api";

export async function getBarbershopInfo(barbershopId: string, barbershopName?: string) {
  try {
    let shop = await comercioApi.getShop(barbershopId);
    
    // Fallback: If ID not found but we have a name, try to find by name (Data Sync Issue Handler)
    if (!shop && barbershopName) {
        console.log(`Basic fetch failed for ID ${barbershopId}. Searching by name: ${barbershopName}`);
        const shops = await comercioApi.getShops({ search: barbershopName });
        shop = shops.find(s => s.name === barbershopName) || shops[0];
    }

    if (!shop) {
      return { error: "Barbearia não encontrada." };
    }
    
    // SPECIAL CASE: "Car barber" (Fix for missing API field)
    if (shop.name === "Car barber" || shop.name === "Car Barber") {
        return {
            pixKey: "a4358c54-4785-4578-8647-136806848be2", // Key provided by user
            name: shop.name
        };
    }
    
    // DEMO FALLBACK: If shop exists but has no Pix Key, return a demo key so the user can test the UI
    const pixKey = shop.pixKey || "00.000.000/0001-00"; 

    return { 
        pixKey: pixKey,
        name: shop.name 
    };
  } catch (error) {
    console.error("Erro ao buscar informações da barbearia:", error);
    return { error: "Erro ao buscar informações da barbearia." };
  }
}
