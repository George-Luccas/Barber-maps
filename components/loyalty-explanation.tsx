"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle2, Star, Sparkles } from "lucide-react";
import { LoyaltyCard } from "./loyalty-card";

interface LoyaltyExplanationProps {
    services?: { name: string, points: number }[];
}

export function LoyaltyExplanation({ services = [] }: LoyaltyExplanationProps) {
  return (
    <div className="space-y-8 mt-6">
        <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
            <Info className="text-primary size-5" />
            Como funciona?
            </h3>
            
            <div className="space-y-3">
            <Card className="p-4 border-l-4 border-l-amber-700 bg-card/50">
                <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-700/10 text-amber-700 flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                    <h4 className="font-semibold text-sm">Agende e Pontue</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                    Cada serviço vale pontos. Confira a tabela abaixo para saber quanto vale cada um.
                    </p>
                </div>
                </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-slate-400 bg-card/50">
                <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-400/10 text-slate-400 flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                    <h4 className="font-semibold text-sm">Suba de Nível</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                    Complete cartões para evoluir: 
                    <span className="text-amber-700 font-bold ml-1">Bronze</span> → 
                    <span className="text-slate-400 font-bold ml-1">Prata</span> → 
                    <span className="text-yellow-500 font-bold ml-1">Ouro</span>.
                    </p>
                </div>
                </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-yellow-500 bg-card/50">
                <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 font-bold">3</div>
                <div>
                    <h4 className="font-semibold text-sm">Resgate Prêmios</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                    Ao atingir <strong>100 pontos</strong>, você ganha um serviço grátis!
                    </p>
                </div>
                </div>
            </Card>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="text-green-500 size-5" />
                Seu Status Inicial
            </h3>
            <p className="text-sm text-muted-foreground">
                Todo cliente começa com o cartão Bronze. Comece a agendar para preenchê-lo!
            </p>
            
            {/* Visual Example */}
            <div className="flex justify-center opacity-100 mt-4">
                <LoyaltyCard 
                    currentPoints={0}
                    freeCuts={0}
                    tier="BRONZE"
                    totalLifetimePoints={0}
                />
                <p className="text-center text-xs text-muted-foreground mt-2 italic">
                    *Exemplo ilustrativo do seu cartão
                </p>
            </div>
        </div>
        </div>
        
        {/* SCORE TABLE SECTION */}
        {services.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Star className="text-yellow-500 size-5 fill-yellow-500" />
                    Tabela de Pontuação
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Veja quantos pontos você ganha ao realizar cada procedimento em nossas barbearias parceiras.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {services.map((service, index) => (
                         <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/40 hover:bg-card/60 transition-colors">
                             <div className="flex items-center gap-2">
                                 <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                                     <Sparkles size={12} />
                                 </div>
                                 <span className="text-xs font-semibold">{service.name}</span>
                             </div>
                             <Badge variant="secondary" className="font-bold text-xs bg-primary/10 hover:bg-primary/20 text-primary border-0">
                                 +{service.points} pts
                             </Badge>
                         </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
