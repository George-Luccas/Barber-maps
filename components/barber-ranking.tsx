"use client";

import { motion } from "framer-motion";
import { Scissors, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BarberWithStats {
  id: string;
  name: string;
  imageUrl: string | null;
  bookingsCount: number;
  barbershop: {
    id: string;
    name: string;
  };
}

interface BarberRankingProps {
  barbers: BarberWithStats[];
}

const BarberRanking = ({ barbers }: BarberRankingProps) => {
  if (barbers.length === 0) return null;

  const getMedalStyle = (index: number) => {
    switch (index) {
      case 0: return { 
        bg: "bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500", 
        border: "border-yellow-400",
        shadow: "shadow-[0_0_15px_rgba(250,204,21,0.6)]",
        text: "text-yellow-900"
      };
      case 1: return { 
        bg: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400", 
        border: "border-gray-300",
        shadow: "shadow-[0_0_10px_rgba(156,163,175,0.5)]",
        text: "text-gray-700"
      };
      case 2: return { 
        bg: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700", 
        border: "border-amber-500",
        shadow: "shadow-[0_0_10px_rgba(217,119,6,0.5)]",
        text: "text-amber-900"
      };
      default: return { 
        bg: "bg-gradient-to-br from-purple-700 to-purple-900", 
        border: "border-purple-500",
        shadow: "",
        text: "text-purple-200"
      };
    }
  };

  return (
    <div className="relative mx-4 my-6 p-1 rounded-2xl bg-gradient-to-b from-purple-600 via-purple-800 to-purple-600">
      {/* Inner container */}
      <div className="relative rounded-xl bg-black/95 p-4 overflow-hidden">
        
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple-600/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple-600/30 blur-3xl" />
        
        {/* Header */}
        <div className="relative text-center mb-6 pt-2">
          <div className="flex items-center justify-center gap-4">
            {/* Navalha de barbeiro clássica com animação */}
            <motion.div
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg 
                className="w-12 h-12 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
              >
                {/* Lâmina - fina e curva */}
                <path d="M4 10 Q10 8 20 4 L21 5 Q11 9 5 11 Z" fill="currentColor" />
                {/* Cabo - fino e longo */}
                <path d="M4 10 L4 21 Q4 22 5 22 L6 22 Q7 22 7 21 L7 11" fill="currentColor" opacity="0.7" />
                {/* Pino central no cabo */}
                <circle cx="5.5" cy="14" r="1" stroke="currentColor" fill="none" strokeWidth="0.8" />
              </svg>
            </motion.div>
            
            <div>
              <h2 className="text-3xl font-black uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-purple-200 via-white to-purple-300"
                style={{ textShadow: '0 0 40px rgba(168, 85, 247, 0.8)' }}>
                Ranking
              </h2>
              <p className="text-xl font-bold uppercase tracking-widest text-purple-400 -mt-1">
                dos Barbeiros
              </p>
            </div>
            
            {/* Tesoura com animação */}
            <motion.div
              animate={{ rotate: [10, -10, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Scissors className="w-10 h-10 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </motion.div>
          </div>
        </div>

        {/* Ranking List */}
        <div className="relative space-y-2">
          {barbers.slice(0, 5).map((barber, index) => {
            const medal = getMedalStyle(index);
            return (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/barbers/${barber.id}`}
                className="group relative flex items-center gap-3 p-2.5 rounded-lg border border-purple-500/60 bg-gradient-to-r from-purple-950/80 via-black/50 to-purple-950/80 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              >
                {/* Round Medal with Crown */}
                <div className={`w-12 h-12 rounded-full ${medal.bg} ${medal.shadow} flex items-center justify-center flex-shrink-0 border-2 ${medal.border}`}>
                  <Crown className={`w-6 h-6 ${medal.text}`} />
                </div>

                {/* Position Number */}
                <span className={`w-8 font-black text-xl ${index === 0 ? 'text-yellow-400' : index < 3 ? 'text-gray-300' : 'text-purple-400'}`}>
                  {index + 1}º
                </span>

                {/* Photo */}
                <div className={`relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 ${index === 0 ? 'border-yellow-400' : 'border-purple-500/70'}`}>
                  <Image
                    src={barber.imageUrl || "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"}
                    alt={barber.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name with marquee animation */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <motion.span 
                    className={`block font-bold uppercase tracking-wide whitespace-nowrap ${index === 0 ? 'text-yellow-400' : 'text-white'}`}
                    animate={{
                      x: ["100%", "0%", "0%", "-100%"],
                    }}
                    transition={{
                      duration: 6,
                      times: [0, 0.2, 0.8, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                  >
                    {barber.name}
                  </motion.span>
                </div>

                {/* Points */}
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span className={`font-black text-xl ${index === 0 ? 'text-yellow-400' : 'text-purple-300'}`}>
                    {barber.bookingsCount}
                  </span>
                  <span className="text-[10px] uppercase text-purple-500 font-bold">pontos</span>
                </div>
              </Link>
            </motion.div>
          )})}
        </div>

        {/* Footer decoration */}
        <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-purple-800/50">
          <div className="flex items-center gap-1">
            <div className="w-4 h-5 bg-gradient-to-b from-purple-400 to-purple-700 rounded-sm" />
            <div className="w-1 h-4 bg-purple-600 rounded-full" />
            <div className="w-1 h-4 bg-purple-600 rounded-full" />
          </div>
          <Scissors className="w-5 h-5 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default BarberRanking;




