import Header from "@/components/header";
import Footer from "@/components/footer";
import BarbershopItem from "@/components/barbershop-item";
import { getBarbershops, getBarbershopsByServiceName } from "@/data/barbershops";
import {
  PageContainer,
  PageSectionContent,
  PageSectionTitle,
} from "@/components/ui/page";

import { LocationFilter } from "@/components/location-filter";

interface BarbershopsPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    state?: string;
  }>;
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const { search, city, state } = await searchParams;
  
  // We need to fetch data based on filters. 
  // If there is a search term, we generally use getBarbershopsByServiceName, 
  // but we want to filter that result by city/state if provided.
  // Alternatively, we use getBarbershops and filter by everything.
  // I will update getBarbershops in data/barbershops.ts to handle 'search' (name) as well, 
  // so we can use a single function.
  
  // For now, I'll assume getBarbershops works with city/state.
  // I also need to handle the search term manually or update the function.
  // Let's rely on a unified getBarbershops function.
  // I need to update data/barbershops.ts first.
  
  const barbershops = await getBarbershops({ 
      city, 
      state, 
      search // Pass search param if I update the function to accept it
  });
  
  return (
    <div>
      <Header />
      <PageContainer>
        <PageSectionContent>
          <PageSectionTitle>
            Resultados {search ? `para "${search}"` : "da busca"}
          </PageSectionTitle>
          
          <LocationFilter />

          {/* This will be replaced after I refetch the data properly */}
        </PageSectionContent>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default BarbershopsPage;
