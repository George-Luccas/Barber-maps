"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BarberBottomSheet } from "./barber-bottom-sheet";

// Fix for default Leaflet markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

// Custom Icon with /logo1.png
const neonPurpleIcon = new L.Icon({
  iconUrl: "/store_icon.png", // or /logo1.png if its better as marker
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: "drop-shadow-lg", 
});

interface MainMapProps {
  barbershops: any[];
}

export default function MainMap({ barbershops }: MainMapProps) {
  const [selectedBarbershop, setSelectedBarbershop] = useState<any | null>(null);
  
  // Center on Cuiabá-MT
  const mapCenter: [number, number] = [-15.5961, -56.0967];

  return (
    <>
      <MapContainer
        center={mapCenter}
        zoom={13}
        zoomControl={false}
        className="w-full h-full bg-[#121212] z-0"
      >
        {/* Dark Matter Tiles for CartoDB */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {barbershops?.map((shop) => {
          // Fallback location if shop does not provide valid lat/lng
          const lat = shop.latitude ? Number(shop.latitude) : mapCenter[0] + (Math.random() - 0.5) * 0.05;
          const lng = shop.longitude ? Number(shop.longitude) : mapCenter[1] + (Math.random() - 0.5) * 0.05;
          
          return (
            <Marker 
                key={shop.id} 
                position={[lat, lng]} 
                icon={neonPurpleIcon}
                eventHandlers={{
                    click: () => setSelectedBarbershop(shop),
                }}
            />
          );
        })}
      </MapContainer>

      <BarberBottomSheet 
        isOpen={!!selectedBarbershop} 
        onClose={() => setSelectedBarbershop(null)} 
        barbershop={selectedBarbershop} 
      />
    </>
  );
}
