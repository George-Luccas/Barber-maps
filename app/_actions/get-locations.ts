"use server";

import { getAvailableLocations } from "@/data/barbershops";

export const getLocations = async () => {
    return await getAvailableLocations();
};
