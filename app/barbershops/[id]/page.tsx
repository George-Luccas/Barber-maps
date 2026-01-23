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

const BarbershopPage = async ({ params }: PageProps<"/barbershops/[id]">) => {
  const { id } = await params;
  const barbershop = await getBarbershopById(id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const loyaltyCard = session?.user ? await getLoyaltyCard(id, session.user.id) : null;

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
        <BackButton />
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
          <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {barbershop.photos.map((photo, index) => (
              <div
                key={`photo-${index}`}
                className="relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-xl"
              >
                <Image
                  src={photo}
                  fill
                  className="object-cover"
                  alt={`Foto da barbearia ${index + 1}`}
                />
              </div>
            ))}
            {barbershop.Style.map((style) => (
              <div
                key={style.id}
                className="relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-xl"
              >
                <Image
                  src={style.imageUrl}
                  fill
                  className="object-cover"
                  alt={style.name}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="py-6">
          <div className="bg-border h-px w-full" />
        </div>

        {/* Loyalty Card */}
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
