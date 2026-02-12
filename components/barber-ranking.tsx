"use client";

import { motion } from "framer-motion";
import { Scissors, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BarberWithStats {
  id: string;
  name: string;
  imageUrl: string | null;
  bookingsCount?: number;
  rating?: number; // Added rating
  reviewCount?: number; // Added review count
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

  // Utilize the passed order (already sorted by rating)
  const sortedBarbers = barbers.slice(0, 10);
  const maxRating = 5; // Max rating is always 5

  const getBarStyles = (index: number) => {
    switch (index) {
      case 0: return {
        gradient: "bg-gradient-to-t from-yellow-600 via-yellow-400 to-yellow-200",
        shadow: "shadow-[0_0_30px_rgba(250,204,21,0.5)]",
        border: "border-yellow-300",
        text: "text-yellow-400"
      };
      case 1: return {
        gradient: "bg-gradient-to-t from-gray-600 via-gray-400 to-gray-200",
        shadow: "shadow-[0_0_20px_rgba(156,163,175,0.4)]",
        border: "border-gray-300",
        text: "text-gray-300"
      };
      case 2: return {
        gradient: "bg-gradient-to-t from-orange-700 via-orange-500 to-orange-300",
        shadow: "shadow-[0_0_20px_rgba(249,115,22,0.4)]",
        border: "border-orange-400",
        text: "text-orange-400"
      };
      default: return {
        gradient: "bg-gradient-to-t from-purple-900 via-purple-600 to-purple-400",
        shadow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        border: "border-purple-500",
        text: "text-purple-300"
      };
    }
  };

  return (
    <div className="relative mx-4 my-8 p-6 rounded-3xl bg-black/40 border border-purple-500/30 backdrop-blur-sm overflow-hidden">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-black uppercase tracking-wider text-white">
                    Ranking <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Top 10</span>
                </h2>
                <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Os melhores avaliados</p>
                    <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-wider">
                        {(() => {
                            const date = new Date();
                            const month = date.getMonth();
                            const quarters = ["Jan - Mar", "Abr - Jun", "Jul - Set", "Out - Dez"];
                            const currentQuarter = quarters[Math.floor(month / 3)];
                            return `● Ciclo: ${currentQuarter}`;
                        })()}
                    </p>
                </div>
            </div>
            <Crown className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse" />
        </div>

        {/* Chart Container - Scrollable horizontally on mobile */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex items-end justify-center min-w-max gap-4 md:gap-8 px-4 pt-12 pb-2">
                {sortedBarbers.map((barber, index) => {
                    const styles = getBarStyles(index);
                    const rating = barber.rating || 0;
                    
                    // USER REQUEST: Rank-based strict hierarchy (1st > 2nd > 3rd...)
                    // Instead of rating-based height, we use index-based decay.
                    // Index 0 (1st) = 100%, Index 1 (2nd) = 90%, etc.
                    const visualHeight = 100 - (index * 7); 
                    
                    return (
                        <div key={barber.id} className="flex flex-col items-center group relative w-16 md:w-24">
                            
                            {/* Score Bubble */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                className={`mb-2 font-black text-lg ${styles.text} flex items-center gap-1`}
                            >
                                <span className="text-sm">★</span> {rating.toFixed(1)}
                            </motion.div>

                            {/* Bar Track (Fixed Height Area) */}
                            <div className="h-[180px] w-full flex items-end justify-center relative">
                                {/* The Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${visualHeight}%` }}
                                    transition={{ 
                                        duration: 1.5, 
                                        ease: [0.34, 1.56, 0.64, 1],
                                        delay: index * 0.1 
                                    }}
                                    className={`w-full relative rounded-t-lg ${styles.gradient} ${styles.shadow} opacity-90 hover:opacity-100 transition-opacity`}
                                >
                                    {/* Pattern Overlay */}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
                                    
                                    {/* Avatar (Inside Bar at top - absolute relative to the bar) */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-background z-10 overflow-hidden shadow-lg">
                                        <Image
                                            src={barber.imageUrl || "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"}
                                            alt={barber.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    
                                    {/* Rank Number (Bottom of bar) */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-black text-black/50 text-xl md:text-2xl">
                                        {index + 1}
                                    </div>
                                </motion.div>
                                
                                {/* Podium Base for Top 3 (Behind/Bottom of track) */}
                                {index < 3 && (
                                    <div className={`absolute bottom-0 w-[120%] h-1 ${styles.border.replace('border', 'bg')} blur-sm`} />
                                )}
                            </div>

                            {/* Name (Below Bar) */}
                            <Link href={`/barbers/${barber.id}`} className="mt-3 text-center">
                                <span className="block text-xs font-bold uppercase tracking-wider text-white truncate max-w-[90px] group-hover:text-purple-400 transition-colors">
                                    {barber.name.split(' ')[0]}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    ({barber.reviewCount || 0} avaliações)
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>
            
            {/* Floor Line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mt-[-1px]" />
        </div>
    </div>
  );
};

export default BarberRanking;




