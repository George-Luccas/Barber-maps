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

const LocationFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // States for selections
    const [selectedState, setSelectedState] = useState<string>(searchParams.get("state") || "all");
    const [selectedCity, setSelectedCity] = useState<string>(searchParams.get("city") || "");
    
    // Available data
    const [locations, setLocations] = useState<Location[]>([]);
    const [availableStates, setAvailableStates] = useState<string[]>([]);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [allCitiesData, setAllCitiesData] = useState<Record<string, {value: string; label: string}[]>>({});

    useEffect(() => {
        const fetchLocations = async () => {
            const data = await getLocations();
            const states = data.states.map(s => s.value);
            setAvailableStates(states);
            setAllCitiesData(data.cities);
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        if (selectedState && selectedState !== "all" && allCitiesData[selectedState]) {
            setAvailableCities(allCitiesData[selectedState].map(c => c.value));
        } else {
            setAvailableCities([]);
        }
    }, [selectedState, allCitiesData]);

    const handleSelectCity = (city: string) => {
        const newCity = selectedCity === city ? "" : city;
        setSelectedCity(newCity);
        
        // Auto apply filter when city is selected
        const params = new URLSearchParams(searchParams.toString());
        
        if (selectedState && selectedState !== "all") {
            params.set("state", selectedState);
        }

        if (newCity && newCity !== "all") {
             params.set("city", newCity);
        } else {
             params.delete("city");
        }

        if (window.location.pathname !== "/barbershops") {
             router.push(`/barbershops?${params.toString()}`);
        } else {
             router.push(`?${params.toString()}`);
        }
    }

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
                                        // Clear params if deselected
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.delete("state");
                                        params.delete("city");
                                        router.push(`?${params.toString()}`);
                                    } else {
                                        setSelectedState(state);
                                        setSelectedCity(""); // Reset city when state changes
                                    }
                                }}
                                className={selectedState === state ? "bg-neon-purple hover:bg-neon-purple/80" : ""}
                            >
                                {state}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* City Selection - Only visible if state is selected */}
                {selectedState !== "all" && availableCities.length > 0 && (
                     <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm text-muted-foreground mb-2 block">Selecione a Cidade:</label>
                        <div className="flex flex-wrap gap-2">
                             {availableCities.map(city => (
                                <Button 
                                    key={city} 
                                    variant={selectedCity === city ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleSelectCity(city)}
                                    className={selectedCity === city ? "bg-primary hover:bg-primary/90" : ""}
                                >
                                    {city}
                                </Button>
                            ))}
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

export default LocationFilter;