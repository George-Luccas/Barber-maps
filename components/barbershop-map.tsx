"use client";

import { PageSectionTitle } from "./ui/page";

interface BarbershopMapProps {
  barbershop: {
    name: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
  };
}

const BarbershopMap = ({ barbershop }: BarbershopMapProps) => {
  const query = barbershop.latitude && barbershop.longitude
    ? `${barbershop.latitude},${barbershop.longitude}`
    : `${barbershop.name}, ${barbershop.address}`;
    
  const encodedQuery = encodeURIComponent(query);
  
  // Using the "legacy" embed iframe structure which is often more permissive without an API key for simple searches.
  const mapSrc = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="flex flex-col gap-3 px-5">
      <PageSectionTitle>Localização</PageSectionTitle>
      <div className="relative h-[180px] w-full overflow-hidden rounded-xl bg-muted">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          title={`Mapa de localização da barbearia ${barbershop.name}`}
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-neutral-400">
          <p>{barbershop.address}</p>
      </div>
    </div>
  );
};

export default BarbershopMap;
