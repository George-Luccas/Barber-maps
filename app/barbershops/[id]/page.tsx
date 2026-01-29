import Image from "next/image";
import { notFound } from "next/navigation";
import { Smartphone } from "lucide-react";
import { getBarbershopById } from "@/data/barbershops";
import { PageSectionTitle } from "@/components/ui/page";
import Footer from "@/components/footer";
import ServiceItem from "@/components/service-item";
import BackButton from "./_components/back-button";
import CopyButton from "./_components/copy-button";
import BarbershopMap from "@/components/barbershop-map";
import { Badge } from "@/components/ui/badge";
import Minibar from "./_components/minibar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getLoyaltyCard } from "@/app/_actions/loyalty";
import { LoyaltyCard } from "@/components/loyalty-card";
import { FavoriteButton } from "./_components/favorite-button";
import { prisma } from "@/lib/prisma";
import { BarbershopGallery } from "@/components/barbershop-gallery";


const BarbershopPage = async ({ params }: PageProps<"/barbershops/[id]">) => {
  // Force rebuild to sync Prisma Client with new DB schema
  const { id } = await params;
  const barbershop = await getBarbershopById(id);
  /* EMERGENCY DISABLE: Auth causing potential 500 or Loyalty issues. Restoring later.
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  let loyaltyCard = null;
  try {
      loyaltyCard = session?.user ? await getLoyaltyCard(id, session.user.id) : null;
  } catch (error) {
      console.error("Failed to fetch loyalty card:", error);
  }
  */
  /* EMERGENCY DISABLE: Auth causing potential 500 or Loyalty issues. Restoring later.
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  let loyaltyCard = null;
  try {
      loyaltyCard = session?.user ? await getLoyaltyCard(id, session.user.id) : null;
  } catch (error) {
      console.error("Failed to fetch loyalty card:", error);
  }
  */
  // Re-enable session just for isFavorited check (safe check)
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const loyaltyCard = null;

  let isFavorited = false;
  if (session?.user) {
      const userFavorite = await prisma.userFavorite.findUnique({
          where: {
              userId_barbershopId: {
                  userId: session.user.id,
                  barbershopId: id
              }
          }
      });
      isFavorited = !!userFavorite;
  }

  if (!barbershop) {
    notFound();
  }

  return (
    <div>
      {/* Banner Header */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barbershop.imageUrl ?? ""}
          alt={barbershop.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 z-50">
           <BackButton />
        </div>
        <div className="absolute top-4 right-4 z-50">
            <FavoriteButton barbershopId={barbershop.id} isFavorited={isFavorited} />
        </div>
      </div>

      {/* Container */}
      <div className="bg-background relative z-10 -mt-9 rounded-t-3xl">
        {/* Barbershop Info */}
        <div className="flex flex-col gap-1 px-5 pt-6">
          <div className="flex items-center gap-1.5">
            <div className="relative size-[30px] shrink-0">
              <Image
                src={barbershop.imageUrl ?? ""}
                alt={barbershop.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold">{barbershop.name}</h1>
            <Badge 
              className="ml-2" 
              variant={barbershop.isOpen ? "success" : "destructive"}
            >
              {barbershop.isOpen ? "Aberto" : "Fechado"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{barbershop.address}</p>
        </div>

        {/* Divider */}
        <div className="py-6">
          <div className="bg-border h-px w-full" />
        </div>

        {/* Sobre Nós */}
        <div className="flex flex-col gap-3 px-5">
          <PageSectionTitle>Sobre Nós</PageSectionTitle>
          <p className="text-sm text-justify">{barbershop.aboutUs || barbershop.description}</p>
        </div>

        {/* Divider */}
        <div className="py-6">
          <div className="bg-border h-px w-full" />
        </div>

        {/* Galeria */}
        <div className="flex flex-col gap-3 px-5">
          <PageSectionTitle>Galeria</PageSectionTitle>
          <BarbershopGallery 
            photos={[
                ...barbershop.photos.map((url) => ({ url, alt: `Foto da barbearia ${barbershop.name}` })),
                ...barbershop.Style.map((style) => ({ url: style.imageUrl, alt: style.name }))
            ]} 
          />
        </div>

        {/* Divider */}
        <div className="py-6">
          <div className="bg-border h-px w-full" />
        </div>

        {/* Loyalty Card - DISABLED FOR DEBUG
        {session?.user && (
            <div className="px-5 pb-6">
                <LoyaltyCard 
                    currentPoints={loyaltyCard?.currentPoints || 0}
                    freeCuts={loyaltyCard?.freeCuts || 0}
                    tier={loyaltyCard?.tier || "BRONZE"}
                    totalLifetimePoints={loyaltyCard?.totalLifetimePoints || 0}
                />
            </div>
        )}
        */}

        {/* Serviços */}
        <div className="flex flex-col gap-3 px-5">
          <PageSectionTitle>Serviços</PageSectionTitle>
          <div className="flex flex-col gap-3">
            {barbershop.services.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                barbershop={{
                  id: barbershop.id,
                  name: barbershop.name,
                  isOpen: barbershop.isOpen,
                  barbers: barbershop.Barber,
                }}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="py-6">
          <div className="bg-border h-px w-full" />
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-3 px-5">
          <PageSectionTitle>Contato</PageSectionTitle>
          {barbershop.phones.map((phone, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="size-6" />
                <p className="text-sm">{phone}</p>
              </div>
              <CopyButton text={phone} />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="py-6">
          <div className="bg-border h-px w-full" />
        </div>

        {/* Map */}
        <BarbershopMap
          barbershop={{
            name: barbershop.name,
            address: barbershop.address,
            latitude: barbershop.latitude ? Number(barbershop.latitude) : null,
            longitude: barbershop.longitude ? Number(barbershop.longitude) : null,
          }}
        />

        {/* Minibar Feature */}
        <Minibar products={barbershop.BarbershopProduct} />

        {/* Footer spacing */}
        <div className="pt-[60px]" />
      </div>
      <Footer />
    </div>
  );
};

export default BarbershopPage;
