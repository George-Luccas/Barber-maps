import Header from "@/components/header";
import { PageContainer, PageSectionContent, PageSectionTitle } from "@/components/ui/page";
import Footer from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { getUserMembership } from "@/actions/get-user-membership";
import SettingsPlanCard from "./_components/settings-plan-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check } from "lucide-react";

export const dynamic = "force-dynamic";

const SettingsPage = async () => {
    // 1. Fetch available plans
    const plans = await prisma.plan.findMany();
    
    // 2. Fetch user membership
    const membershipResult = await getUserMembership({});
    const membership = membershipResult.data;

    return (
        <div>
            <Header />
            <PageContainer>
                 <h1 className="text-xl font-bold mb-4">Minha Assinatura</h1>
                 
                 {/* Current Subscription Status */}
                 {membership ? (
                     <Card className="mb-6 border-primary/50 bg-primary/5">
                        <CardHeader className="pb-2">
                             <div className="flex justify-between items-center">
                                 <CardTitle className="flex items-center gap-2">
                                     <Crown className="size-5 text-primary fill-primary/20" />
                                     {membership.Plan.name}
                                 </CardTitle>
                                 <Badge className={membership.status === 'ACTIVE' ? 'bg-green-600' : 'bg-destructive'}>
                                     {membership.status === 'ACTIVE' ? 'ATIVO' : 'PENDENTE'}
                                 </Badge>
                             </div>
                        </CardHeader>
                        <CardContent>
                             <div className="flex flex-col gap-2 text-sm text-foreground">
                                 <div className="flex justify-between">
                                     <span className="text-muted-foreground">Saldo de Créditos:</span>
                                     <span className="font-bold text-lg">{membership.current_balance}</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="text-muted-foreground">Renova em:</span>
                                     <span className="font-medium">
                                         {new Date(membership.next_billing_date).toLocaleDateString('pt-BR')}
                                     </span>
                                 </div>
                             </div>
                        </CardContent>
                     </Card>
                 ) : (
                     <div className="mb-6 p-4 rounded-xl bg-muted/50 border text-center">
                         <p className="text-muted-foreground text-sm">Você não possui uma assinatura ativa.</p>
                     </div>
                 )}

                 <PageSectionContent>
                     <PageSectionTitle>Planos Disponíveis</PageSectionTitle>
                     <div className="grid gap-4">
                         {plans.length > 0 ? plans.map(plan => (
                             <SettingsPlanCard 
                                key={plan.id} 
                                plan={plan} 
                                isCurrent={membership?.planId === plan.id}
                             />
                         )) : (
                             <p className="text-muted-foreground text-sm">Nenhum plano disponível no momento.</p>
                         )}
                     </div>
                 </PageSectionContent>
                 
                 {/* Benefits Section */}
                 <PageSectionContent className="mt-8">
                     <PageSectionTitle>Por que ser ASSINANTE?</PageSectionTitle>
                     <div className="grid gap-3">
                         <div className="flex gap-3 items-start">
                             <div className="bg-primary/10 p-2 rounded-full text-primary">
                                 <Check className="size-4" />
                             </div>
                             <div>
                                 <p className="font-bold text-sm">Economia Garantida</p>
                                 <p className="text-xs text-muted-foreground">Pague mensale e economize nos cortes.</p>
                             </div>
                         </div>
                         <div className="flex gap-3 items-start">
                             <div className="bg-primary/10 p-2 rounded-full text-primary">
                                 <Check className="size-4" />
                             </div>
                             <div>
                                 <p className="font-bold text-sm">Sem Preocupações</p>
                                 <p className="text-xs text-muted-foreground">Seus créditos renovam automaticamente todo mês.</p>
                             </div>
                         </div>
                     </div>
                 </PageSectionContent>

            </PageContainer>
            <Footer />
        </div>
    );
}

export default SettingsPage;
