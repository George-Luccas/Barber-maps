"use client";

import dynamic from "next/dynamic";

const DynamicMainMap = dynamic(() => import("./main-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#121212] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-neon-purple animate-spin" />
        <span className="text-neon-purple/70 text-sm font-bold tracking-widest uppercase">Inicializando Radar...</span>
      </div>
    </div>
  ),
});

export function MapWrapper({ barbershops }: { barbershops: any[] }) {
  return <DynamicMainMap barbershops={barbershops} />;
}
