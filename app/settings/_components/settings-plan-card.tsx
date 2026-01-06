"use client";

import { Plan } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

interface SettingsPlanCardProps {
    plan: Plan;
    isCurrent: boolean;
}

import { simulateSubscription } from "@/actions/simulate-subscription";

// ...

const SettingsPlanCard = ({ plan, isCurrent }: SettingsPlanCardProps) => {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const { executeAsync, isPending } = useAction(simulateSubscription);

    const handleSubscribe = async () => {
        if (!session?.user) {
            router.push('/login');
            return;
        }

        const result = await executeAsync({ planId: plan.id });

        if (result.serverError) {
            toast.error("Erro ao assinar (Simulação).");
            return;
        }
        
        if (result.data?.success) {
            toast.success("Assinatura ativada com sucesso! (Simulação)");
            router.refresh();
        }
    };

    return (
        <Card className={`overflow-hidden ${isCurrent ? 'border-primary shadow-md' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.service_limit} cortes por mês</p>
                    <p className="font-bold text-primary mt-1">
                        {formatCurrency(Number(plan.price) * 100)}
                        <span className="text-xs font-normal text-muted-foreground">/mês</span>
                    </p>
                </div>
                
                <Button 
                    disabled={isCurrent || isPending} 
                    onClick={handleSubscribe}
                    variant={isCurrent ? "outline" : "default"}
                    className={isCurrent ? "border-primary text-primary" : ""}
                >
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : isCurrent ? "Plano Atual" : "Assinar"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default SettingsPlanCard;
