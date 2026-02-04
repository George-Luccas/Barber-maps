import Image from "next/image";
import { notFound } from "next/navigation";
import { Smartphone } from "lucide-react";
// import { getBarbershopById } from "@/data/barbershops"; // OLD
import { comercioApi } from "@/services/comercio-api"; // NEW
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
// import { getLoyaltyCard } from "@/app/_actions/loyalty";
// import { LoyaltyCard } from "@/components/loyalty-card";
import { FavoriteButton } from "./_components/favorite-button";
import { prisma } from "@/lib/prisma";
import { BarbershopGallery } from "@/components/barbershop-gallery";
import { getBarbershopReviews, getBarbershopRating } from "@/app/_actions/review-actions";
import { RatingSummary } from "@/components/rating-stars";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const BarbershopPage = async ({ params }: PageProps) => {
  const { id } = await params;
  
  // --- MIGRAÇÃO API ---
  const barbershop = await comercioApi.getShop(id);
  const { services, barbers } = await comercioApi.getShopServices(id);

  if (!barbershop) {
    notFound();
  }

  // Combine services with shop info for the component
  const servicesWithShop = services.map(s => ({
    ...s,
    barbershopId: barbershop.id
  }));

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

  const reviews = await getBarbershopReviews(id);
  const rating = await getBarbershopRating(id);

  const userReview = session?.user 
    ? reviews.find(r => r.userId === session.user?.id) 
    : undefined;

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
          <div className="mt-2">
            <RatingSummary average={rating.average} count={rating.count} />
          </div>
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
        {((barbershop.photos && barbershop.photos.length > 0) || (barbershop.styles && barbershop.styles.length > 0)) && (
            <div className="flex flex-col gap-3 px-5">
            <PageSectionTitle>Galeria</PageSectionTitle>
            <BarbershopGallery 
                photos={[
                    ...(barbershop.photos || []).map((url) => ({ url, alt: `Foto da barbearia ${barbershop.name}` })),
                    ...(barbershop.styles || []).map((style) => ({ url: style.imageUrl, alt: style.name }))
                ]} 
            />
            </div>
        )}
        
        {/* Divider if Gallery existed */}
        {((barbershop.photos && barbershop.photos.length > 0) || (barbershop.styles && barbershop.styles.length > 0)) && (
             <div className="py-6">
                <div className="bg-border h-px w-full" />
             </div>
        )}


        {/* Serviços */}
        <div className="flex flex-col gap-3 px-5">
          <PageSectionTitle>Serviços</PageSectionTitle>
          <div className="flex flex-col gap-3">
            {servicesWithShop.map((service) => (
              <ServiceItem
                key={service.id}
                service={service as any} // Service interface match
                barbershop={{
                  id: barbershop.id,
                  name: barbershop.name,
                  isOpen: barbershop.isOpen,
                  barbers: barbers as any, // Barber interface match
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
        {barbershop.products && barbershop.products.length > 0 && (
             <Minibar products={barbershop.products as any} />
        )}

        {/* Avaliações */}
        <div className="py-6">
          <div className="bg-border h-px w-full" />
        </div>

        <div className="flex flex-col gap-4 px-5 pb-10">
          <div className="flex items-center justify-between">
            <PageSectionTitle>Avaliações</PageSectionTitle>
            {session?.user && (
              <ReviewForm 
                barbershopId={id} 
                userId={session.user.id} 
                initialData={userReview ? { rating: userReview.rating, comment: userReview.comment } : undefined}
              />
            )}
          </div>
          <ReviewList reviews={reviews as any} isAdmin={(session?.user as any)?.role === "ADMIN"} />
        </div>
       
        {/* Footer spacing */}
        <div className="pt-[60px]" />
      </div>
      <Footer />
    </div>
  );
};

export default BarbershopPage;
