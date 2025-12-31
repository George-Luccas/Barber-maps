"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, Loader2, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import ServiceItem from "./service-item"; // Reuse or create simpler card?
import BarbershopItem from "./barbershop-item";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";
import { SonarLoading } from "./sonar-loading";

const RadarMap = dynamic(() => import("./radar-map"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full rounded-xl bg-muted animate-pulse flex items-center justify-center text-muted-foreground text-sm">Carregando mapa...</div>
});

interface Barbershop {
  id: string;
  name: string;
  address: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface BarberRadarProps {
  barbershops: any[];
}

const BarberRadar = ({ barbershops }: BarberRadarProps) => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [radius, setRadius] = useState(1); // Default 1km

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador.");
      setLoading(false);
      return;
    }

    const startTime = Date.now();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 4000 - elapsed); // Increased to 4s
        
        setTimeout(() => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        }, remainingDelay);
      },
      (error) => {
        console.error(error);
        if (error.code === error.PERMISSION_DENIED) {
            setPermissionDenied(true);
        }
        toast.error("Erro ao obter localização. Verifique as permissões.");
        setLoading(false);
      }
    );
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const nearbyBarbershops = useMemo(() => {
    if (!userLocation) return [];
    
    return barbershops.filter((barbershop) => {
      if (!barbershop.latitude || !barbershop.longitude) return false;
      
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        Number(barbershop.latitude),
        Number(barbershop.longitude)
      );
      return distance <= radius;
    });
  }, [userLocation, barbershops, radius]);

  if (loading) {
    return <SonarLoading />;
  }

  if (permissionDenied) {
      return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center px-4">
            <MapPin className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-bold">Localização necessária</h2>
            <p className="text-muted-foreground">
                Para usar o Barber Radar, precisamos saber onde você está.
                Por favor, permita o acesso à localização no seu navegador.
            </p>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.back()}>Voltar</Button>
                <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </div>
        </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 px-5 mt-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </Button>
                <div className="flex items-center gap-2">
                    <MapPin className="text-primary size-5" />
                    <h2 className="text-lg font-bold">Barber Radar</h2>
                </div>
            </div>
            <p className="text-xs font-bold text-neon-purple bg-neon-purple/10 px-2 py-1 rounded-md">{radius}km</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 5, 10, 15, 20].map((r) => (
                <Button 
                    key={r} 
                    variant={radius === r ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setRadius(r)}
                >
                    {r}km
                </Button>
            ))}
        </div>
      </div>

      {userLocation && (
        <div className="px-5">
            <RadarMap userLocation={userLocation} barbershops={nearbyBarbershops as any} />
            <p className="mt-2 text-xs text-muted-foreground">
            Sua localização: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 px-5">
        {nearbyBarbershops.length > 0 ? (
          nearbyBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop as any} />
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-10 text-center">
             <p className="text-muted-foreground">Nenhuma barbearia encontrada num raio de {radius}km.</p>
             <p className="text-xs text-muted-foreground">Tente aumentar o raio de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberRadar;
