"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Star } from "lucide-react";
import { BarberWithShop } from "@/data/barbers";

interface BarberCardProps {
  barber: BarberWithShop & { rating?: number; reviewCount?: number };
}

const BarberCard = ({ barber }: BarberCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <div 
      className="group relative w-[280px] h-[450px] cursor-pointer [perspective:1000px]"
      onClick={handleFlip}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setIsAnimating(false)}
        className="relative w-full h-full [transform-style:preserve-3d]"
      >
        {/* ================= FRONT FACE ================= */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-transparent to-neon-purple/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl" />

          {/* Card Container */}
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/20 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] group-hover:border-neon-purple/60 transition-all duration-300">
            
            {/* Neon Lines Decoration */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple/70 to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple/70 to-transparent opacity-60" />
            
            {/* Full Height Image */}
            <div className="relative w-full h-full"> 
              <Image
                src={barber.imageUrl || "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"}
                alt={barber.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              {/* Gradient Overlay for Text Readability - Stronger at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
            </div>

            {/* Top Badge (Specialty) */}
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1 rounded-full bg-black/60 border border-neon-purple/30 backdrop-blur-md text-xs font-bold text-neon-purple uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3" />
                <span>{barber.specialties?.[0] || "Estilo"}</span>
              </div>
            </div>
            
            {/* Info Content (Bottom Aligned) */}
            <div className="absolute bottom-0 left-0 w-full p-5 z-10 flex flex-col gap-4">
              
              {/* Name & Title */}
              <div className="border-l-4 border-neon-purple pl-3 transition-all duration-300 group-hover:pl-4 group-hover:border-l-8">
                <h3 className="text-2xl font-black uppercase tracking-wide text-white drop-shadow-md group-hover:text-neon-purple transition-colors duration-300">
                  {barber.name}
                </h3>
                <p className="text-white text-sm font-bold flex items-center gap-1 mt-1 drop-shadow-md">
                  <span className="text-neon-purple shadow-neon-purple/50 drop-shadow-sm">•</span>
                  {barber.barbershop.name}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                {/* Experience */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-md flex flex-col items-center justify-center gap-0.5 group-hover:bg-neon-purple/10 group-hover:border-neon-purple/30 transition-colors">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Trophy className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">XP</span>
                  </div>
                  <span className="text-xl font-bold text-white leading-none">
                    {barber.yearsOfExperience || "1+"} <span className="text-xs font-normal text-gray-400">anos</span>
                  </span>
                </div>

                {/* Avaliações */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-md flex flex-col items-center justify-center gap-0.5 group-hover:bg-neon-purple/10 group-hover:border-neon-purple/30 transition-colors">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Avaliações</span>
                  </div>
                  <span className="text-xl font-bold text-white leading-none">
                    {barber.rating ? barber.rating.toFixed(1) : "5.0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div 
          className="absolute inset-0 [backface-visibility:hidden] bg-black rounded-xl border border-neon-purple/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
           {/* Background Image Blurred/Darkened */}
           <div className="absolute inset-0">
              <Image
                src={barber.imageUrl || "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"}
                alt="Background"
                fill
                className="object-cover opacity-20 blur-sm"
              />
              <div className="absolute inset-0 bg-black/60" />
           </div>

           {/* Content */}
           <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center gap-6">
              
              <div className="relative w-24 h-24 rounded-full border-2 border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.5)] overflow-hidden mb-2">
                 <Image
                    src={barber.imageUrl || "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"}
                    alt={barber.name}
                    fill
                    className="object-cover"
                  />
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase text-white mb-1">
                  {barber.name}
                </h3>
                  <p className="text-neon-purple font-bold text-sm">
                  {barber.barbershop.name}
                </p>
              </div>

              <div className="w-full h-[1px] bg-white/10" />

              <div className="flex flex-col gap-3 w-full">
                 <Link href={`/barbers/${barber.id}`} className="w-full">
                    <button className="w-full py-3 px-4 bg-neon-purple hover:bg-neon-purple/80 text-white font-bold uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                       Ver Detalhes
                    </button>
                 </Link>
                 
                 <button 
                    onClick={(e) => {
                       e.stopPropagation();
                       handleFlip();
                    }}
                    className="text-gray-400 text-xs hover:text-white transition-colors uppercase tracking-widest mt-2 hover:underline"
                 >
                    Voltar
                 </button>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BarberCard;
