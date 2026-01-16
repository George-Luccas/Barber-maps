"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPromotions } from "@/app/_actions/promotions";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface Promotion {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    linkUrl: string | null;
}

const PromotionsCarousel = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    
    useEffect(() => {
        const fetchPromotions = async () => {
             try {
                 const data = await getPromotions(true);
                 setPromotions(data);
             } catch (error) {
                 console.error("Failed to fetch promotions", error);
             }
        };
        fetchPromotions();
    }, []);

    if (promotions.length === 0) return null;

    // Use the image of the first promotion as background, or a default fallback
    const bgImage = promotions[0].imageUrl;

    // Duplicate promotions for seamless infinite loop
    const marqueePromotions = [...promotions, ...promotions, ...promotions, ...promotions];

    return (
        <div className="w-full mt-4 mb-2 px-5 text-center sm:text-left">
            <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3">Avisos & Promoções</h2>
            
            <div className="relative w-full h-16 rounded-xl overflow-hidden border border-neon-purple/50 shadow-lg bg-black">
                {/* Warning Pattern Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-zinc-900 to-black overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" 
                        style={{ 
                            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 10px, transparent 10px, transparent 20px)" 
                        }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-around opacity-20">
                         {Array.from({ length: 15 }).map((_, i) => (
                             <span key={i} className="text-3xl select-none">⚠️</span>
                         ))}
                    </div>
                </div>

                {/* Scrolling Text CSS Animation */}
                <div className="absolute inset-0 flex items-center overflow-hidden">
                   <style jsx>{`
                       @keyframes marquee {
                           0% { transform: translateX(0); }
                           100% { transform: translateX(-50%); }
                       }
                       .animate-marquee {
                           display: flex;
                           min-width: 200%;
                           animation: marquee 30s linear infinite;
                       }
                   `}</style>
                   <div className="animate-marquee flex gap-10 items-center">
                        {marqueePromotions.map((promo, index) => (
                             <div key={`${promo.id}-${index}`} className="flex items-center gap-4 text-neon-purple font-bold text-lg uppercase tracking-wider shrink-0">
                                <span>🚨 {promo.title}</span>
                                {promo.description && <span className="text-white text-sm font-medium normal-case">- {promo.description}</span>}
                                {promo.linkUrl && (
                                     <a href={promo.linkUrl} target="_blank" className="bg-neon-purple/20 text-xs px-2 py-1 rounded hover:bg-neon-purple/40 transition">
                                         Ver Mais
                                     </a>
                                )}
                                <span className="text-gray-500 mx-4">|</span>
                             </div>
                        ))}
                   </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionsCarousel;
