"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPromotions } from "@/app/_actions/promotions";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
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
                 const data = await getPromotions(true); // Active only
                 // Adapt Prisma type if needed, but for now strict matches
                 setPromotions(data);
             } catch (error) {
                 console.error("Failed to fetch promotions", error);
             }
        };
        fetchPromotions();
    }, []);

    if (promotions.length === 0) return null;

    return (
        <div className="w-full mt-4 mb-2">
            <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3 px-5">Promoções Imperdíveis</h2>
            
            <div className="flex gap-4 overflow-x-auto px-5 pb-4 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
                 {promotions.map((promo) => (
                     <div key={promo.id} className="min-w-[85%] sm:min-w-[350px] snap-center">
                         <div className="relative h-[180px] w-full rounded-2xl overflow-hidden border border-neon-purple/20 shadow-lg group">
                            <Image 
                                src={promo.imageUrl} 
                                alt={promo.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                                <h3 className="text-lg font-bold text-white leading-tight mb-1">{promo.title}</h3>
                                {promo.description && (
                                    <p className="text-xs text-gray-300 line-clamp-2 mb-2">{promo.description}</p>
                                )}
                                
                                {promo.linkUrl && (
                                    <a 
                                        href={promo.linkUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="self-start text-[10px] font-bold bg-neon-purple text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-neon-purple/80 transition-colors"
                                    >
                                        Saiba Mais <ExternalLink className="size-3" />
                                    </a>
                                )}
                            </div>
                         </div>
                     </div>
                 ))}
            </div>
        </div>
    );
};

export default PromotionsCarousel;
