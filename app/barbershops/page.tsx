import Header from "@/components/header";
import Footer from "@/components/footer";
import BarbershopItem from "@/components/barbershop-item";
import { getBarbershops } from "@/data/barbershops";
import {
  PageContainer,
  PageSectionContent,
  PageSectionTitle,
} from "@/components/ui/page";
import { LocationFilter } from "../_components/location-filter";

interface BarbershopsPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    state?: string;
  }>;
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const { search, city, state } = await searchParams;

  const barbershops = await getBarbershops({ 
    search,
    city: city === "all" ? undefined : city,
    state: state === "all" ? undefined : state,
  });

  return (
    <div>
      <Header />
      <PageContainer>
        <PageSectionContent>
          <PageSectionTitle>
             {search ? `Resultados para "${search}"` : "Barbearias"}
          </PageSectionTitle>
          
          <LocationFilter />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {barbershops.map((barbershop) => (
              <div key={barbershop.id} className="w-full">
                <BarbershopItem barbershop={barbershop} />
              </div>
            ))}
          </div>

          {barbershops.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <p>Nenhuma barbearia encontrada com os filtros selecionados.</p>
            </div>
          )}
        </PageSectionContent>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default BarbershopsPage;
