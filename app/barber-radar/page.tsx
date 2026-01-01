import BarberRadar from "@/components/barber-radar";
import Header from "@/components/header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BarberRadarPage = async () => {
  const barbershops = await prisma.barbershop.findMany({
    where: {
      NOT: {
        OR: [
          { latitude: null },
          { longitude: null }
        ]
      }
    }
  });

  const serializedBarbershops = barbershops.map((barbershop) => ({
    ...barbershop,
    latitude: Number(barbershop.latitude),
    longitude: Number(barbershop.longitude),
    dailyGoal: Number(barbershop.dailyGoal),
  }));

  return (
    <>
      <Header />
      <div className="pb-10">
        <BarberRadar barbershops={serializedBarbershops} />
      </div>
    </>
  );
};

export default BarberRadarPage;
