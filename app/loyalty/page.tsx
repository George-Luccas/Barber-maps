import Header from "@/components/header";
import Footer from "@/components/footer";
import { PageContainer, PageSectionTitle } from "@/components/ui/page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserLoyaltyCards } from "@/app/_actions/loyalty";
import { PremiumLoyaltyCard } from "@/components/loyalty/premium-card";
import { LoyaltyExplanation } from "@/components/loyalty-explanation";
import { Gift } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <PageContainer>
        <div className="flex items-center gap-2 pt-5">
            <Gift className="text-primary size-6" />
            <h1 className="text-xl font-bold">Minha Fidelidade</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
            Complete os cartões e ganhe cortes grátis nas suas barbearias favoritas.
        </p>

        {loyaltyCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyaltyCards.map((card: any) => (
              <div key={card.id} className="flex flex-col gap-2">
                <Link href={`/barbershops/${card.barbershopId}`} className="hover:opacity-90 transition-opacity">
                    <div className="flex items-center gap-2 mb-2">
                         {/* We could add generic avatar if image missing or use pure text */}
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
                />
              </div>
            ))}
          </div>
        ) : (
           <LoyaltyExplanation />
        )}
      </PageContainer>
      <div className="pt-10"></div>
      <Footer />
    </div>
  );
}
