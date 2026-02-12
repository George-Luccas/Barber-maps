import Header from "@/components/header";
import Footer from "@/components/footer";
import NavigationTabs from "@/components/navigation-tabs";
import BarberItem from "@/components/barber-item";
import BarberCard from "@/components/barber-card";
import BarberRanking from "@/components/barber-ranking";
import { getBarbers } from "@/data/barbers";
import { getBarberRankingByRating, getAllBarbersWithRatings } from "@/app/_actions/ranking";
import {
  PageContainer,
  PageSectionTitle,
} from "@/components/ui/page";
import { BackgroundVideo } from "@/components/ui/background-video";
import { AutoScrollCarousel } from "@/components/auto-scroll-carousel";

export const dynamic = "force-dynamic";

export default async function BarbersPage() {
  const barbers = await getAllBarbersWithRatings();
  // Fetch ranking by rating
  const rankingBarbers = await getBarberRankingByRating();

  return (
    <div className="relative min-h-screen">
      <BackgroundVideo 
        src="/background.mp4" 
        className="scale-100 md:scale-125 transition-transform"
        videoClassName="object-[35%_center]"
      />
      <Header />
      <div className="relative z-10">
        <PageContainer>
          <NavigationTabs />
        </PageContainer>

        {/* Carrossel de tela cheia (Estilo Circular Original) */}
        <div className="mt-8 mb-6">
          <PageContainer>
            <PageSectionTitle>Nossos Talentos</PageSectionTitle>
          </PageContainer>
          {barbers.length > 0 ? (
            <div className="mt-6 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              <AutoScrollCarousel>
                {barbers.map((barber) => (
                  <div key={barber.id} className="flex-shrink-0 mx-4">
                    <BarberItem barber={barber} /> 
                  </div>
                ))}
              </AutoScrollCarousel>
            </div>
          ) : null}
        </div>

        {/* Grade de Cards (Novo Estilo Player Card) */}
        <div className="mb-12">
          <PageContainer>
            <PageSectionTitle>Elenco Completo</PageSectionTitle>
            {barbers.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {barbers.map((barber) => (
                  <BarberCard key={barber.id} barber={barber} />
                ))}
              </div>
            ) : (
              <div className="p-10 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center gap-3">
                <span className="text-4xl">✂️</span>
                <p className="text-muted-foreground">Nenhum barbeiro cadastrado ainda.</p>
              </div>
            )}
          </PageContainer>
        </div>

        {/* Ranking de Barbeiros */}
        {rankingBarbers.length > 0 && (
          <BarberRanking barbers={rankingBarbers} />
        )}

        <Footer />
      </div>
    </div>
  );
}
