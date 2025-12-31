"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";

// Fix Leaflet Default Icon issue in Next.js
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

// Custom Icons
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const internalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const externalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
    <div className="h-[300px] w-full rounded-xl overflow-hidden border">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        scrollWheelZoom={false}
        preferCanvas={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

        {/* User Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center font-bold">Você está aqui</div>
          </Popup>
        </Marker>

        {/* Barbershop Markers */}
        {barbershops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.latitude, shop.longitude]}
            icon={shop.source === "google" ? externalIcon : internalIcon}
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
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        shop.source === "google" 
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}>
                        {shop.source === "google" ? "Google" : "App"}
                    </span>
                 </div>
                 <p className="text-xs text-gray-500 truncate">{shop.address}</p>
                 
                 {shop.source !== "google" ? (
                    <Link href={`/barbershops/${shop.id}`} className="bg-primary text-primary-foreground text-xs p-2 rounded-md font-bold text-center mt-1 flex items-center justify-center gap-1 hover:opacity-90 transition-opacity">
                        Ver Detalhes <ArrowRight size={12}/>
                    </Link>
                 ) : (
                    <div className="text-[10px] text-muted-foreground italic text-center mt-1">
                        Disponível apenas no Google
                    </div>
                 )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RadarMap;
