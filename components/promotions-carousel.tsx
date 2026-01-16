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

    return (
        <div className="w-full mt-4 mb-2 px-5">
            <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3">Avisos & Promoções</h2>
            
            <div className="relative w-full h-16 rounded-xl overflow-hidden border border-neon-purple/50 shadow-lg bg-black">
                {/* Background Image with Darkness Overlay */}
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

                {/* Scrolling Text */}
                <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
                   <motion.div 
                        className="flex gap-10 items-center min-w-full"
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 20, 
                            ease: "linear" 
                        }}
                   >
                        {promotions.map((promo, index) => (
                             <div key={promo.id} className="flex items-center gap-4 text-neon-purple font-bold text-lg uppercase tracking-wider">
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
                         {/* Duplicate for seamless loop if needed, though 100% to -100% usually works for simple marquee */}
                   </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PromotionsCarousel;
