"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// Fix for default marker icons is no longer strictly needed if we don't use L.Marker, 
// but good to keep in case we use it elsewhere.
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface BarbershopData {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  source?: "internal" | "google";
}

interface RadarMapProps {
  userLocation: { lat: number; lng: number };
  barbershops: BarbershopData[];
}

// Component to handle map centering
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const RadarMap = ({ userLocation, barbershops }: RadarMapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border bg-background relative z-0">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        scrollWheelZoom={false}
        preferCanvas={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

        {/* User Location - Pulse Effect */}
        <CircleMarker 
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.8, weight: 2 }}
        >
          <Popup>
            <div className="text-center font-bold text-sm">Você está aqui</div>
          </Popup>
        </CircleMarker>

        {/* Barbershop Markers - Rendered on Canvas */}
        {barbershops.map((shop) => (
          <CircleMarker
            key={shop.id}
            center={[shop.latitude, shop.longitude]}
            radius={8}
            pathOptions={{ 
                color: shop.source === "google" ? '#a855f7' : '#ef4444', // Purple for Google, Red for Internal
                fillColor: shop.source === "google" ? '#a855f7' : '#ef4444',
                fillOpacity: 0.6,
                weight: 1
            }}
          >
            <Popup>
              <div className="flex flex-col gap-2 min-w-[200px]">
                 {shop.imageUrl && (
                    <div className="relative h-[100px] w-full rounded-md overflow-hidden">
                        <Image src={shop.imageUrl} alt={shop.name} fill className="object-cover"/>
                    </div>
                 )}
                 <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm truncate">{shop.name}</h3>
                     <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        shop.source === "google" 
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" 
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}>
                        {shop.source === "google" ? "Google" : "App"}
                    </span>
                 </div>
                 <p className="text-sm text-gray-500 truncate">{shop.address}</p>
                 
                 {shop.source !== "google" ? (
                    <Link href={`/barbershops/${shop.id}`} className="bg-primary text-primary-foreground text-sm p-2 rounded-md font-bold text-center mt-1 flex items-center justify-center gap-1 hover:opacity-90 transition-opacity">
                        Ver Detalhes <ArrowRight size={12}/>
                    </Link>
                 ) : (
                    <div className="text-xs text-muted-foreground italic text-center mt-1">
                        Disponível apenas no Google
                    </div>
                 )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-[400] bg-card/90 backdrop-blur-sm border p-2.5 rounded-lg shadow-lg flex flex-col gap-2 pointer-events-none select-none">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Você</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Salão</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Google</span>
         </div>
      </div>
    </div>
  );
};

export default RadarMap;
