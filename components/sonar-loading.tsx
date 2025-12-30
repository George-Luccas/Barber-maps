"use client";

import { MapPin } from "lucide-react";

export const SonarLoading = () => {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-8 relative overflow-hidden">
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Radar Circles */}
        <div className="absolute w-full h-full rounded-full border border-neon-purple/20" />
        <div className="absolute w-3/4 h-3/4 rounded-full border border-neon-purple/20" />
        <div className="absolute w-1/2 h-1/2 rounded-full border border-neon-purple/20" />
        <div className="absolute w-1/4 h-1/4 rounded-full border border-neon-purple/20" />

        {/* Ripple Effect */}
        <div className="absolute w-16 h-16 rounded-full border border-neon-purple animate-radar" />
        <div className="absolute w-16 h-16 rounded-full border border-neon-purple animate-radar [animation-delay:1s]" />
        
        {/* Scanning Line */}
        <div className="absolute w-full h-full rounded-full animate-sonar pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-linear-to-r from-neon-purple/60 to-transparent -translate-y-1/2 origin-left shadow-[0_0_10px_var(--neon-purple)]" />
        </div>

        {/* Center Icon */}
        <div className="relative z-10 bg-black p-4 rounded-full border border-neon-purple shadow-neon-purple">
          <MapPin className="text-neon-purple size-8 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-white primary-glow">Iniciando Scanner...</h2>
        <p className="text-sm text-gray-500 animate-pulse">Rastreando barbearias próximas</p>
      </div>

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
