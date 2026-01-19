"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getLocations, type AvailableLocations } from "../_actions/get-locations"

export function LocationFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [locations, setLocations] = useState<AvailableLocations>({ states: [], cities: {} })
  const [selectedState, setSelectedState] = useState<string>(searchParams.get("state") || "")
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get("city") || "")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations()
        setLocations(data)
      } catch (error) {
        console.error("Failed to fetch locations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedCity("all") // Reset city when state changes
  }

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (selectedState && selectedState !== "all") {
      params.set("state", selectedState)
    } else {
      params.delete("state")
    }

    if (selectedCity && selectedCity !== "all") {
      params.set("city", selectedCity)
    } else {
      params.delete("city")
    }

    router.push(`/barbershops?${params.toString()}`)
  }

  const handleClearFilter = () => {
    setSelectedState("")
    setSelectedCity("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("state")
    params.delete("city")
    router.push(`/barbershops?${params.toString()}`)
  }

  const availableCities = selectedState && locations.cities[selectedState] 
    ? locations.cities[selectedState] 
    : []

  if (loading) return <div>Carregando filtros...</div>

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end bg-card p-4 rounded-lg border shadow-sm mb-6">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <Select value={selectedState} onValueChange={handleStateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {locations.states.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Cidade</label>
        <Select 
          value={selectedCity} 
          onValueChange={setSelectedCity}
          disabled={!selectedState || selectedState === "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a cidade" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">Todas as cidades</SelectItem>
            {availableCities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClearFilter}>
          Limpar
        </Button>
        <Button onClick={handleApplyFilter}>
          Filtrar
        </Button>
      </div>
    </div>
  )
}
