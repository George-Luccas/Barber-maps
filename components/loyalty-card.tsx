"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Trophy, Crown, Medal, Scissors } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LoyaltyCardProps {
    currentPoints: number;
    freeCuts: number;
    tier: "BRONZE" | "SILVER" | "GOLD";
    totalLifetimePoints: number;
}

const TIER_CONFIG = {
    BRONZE: {
        label: "Bronze",
        icon: Medal,
        color: "text-amber-500", // Brighter for dark bg
        bgColor: "from-amber-950 via-amber-900 to-black", // Dark gradient
        borderColor: "border-amber-700/50",
        progressColor: "bg-amber-500"
    },
    SILVER: {
        label: "Prata",
        icon: Trophy,
        color: "text-slate-200",
        bgColor: "from-slate-900 via-slate-800 to-black",
        borderColor: "border-slate-400/50",
        progressColor: "bg-slate-300"
    },
    GOLD: {
        label: "Ouro",
        icon: Crown,
        color: "text-yellow-400",
        bgColor: "from-yellow-950 via-yellow-900 to-black",
        borderColor: "border-yellow-500/50",
        progressColor: "bg-yellow-400"
    }
};

export function LoyaltyCard({ currentPoints, freeCuts, tier = "BRONZE", totalLifetimePoints }: LoyaltyCardProps) {
    const config = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;
    const Icon = config.icon;
    const POINTS_GOAL = 100;

    return (
        <Card className={cn(
            "border-0 overflow-hidden relative transition-all duration-300 shadow-xl",
            "bg-gradient-to-br",
            config.bgColor,
        )}>
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-3 opacity-20 rotate-12 translate-x-4 -translate-y-4">
                <Icon size={140} className={config.color} />
             </div>
             <div className="absolute bottom-0 left-0 p-3 opacity-5">
                <Scissors size={100} />
             </div>
             
             {/* Card Brand Header */}
             <div className="absolute top-4 right-4 z-20">
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">BarberMaps</p>
             </div>

            <CardHeader className="pb-2 relative z-10">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Cartão Fidelidade</p>
                    <CardTitle className={cn("flex items-center gap-2 text-2xl font-black tracking-tight", config.color)}>
                        <Badge variant="outline" className={cn(
                            "h-10 w-10 rounded-full p-0 flex items-center justify-center border-2 border-inherit shadow-sm",
                            "bg-background/50 backdrop-blur-sm",
                            config.color
                        )}>
                            <Gift size={20} />
                        </Badge>
                        {config.label.toUpperCase()}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="z-10 relative mt-4">
                <div className="space-y-5">
                    
                    {/* Progress Section */}
                    <div className="bg-background/30 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-inner">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span>Pontos</span>
                            <span>{currentPoints} / {POINTS_GOAL}</span>
                        </div>
                        <div className="h-4 w-full bg-background/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
                            <div 
                                className={cn("h-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]", config.progressColor)}
                                style={{ width: `${Math.min((currentPoints / POINTS_GOAL) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] opacity-70 mt-2 text-right">
                            {POINTS_GOAL - currentPoints > 0 
                                ? `Faltam ${POINTS_GOAL - currentPoints} pontos para o prêmio` 
                                : "Prêmio disponível!"}
                        </p>
                    </div>

                    {/* Stats Footer */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                            <p className="text-[10px] uppercase font-bold opacity-60">Total Acumulado</p>
                            <p className="text-lg font-black">{totalLifetimePoints}</p>
                        </div>
                        
                        {freeCuts > 0 && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg animate-pulse px-3 py-1">
                                <Gift size={12} className="mr-1" />
                                {freeCuts} Prêmio{freeCuts > 1 ? 's' : ''} Disponíve{freeCuts > 1 ? 'is' : 'l'}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
