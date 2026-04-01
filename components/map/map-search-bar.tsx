"use client";

import { Search, MapPin } from "lucide-react";

export function MapSearchBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pt-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
      <div className="relative max-w-md mx-auto pointer-events-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neon-purple" />
        </div>
        <input
          type="text"
          placeholder="Procurar barbearia em Cuiabá..."
          className="w-full h-14 pl-12 pr-4 bg-black/80 backdrop-blur-md border border-neon-purple/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple/80 shadow-[0_0_15px_rgba(180,0,255,0.2)] transition-all"
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          <button className="bg-neon-purple/20 p-2 rounded-full text-neon-purple hover:bg-neon-purple/40 transition-colors">
            <MapPin className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

