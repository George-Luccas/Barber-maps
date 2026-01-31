// Data Access Layer
import { comercioApi } from "@/services/comercio-api";

interface GetBarbershopsProps {
  city?: string;
  state?: string;
  search?: string;
}

export const getBarbershops = async (props?: GetBarbershopsProps) => {
    // API supports search and city. State logic might be simulated via search or ignored if API doesn't support state.
    const shops = await comercioApi.getShops({
        search: props?.search,
        city: props?.city
    });
    
    // Map to expected format (adding defaults for missing fields)
    return shops.map(shop => ({
        ...shop,
        dailyGoal: 0 // Default as API doesn't return this yet
    }));
};

export const getAvailableLocations = async () => {
    // Fetch all shops and extract unique cities
    // Note: This is less efficient than SQL DISTINCT but necessary without a dedicated API endpoint
    const shops = await comercioApi.getShops();
    const uniqueLocations = new Set<string>();
    const locations: { city: string; state: string }[] = [];

    shops.forEach(shop => {
        if (shop.city) {
            const key = `${shop.city}`;
            if (!uniqueLocations.has(key)) {
                uniqueLocations.add(key);
                locations.push({ city: shop.city, state: "SP" }); // Defaulting state if not in API, or need to request backend to add it
            }
        }
    });

    return locations;
};

export const getPopularBarbershops = async () => {
    const shops = await comercioApi.getShops();
    // API doesn't have ranking yet, so return first 10
    return shops.slice(0, 10).map(shop => ({
        ...shop,
        dailyGoal: 0
    }));
};

export const getBarbershopById = async (id: string) => {
    const shop = await comercioApi.getShop(id);
    if (!shop) return null;
    
    // Helper to get services (needed for compatibility with old callers expecting full tree)
    // Note: Old callers might expect services nested, but getShop API returns simple shop. 
    // Usually callers use getShopServices separately now, but for safety:
    const { services, barbers } = await comercioApi.getShopServices(id);

    return {
        ...shop,
        services, 
        Barber: barbers,
        Style: shop.styles || [],
        BarbershopProduct: shop.products || [],
        dailyGoal: 0
    };
};

export const getBarbershopsByServiceName = async (serviceName: string) => {
   // API currently searches generally. We'll use general search.
   const shops = await comercioApi.getShops({ search: serviceName });
   return shops.map(shop => ({
        ...shop,
        dailyGoal: 0
    }));
};

export const getBarbershopsWithStories = async () => {
    // API doesn't support stories yet. Return empty or basic list.
    const shops = await comercioApi.getShops();
    return shops.slice(0, 10).map(shop => ({
        ...shop,
        Style: shop.styles || [], // Use styles as stories substitute
        dailyGoal: 0
    }));
};

export const getBarbershopRanking = async (city?: string) => {
   // Ranking not supported in API. Return list.
   const shops = await comercioApi.getShops({ city });
   return shops.map(shop => ({
       ...shop,
       dailyGoal: 0,
       bookingsCount: 0 // API doesn't expose booking counts
   }));
};

