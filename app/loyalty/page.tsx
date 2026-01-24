import Header from "@/components/header";
import Footer from "@/components/footer";
import { PageContainer } from "@/components/ui/page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserLoyaltyCards, getSystemServices } from "@/app/_actions/loyalty";
import { PremiumLoyaltyCard } from "@/components/loyalty/premium-card";
import { LoyaltyExplanation } from "@/components/loyalty-explanation";
import { Gift, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function LoyaltyPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-5 text-center">
          <h2 className="text-xl font-bold">Faça login para ver seus pontos</h2>
          <p className="text-muted-foreground">
            Acompanhe seus cartões de fidelidade e ganhe cortes grátis.
          </p>
          <Link href="/login">
            <Button>Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const loyaltyCards = await getUserLoyaltyCards(session.user.id);
  const systemServices = await getSystemServices();

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <PageContainer>
        <div className="flex items-center justify-between pt-5">
            <div className="flex items-center gap-2">
                 <Link href="/">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ChevronLeft className="size-4" />
                        Voltar
                    </Button>
                 </Link>
                <div className="flex items-center gap-2 ml-2">
                    <Gift className="text-primary size-6" />
                    <h1 className="text-xl font-bold">Minha Fidelidade</h1>
                </div>
            </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
            Complete os cartões e ganhe cortes grátis nas suas barbearias favoritas.
        </p>

        {loyaltyCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 w-full">
            {loyaltyCards.map((card: any) => (
              <div key={card.id} className="flex flex-col gap-2 w-full">
                <Link href={`/barbershops/${card.barbershopId}`} className="hover:opacity-90 transition-opacity text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="font-semibold text-sm">{card.barbershop.name}</span>
                    </div>
                </Link>
                <PremiumLoyaltyCard 
                    barbershopName={card.barbershop.name}
                    barbershopImage={card.barbershop.imageUrl}
                    currentPoints={card.currentPoints}
                    tier={card.tier}
                    totalLifetimePoints={card.totalLifetimePoints}
                    userName={session?.user?.name || "Cliente"}
                    userAvatar={session?.user?.image || undefined}
                    freeCuts={card.freeCuts}
                    transactions={card.transactions}
                    enableFlip={true}
                />
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-10">
                <h3 className="text-lg font-bold">Você ainda não tem cartões de fidelidade</h3>
                <p className="text-sm text-muted-foreground">Agende um serviço para começar a pontuar!</p>
            </div>
        )}
        
        <div className="mt-10 pt-10 border-t">
             <LoyaltyExplanation services={systemServices} />
        </div>
      </PageContainer>
      <div className="pt-10"></div>
      <Footer />
    </div>
  );
}
