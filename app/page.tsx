import { getBarbershops } from "@/data/barbershops";
import { BottomNav } from "@/components/map/bottom-nav";
import { MapSearchBar } from "@/components/map/map-search-bar";
import { MapWrapper } from "@/components/map/map-wrapper";

export const dynamicConfig = "force-dynamic";

export default async function FullScreenMapPage() {
  const barbershops = await getBarbershops();

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#121212]">
      {/* Top Search Bar Overlay */}
      <MapSearchBar />

      {/* Main Map */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapWrapper barbershops={barbershops as any[]} />
      </div>

      {/* Bottom Navigation Overlay */}
      <BottomNav />
    </div>
  );
}

