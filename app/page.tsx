import Header from "@/components/header";
import Image from "next/image";
import banner from "@/public/banner.png";
import BookingItem from "@/components/booking-item";
import Link from "next/link";

import { getBarbershops, getPopularBarbershops, getBarbershopRanking } from "@/data/barbershops";
import { getUserBookings } from "@/data/bookings";
import BarbershopItem from "@/components/barbershop-item";
import {
  PageContainer,
  PageSectionContent,
  PageSectionScroller,
  PageSectionTitle,
} from "@/components/ui/page";
import Footer from "@/components/footer";
import QuickSearch from "@/components/quick-search";
import MembershipWidget from "@/components/membership-widget";
import { LocationFilter } from "@/components/location-filter";
import BarbershopStories from "@/components/barbershop-stories";
import PromotionsCarousel from "@/components/promotions-carousel";
import BarbershopRanking from "@/components/barbershop-ranking";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserLoyaltyCards } from "@/app/_actions/loyalty";
import { PremiumLoyaltyCard } from "@/components/loyalty/premium-card";
import { Gift } from "lucide-react";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { BackgroundVideo } from "@/components/ui/background-video";

interface HomeProps {
  searchParams: Promise<{
    city?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { city } = await searchParams;
  const barbershops = await getBarbershops();
  const popularBarbershops = await getPopularBarbershops();
  const rankingBarbershops = await getBarbershopRanking(city);
  
  // CORREÇÃO: Inicializamos como vazio para o app carregar enquanto
  // resolvemos a conexão com o banco na função getUserBookings.
  let confirmedBookings: any[] = []; 
  let loyaltyCards: any[] = [];
  let session: any = null;

  try {
    // Tentamos buscar os agendamentos reais
    const data = await getUserBookings();
    if (data && data.confirmedBookings) {
      confirmedBookings = data.confirmedBookings;
    }

    session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (session?.user) {
        loyaltyCards = await getUserLoyaltyCards(session.user.id);
    }
    
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    // Se der erro, o app continua rodando com a lista vazia
  }

  return (
    <div className="relative min-h-screen">
       <BackgroundVideo 
          src="/background.mp4" 
          className="scale-100 md:scale-125 transition-transform"
          videoClassName="object-[35%_center]" // Shifted lateral position to show eye (10% right)
       />
      <Header />
      <div className="relative z-10">
      <PageContainer>
        <div className="pt-5"> 
          <h2 className="text-xl font-bold mb-3">Destaques</h2>
          <BarbershopStories />
        </div>
        
        <PromotionsCarousel />

        <QuickSearch />
        
        <BarbershopRanking barbershops={rankingBarbershops as any} city={city} />

        <div className="mt-6">
           <LocationFilter />
        </div>
        <MembershipWidget />

        {/* RADAR BANNER SECTION */}
        <Link href="/barber-radar" className="block px-5">
          <div className="relative overflow-hidden rounded-xl bg-muted border border-neon-purple/20 h-[150px] flex items-center group cursor-pointer transition-all hover:border-neon-purple/50 dark:bg-black/40">
            {/* Radar Animation Background */}
            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-20 dark:opacity-40">
              <div className="absolute w-24 h-24 rounded-full border border-neon-purple animate-radar" />
              <div className="absolute w-24 h-24 rounded-full border border-neon-purple animate-radar [animation-delay:1s]" />
              <div className="absolute w-24 h-24 rounded-full border border-neon-purple animate-radar [animation-delay:2s]" />
              <div className="w-12 h-12 bg-neon-purple rounded-full blur-xl animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col gap-1 ml-32">
              <h2 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-purple"></span>
                </span>
                Barber Radar
              </h2>
              <p className="text-sm text-gray-400 max-w-[200px]">
                Encontre as barbearias mais próximas de você agora mesmo.
              </p>
              <div className="mt-2 text-xs font-bold text-neon-purple uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Ativar Scanner <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>

            {/* Decorative Image/Icon on Right */}
            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-neon-purple"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        </Link>

        {/* FEEDBACK BANNER */}
        <Link href="/feedback" className="block px-5 mt-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 p-6 flex items-center justify-between hover:border-neon-purple/50 transition-colors group">
            <div className="flex flex-col gap-2 relative z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Central de Melhorias
              </h2>
              <p className="text-sm text-gray-400">
                Tem alguma <span className="text-neon-purple font-semibold">dica</span>, <span className="text-neon-purple font-semibold">sugestão</span> ou <span className="text-neon-purple font-semibold">crítica</span>?
                <br />
                Queremos ouvir você para evoluir a plataforma!
              </p>
              <div className="mt-2 text-xs font-bold text-neon-purple uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Enviar Feedback <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
            {/* Background Decoration */}
             <div className="absolute right-[-10px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity rotate-[-12deg]">
               <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
          </div>
        </Link>
        
        {/* LOYALTY SECTION - ALWAYS VISIBLE */}
        <PageSectionContent>
            <div className="flex items-center justify-between mb-3">
                <PageSectionTitle>Minha Fidelidade</PageSectionTitle>
                <Link href="/loyalty" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    Ver tudo <Gift className="size-3" />
                </Link>
            </div>
            
            {loyaltyCards.length > 0 ? (
                <div className="flex flex-col gap-4 w-full">
                    {loyaltyCards.map((card) => (
                        <div key={card.id} className="w-full">
                             <Link href={`/barbershops/${card.barbershopId}`} className="block mb-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors text-center">
                                {card.barbershop.name}
                             </Link>
                            <Link href="/loyalty" className="block cursor-pointer hover:opacity-95 transition-opacity">
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
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full flex justify-center py-4">
                    <PremiumLoyaltyCard 
                        barbershopName="Sua Barbearia Favorita"
                        currentPoints={0}
                        tier="BRONZE"
                        totalLifetimePoints={0}
                        userName={session?.user?.name || "Visitante"}
                        userAvatar={session?.user?.image || undefined}
                        freeCuts={0}
                    />
                </div>
            )}
        </PageSectionContent>

        {/* Agora esta parte está protegida e não quebra o app */}
        {confirmedBookings.length > 0 && (
          <PageSectionContent>
            <PageSectionTitle>Agendamentos</PageSectionTitle>
            <PageSectionScroller>
              {confirmedBookings.map((booking: any) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </PageSectionScroller>
          </PageSectionContent>
        )}

        <PageSectionContent>
          <PageSectionTitle>Barbearias</PageSectionTitle>
          <PageSectionScroller>
            {barbershops.map((barbershop: any) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop as any} />
            ))}
          </PageSectionScroller>
        </PageSectionContent>

        <PageSectionContent>
          <PageSectionTitle>Barbearias populares</PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barbershop: any) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop as any} />
            ))}
          </PageSectionScroller>
        </PageSectionContent>
      </PageContainer>
      <Footer />
      </div>
    </div>
  );
}