"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown, Trophy, Medal, MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface PremiumLoyaltyCardProps {
    barbershopName: string;
    barbershopImage?: string;
    currentPoints: number;
    tier: "BRONZE" | "SILVER" | "GOLD";
    totalLifetimePoints: number;
    userName?: string;
    userAvatar?: string;
    freeCuts: number;
}

export function PremiumLoyaltyCard({ 
    barbershopName,
    barbershopImage,
    currentPoints, 
    tier = "BRONZE", 
    userName = "Cliente",
    userAvatar,
    freeCuts,
}: PremiumLoyaltyCardProps) {
    
    // Config values
    const POINTS_GOAL = 100;
    const progress = Math.min((currentPoints / POINTS_GOAL) * 100, 100);

    // Tier Indicators
    const tiers = [
        { id: "BRONZE", label: "Bronze", icon: Medal, color: "text-amber-600", bg: "bg-amber-600", border: "border-amber-600", points: 10 },
        { id: "SILVER", label: "Prata", icon: Trophy, color: "text-slate-300", bg: "bg-slate-300", border: "border-slate-300", points: 50 },
        { id: "GOLD", label: "Ouro", icon: Crown, color: "text-yellow-400", bg: "bg-yellow-400", border: "border-yellow-400", points: 100 },
    ];

    const currentTierIdx = tiers.findIndex(t => t.id === tier);

    return (
        <Card 
            className={cn(
                "w-full overflow-hidden border-0 bg-transparent shadow-2xl relative group transition-all duration-300",
                `shadow-[0_0_30px_rgba(var(--pulsing-color),0.4)] hover:shadow-[0_0_50px_rgba(var(--pulsing-color),0.6)]`
            )}
            style={{
                // @ts-ignore
                "--pulsing-color": tier === "GOLD" ? "250, 204, 21" : tier === "SILVER" ? "203, 213, 225" : "217, 119, 6"
            }}
        >
            {/* Pulsing Aura Internal Overlay */}
            <div className={cn(
                "absolute inset-0 opacity-30 animate-pulse z-0 pointer-events-none",
                "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]",
                tier === "GOLD" ? "from-yellow-500/40 via-transparent to-transparent" : 
                tier === "SILVER" ? "from-slate-100/30 via-transparent to-transparent" :
                "from-amber-600/40 via-transparent to-transparent"
             )} />

            {/* Main Background - Dark Luxury Texture */}
            <div className="absolute inset-0 bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black z-0"></div>
            
            {/* Gold Border/Frame Effect */}
            <div className="absolute inset-0 rounded-xl border border-yellow-500/20 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)] z-10 pointer-events-none"></div>

            <CardContent className="relative z-20 p-6 flex flex-col gap-6">
                
                {/* Header: Logo & Title */}
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                        <Crown className="text-black fill-current" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-yellow-500 font-serif tracking-widest text-lg font-bold">BARBERMAPS</h2>
                        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Cartão Fidelidade</p>
                    </div>
                </div>

                {/* Progress Bar Timeline */}
                <div className="relative pt-4 pb-2">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-800 rounded-full -translate-y-1/2 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-yellow-600 shadow-[0_0_10px_theme(colors.yellow.500)] transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    
                    {/* Milestones */}
                    <div className="flex justify-between relative z-10">
                         {tiers.map((t, idx) => {
                             const isActive = idx <= currentTierIdx;
                             const Icon = t.icon;
                             return (
                                <div key={t.id} className="flex flex-col items-center gap-2">
                                    <div className={cn(
                                        "h-8 w-8 rounded-full border-2 flex items-center justify-center bg-black transition-all duration-500",
                                        isActive ? `${t.border} ${t.color} shadow-[0_0_10px_currentColor]` : "border-gray-700 text-gray-700"
                                    )}>
                                        {isActive ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-gray-700" />}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider",
                                        isActive ? t.color : "text-gray-700"
                                    )}>{t.label}</span>
                                </div>
                             )
                         })}
                    </div>
                </div>

                {/* Current Points Info */}
                <div className="text-center space-y-1">
                    <h3 className="text-2xl font-bold text-white">
                        <span className="text-yellow-400">{currentPoints}</span>
                        <span className="text-sm font-normal text-gray-400 ml-1">pontos</span>
                    </h3>
                    <p className="text-xs text-gray-500">
                        Faltam <span className="text-white font-bold">{Math.max(0, POINTS_GOAL - currentPoints)}</span> pontos para subir de nível!
                    </p>
                </div>

                {/* User Info (Mini Profile) */}
                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/5 backdrop-blur-sm">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10">
                        {userAvatar ? (
                             <Image src={userAvatar} alt={userName} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                {userName.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200">{userName}</span>
                        <span className="text-[10px] text-gray-500">{barbershopName}</span>
                    </div>
                     {freeCuts > 0 && (
                        <Badge className="ml-auto bg-yellow-500 text-black hover:bg-yellow-400 text-xs gap-1">
                            <Crown size={10} />
                            {freeCuts} Prêmio(s)
                        </Badge>
                     )}
                </div>

                {/* Badges Footer (Visual Decoration) */}
                <div className="grid grid-cols-3 gap-2 mt-2 opacity-80">
                    {tiers.map((t) => (
                         <div key={t.id} className={cn(
                             "flex flex-col items-center justify-center p-2 rounded border bg-gradient-to-b from-transparent to-white/5",
                             tier === t.id ? `${t.border} to-${t.bg}/10` : "border-gray-800 opacity-30 grayscale"
                         )}>
                             <t.icon size={16} className={cn("mb-1", t.color)} />
                             <span className={cn("text-[8px] font-bold", t.color)}>{t.points} PTS</span>
                         </div>
                    ))}
                </div>

            </CardContent>
        </Card>
    );
}
