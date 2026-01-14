"use client";

import { useUserMembership } from "@/hooks/data/use-user-membership";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Crown, ChevronRight, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MembershipWidget = () => {
  const { data: membership, isLoading } = useUserMembership();

  if (isLoading) {
    return null; // Or skeleton
  }

  // Not signed in or no membership
  if (!membership) {
    return (
        <Card className="rounded-xl border-none bg-gradient-to-r from-violet-600/10 to-indigo-600/10 dark:from-violet-900/20 dark:to-indigo-900/20 mb-4 relative overflow-hidden">
        {/* Background Decoration */}
       <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
           <Crown className="w-40 h-40 rotate-12 fill-primary/20 text-primary" />
       </div>
       <div className="absolute left-[10px] bottom-[-10px] opacity-10 pointer-events-none">
           <Crown className="w-20 h-20 -rotate-12 fill-primary/20 text-primary" />
       </div>

        <CardContent className="p-4 flex items-center justify-between relative z-10">
            <div className="flex flex-col gap-1">
                <p className="font-bold text-sm flex items-center gap-2">
                     <Crown className="size-4 text-primary fill-primary/20" />
                     Seja VIP
                </p>
                <p className="text-xs text-muted-foreground">
                    Economize com o Plano Navalha.
                </p>
            </div>
            <Button size="sm" variant="secondary" className="text-xs h-8 rounded-full cursor-not-allowed opacity-80 hover:bg-secondary" disabled>
                Em breve
            </Button>
        </CardContent>
    </Card>
    );
  }

  const isPastDue = membership.status === 'PAST_DUE';
  const hasCredits = membership.current_balance > 0;

  return (
    <Card className={`rounded-xl border mb-4 mt-4 overflow-hidden relative ${isPastDue ? 'border-destructive/50 bg-destructive/5' : 'border-primary/50 bg-primary/5'}`}>
       {/* Background Decoration */}
       {/* Background Decoration */}
       <div className="absolute right-[-20px] top-[-20px] opacity-20 pointer-events-none">
           <Crown className="w-40 h-40 rotate-12 fill-primary/20 text-primary" />
       </div>
       <div className="absolute left-[10px] bottom-[-10px] opacity-20 pointer-events-none">
           <Crown className="w-20 h-20 -rotate-12 fill-primary/20 text-primary" />
       </div>
       <div className="absolute left-[40%] top-[-10px] opacity-10 pointer-events-none">
           <Crown className="w-12 h-12 rotate-45 fill-primary/20 text-primary" />
       </div>
       <div className="absolute right-[30%] bottom-[10px] opacity-10 pointer-events-none">
           <Crown className="w-8 h-8 -rotate-6 fill-primary/20 text-primary" />
       </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                 <div className={`p-1.5 rounded-full ${isPastDue ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                     <Crown className="size-4 fill-current" />
                 </div>
                 <div>
                     <p className="font-bold text-sm text-foreground">
                         {membership.Plan.name}
                     </p>
                     <p className={`text-[10px] font-bold ${isPastDue ? 'text-destructive' : 'text-primary'}`}>
                         {isPastDue ? 'Renovação Pendente' : 'Assinatura Ativa'}
                     </p>
                 </div>
             </div>
             
             {/* Credit Counter */}
            <div className={`flex flex-col items-end`}>
                 <span className="text-2xl font-black">{membership.current_balance}</span>
                 <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Créditos</span>
            </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                 <Calendar className="size-3" />
                 <span>Renova em: {format(new Date(membership.next_billing_date), "dd 'de' MMMM", { locale: ptBR })}</span>
             </div>
             
             <Button variant="ghost" size="sm" className="h-6 text-xs hover:bg-transparent px-0 hover:text-primary" asChild>
                 <Link href="/settings" className="flex items-center gap-1">
                     Gerenciar <ChevronRight className="size-3" />
                 </Link>
             </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipWidget;
