"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Crown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Barbershop } from "@prisma/client";

interface BarbershopWithBookings extends Barbershop {
  bookingsCount: number;
}

interface BarbershopRankingProps {
  barbershops: BarbershopWithBookings[];
  city?: string;
}

const BarbershopRanking = ({ barbershops, city }: BarbershopRankingProps) => {
  const top3 = barbershops.slice(0, 3);
  const others = barbershops.slice(3);

  const getCrownColor = (index: number) => {
    switch (index) {
      case 0: return "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]";
      case 1: return "text-slate-300 fill-slate-300 drop-shadow-[0_0_5px_rgba(203,213,225,0.6)]";
      case 2: return "text-amber-600 fill-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.6)]";
      default: return "text-gray-500 fill-none";
    }
  };

  const RankItem = ({ barbershop, index, isTop3 = false }: { barbershop: BarbershopWithBookings, index: number, isTop3?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }} // Faster cascading on mobile
      className="w-full"
    >
      <Link
        href={`/barbershops/${barbershop.id}`}
        className={`group relative flex items-center gap-3 bg-muted/20 backdrop-blur-md p-3 sm:gap-4 sm:p-4 rounded-2xl border border-white/5 hover:border-neon-purple/50 transition-all duration-300 dark:bg-black/40 ${isTop3 ? 'sm:flex-col sm:text-center sm:p-6 sm:justify-center' : ''}`}
      >
        {/* Crown Icon */}
        <div className={`flex items-center justify-center ${isTop3 ? 'sm:mb-2' : 'w-8 sm:w-10'}`}>
          <motion.div
            animate={{
              y: [0, -8, 0, -8, 0],
              rotate: index === 0 ? [-5, 5, -5] : 0
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              repeatDelay: 5,
              ease: "easeInOut",
              delay: index * 0.5 
            }}
          >
            <Crown className={`${getCrownColor(index)} ${isTop3 && index === 0 ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
          </motion.div>
        </div>

        {/* Image */}
        <div className={`relative rounded-full overflow-hidden border-2 border-muted group-hover:border-neon-purple transition-colors shrink-0 ${isTop3 ? 'w-12 h-12 sm:w-20 sm:h-20 mx-auto' : 'w-10 h-10 sm:w-12 sm:h-12'}`}>
          <Image
            src={barbershop.imageUrl || "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"}
            alt={barbershop.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate group-hover:text-neon-purple transition-colors text-sm sm:text-base leading-tight">
            {barbershop.name}
          </h3>
          <p className="text-gray-400 text-[9px] sm:text-[10px] truncate">{barbershop.address}</p>
        </div>

        {/* Stats */}
        <div className={`${isTop3 ? 'sm:mt-2' : 'text-right shrink-0'}`}>
          <div className="text-neon-purple font-black text-sm sm:text-xl leading-none">{barbershop.bookingsCount}</div>
          <div className="text-[7px] sm:text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Cortes</div>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-2xl bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Link>
    </motion.div>
  );

  const [positions, setPositions] = useState<{top: string, left: string}[]>([]);

  useEffect(() => {
    // Generate random positions only on the client
    const newPositions = Array.from({ length: 15 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setPositions(newPositions);
  }, []);

  if (barbershops.length === 0) return null;

  return (
    <div className="relative p-5">
      {/* Background Crowns - Client side only positions */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {positions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute hidden sm:block"
            style={{
              top: pos.top,
              left: pos.left,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Crown 
              className="text-white fill-none stroke-[0.2]" 
              size={60 + (i * 30)} 
            />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 sm:px-5 mb-4 sm:mb-6 relative z-10">
        <TrendingUp className="text-neon-purple w-4 h-4 sm:w-5 sm:h-5" />
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
          {city ? `Ranking em ${city}` : "Barbe-Ranking Global"}
        </h2>
      </div>

      <div className="relative z-10 px-4 sm:px-5 space-y-4 sm:space-y-8">
        {/* Top 3 Section - Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Order logic for desktop: 2nd, 1st, 3rd. Mobile: Sequential. */}
          <div className="order-2 sm:order-1">
             {top3[1] && <RankItem barbershop={top3[1]} index={1} isTop3 />}
          </div>
          <div className="order-1 sm:order-2 sm:-mt-4">
             {top3[0] && <RankItem barbershop={top3[0]} index={0} isTop3 />}
          </div>
          <div className="order-3 sm:order-3">
             {top3[2] && <RankItem barbershop={top3[2]} index={2} isTop3 />}
          </div>
        </div>

        {/* Others Section - 1 column mobile, 2 columns tablet+, 2 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {others.map((barbershop, idx) => (
            <RankItem key={barbershop.id} barbershop={barbershop} index={idx + 3} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarbershopRanking;
