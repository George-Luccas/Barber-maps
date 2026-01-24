"use server"

import { prisma } from "@/lib/prisma"

export interface LocationOption {
  value: string
  label: string
}

export interface AvailableLocations {
  states: LocationOption[]
  cities: Record<string, LocationOption[]> // Key is state code
}

export async function getLocations(): Promise<AvailableLocations> {
  const barbershops = await prisma.barbershop.findMany({
    select: {
      city: true,
      state: true,
    },
    where: {
      city: { not: null },
      state: { not: null },
    },
    distinct: ["city", "state"],
  })

  const statesMap = new Map<string, string>()
  const citiesMap = new Map<string, Set<string>>()

  barbershops.forEach((shop: { city: string | null; state: string | null }) => {
    if (!shop.city || !shop.state) return

    const city = shop.city.trim()
    const state = shop.state.trim()

    // Add state
    statesMap.set(state, state)

    // Add city to state
    if (!citiesMap.has(state)) {
      citiesMap.set(state, new Set())
    }
    citiesMap.get(state)?.add(city)
  })

  // Format states
  const states: LocationOption[] = Array.from(statesMap.keys())
    .sort()
    .map((state) => ({
      value: state,
      label: state,
    }))

  // Format cities
  const cities: Record<string, LocationOption[]> = {}
  
  citiesMap.forEach((citySet, state) => {
    cities[state] = Array.from(citySet)
      .sort()
      .map((city) => ({
        value: city,
        label: city,
      }))
  })

  return {
    states,
    cities,
  }
}
