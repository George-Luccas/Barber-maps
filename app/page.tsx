import Header from "@/components/header";
import Image from "next/image";
import banner from "@/public/banner.png";
import BookingItem from "@/components/booking-item";
import Link from "next/link";

import { getBarbershops, getPopularBarbershops } from "@/data/barbershops";
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

export const dynamic = "force-dynamic";

import { BackgroundVideo } from "@/components/ui/background-video";

export default async function Home() {
  const barbershops = await getBarbershops();
  const popularBarbershops = await getPopularBarbershops();
  
  // CORREÇÃO: Inicializamos como vazio para o app carregar enquanto
  // resolvemos a conexão com o banco na função getUserBookings.
  let confirmedBookings: any[] = []; 

  try {
    // Tentamos buscar os agendamentos reais
    const data = await getUserBookings();
    if (data && data.confirmedBookings) {
      confirmedBookings = data.confirmedBookings;
    }
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
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