"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getLocations } from "@/app/_actions/get-locations";
import { MapPin } from "lucide-react";

interface Location {
    city: string | null;
    state: string | null;
}

export const LocationFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // States for selections
    const [selectedState, setSelectedState] = useState<string>(searchParams.get("state") || "all");
    const [selectedCity, setSelectedCity] = useState<string>(searchParams.get("city") || "");
    
    // Available data
    const [locations, setLocations] = useState<Location[]>([]);
    const [availableStates, setAvailableStates] = useState<string[]>([]);
    // const [availableCities, setAvailableCities] = useState<string[]>([]); // We don't need this list anymore for the input

    useEffect(() => {
        const fetchLocations = async () => {
            const data = await getLocations();
            // data is now { states: LocationOption[], cities: Record<string, LocationOption[]> }
            const states = data.states.map(s => s.value);
            setAvailableStates(states);
        };
        fetchLocations();
    }, []);

    const handleApplyFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (selectedState && selectedState !== "all") {
            params.set("state", selectedState);
        } else {
            params.delete("state");
        }

        if (selectedCity && selectedCity !== "all" && selectedCity !== "") {
            params.set("city", selectedCity);
        } else {
            params.delete("city");
        }

        if (window.location.pathname !== "/barbershops") {
             router.push(`/barbershops?${params.toString()}`);
        } else {
             router.push(`?${params.toString()}`);
        }
    };

    const handleClearFilter = () => {
        setSelectedState("all");
        setSelectedCity("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("state");
        params.delete("city");
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="flex flex-col gap-4 w-full bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
            <div className="flex items-center gap-2 text-primary font-medium">
                <MapPin className="size-4" />
                <span>Filtrar por Localização:</span>
            </div>
            
            <div className="space-y-3">
                {/* State Selection */}
                <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Selecione o Estado:</label>
                    <div className="flex flex-wrap gap-2">
                        {availableStates.map(state => (
                            <Button 
                                key={state} 
                                variant={selectedState === state ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    if (selectedState === state) {
                                        setSelectedState("all");
                                        setSelectedCity("");
                                    } else {
                                        setSelectedState(state);
                                    }
                                }}
                                className={selectedState === state ? "bg-neon-purple hover:bg-neon-purple/80" : ""}
                            >
                                {state}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* City Input - Only visible if state is selected */}
                {selectedState !== "all" && (
                     <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm text-muted-foreground mb-2 block">Digite a Cidade:</label>
                        <div className="flex gap-2">
                             <input 
                                 type="text"
                                 placeholder="Ex: São Paulo"
                                 value={selectedCity === "all" ? "" : selectedCity}
                                 onChange={(e) => setSelectedCity(e.target.value)}
                                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                             />
                             <Button onClick={handleApplyFilter}>
                                 Buscar
                             </Button>
                        </div>
                     </div>
                )}
            </div>

            {/* Active Filters Summary / Clear Button */}
            {(selectedState !== "all" || (selectedCity && selectedCity !== "all")) && (
                <div className="flex justify-end mt-2">
                     <Button variant="ghost" size="sm" onClick={handleClearFilter} className="text-xs text-muted-foreground hover:text-destructive">
                         Limpar Filtros
                     </Button>
                </div>
            )}
        </div>
    );
};
