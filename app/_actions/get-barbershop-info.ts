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
    
    // 3. Dynamic Local DB Fallback: Check if we have a Pix Key stored locally (Prisma)
    // This allows custom keys per shop without relying on the external API
    let pixKey = shop.pixKey;

    if (!pixKey) {
        try {
            const { prisma } = await import("@/lib/prisma"); 
            // Normalize name search to be safe
            const localShop = await prisma.barbershop.findFirst({
                where: { 
                    name: { 
                        equals: shop.name,
                        mode: "insensitive" 
                    } 
                },
                select: { pixKey: true }
            });
            
            if (localShop?.pixKey) {
                console.log(`[Pix] Found local key for ${shop.name}: ${localShop.pixKey}`);
                pixKey = localShop.pixKey;
            }
        } catch (dbError) {
             console.error("Error fetching local pix key:", dbError);
        }
    }
    
    // 4. Final Fallback: Demo Key
    pixKey = pixKey || "00.000.000/0001-00"; 

    return { 
        pixKey: pixKey,
        name: shop.name 
    };
  } catch (error) {
    console.error("Erro ao buscar informações da barbearia:", error);
    return { error: "Erro ao buscar informações da barbearia." };
  }
}
