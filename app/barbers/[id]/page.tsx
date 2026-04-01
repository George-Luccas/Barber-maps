
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBarberReviews, getBarberRating } from "@/app/_actions/review-actions";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { PageSectionTitle } from "@/components/ui/page";

// ... (existing imports)

import Header from "@/components/header";
import Footer from "@/components/footer";
import { getBarberById } from "@/data/barbers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/image-gallery";
import { Phone, Mail, MapPin, Store, ArrowLeft, Scissors, Star, Calendar, ImageIcon, MessageCircle, Instagram } from "lucide-react";

export const dynamic = "force-dynamic";

interface BarberPageProps {
  params: Promise<{ id: string }>;
}

export default async function BarberPage({ params }: BarberPageProps) {
  const { id } = await params;
  const barber = await getBarberById(id);

  if (!barber) {
    notFound();
  }

  // Session for reviews
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fetch reviews
  const reviews = await getBarberReviews(id);
  const rating = await getBarberRating(id);

  const userReview = session?.user 
    ? reviews.find((r: any) => r.userId === session.user?.id) 
    : undefined;

  // Imagens de galeria placeholder
  const galleryImages = [
    // ... (existing)
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
    "https://images.unsplash.com/photo-1634480301781-cec79bd8cf95?w=400",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 w-full">
         {/* ... existing cover image code ... */}
        <Image
          src={barber.barbershop.imageUrl || "/default-barber.png"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Back Button */}
        <Link href="/barbers" className="absolute top-4 left-4 z-20">
          <Button variant="ghost" size="icon" className="bg-background/50 backdrop-blur-sm hover:bg-background/80">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
      </div>

      {/* Profile Section */}
      <div className="relative px-5 pb-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Profile Photo & Name */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl mb-4">
              <Image
                src={barber.imageUrl || "/default-barber.png"}
                alt={barber.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/20 text-neon-purple text-sm font-medium mb-2">
              <Scissors className="size-4" /> Barbeiro Profissional
            </div>
            
            <h1 className="text-3xl font-bold text-center">{barber.name}</h1>
            
            <Link href={`/barbershops/${barber.barbershop.id}`} className="text-muted-foreground hover:text-neon-purple transition-colors mt-1">
              <span className="flex items-center gap-1">
                <Store className="size-4" /> {barber.barbershop.name}
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-2xl font-bold text-neon-purple">{barber._count?.Booking || 0}</div>
              <div className="text-xs text-muted-foreground">Cortes</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                <Star className="size-5 fill-yellow-400" /> {rating.average} ({rating.count})
              </div>
              <div className="text-xs text-muted-foreground">Avaliação</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-2xl font-bold text-green-400">2+</div>
              <div className="text-xs text-muted-foreground">Anos exp.</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-neon-purple/20">
                <Scissors className="size-4 text-neon-purple" />
              </span>
              Sobre
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Barbeiro profissional especializado em cortes modernos, degradês e barbas. 
              Comprometido em oferecer a melhor experiência para cada cliente, 
              com atenção aos detalhes e técnicas atualizadas.
            </p>
          </div>

          {/* Gallery */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-neon-purple/20">
                <ImageIcon className="size-4 text-neon-purple" />
              </span>
              Galeria de Trabalhos
            </h2>
            <ImageGallery images={galleryImages} />
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-neon-purple/20">
                <Phone className="size-4 text-neon-purple" />
              </span>
              Contato
            </h2>
            
            {barber.phone && (
              <a href={`tel:${barber.phone}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:border-green-500/50 transition-colors group">
                  <Phone className="size-5 text-green-500" />
                  <span className="group-hover:text-green-500 transition-colors">{barber.phone}</span>
                </div>
              </a>
            )}

            {barber.email && (
              <a href={`mailto:${barber.email}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:border-blue-500/50 transition-colors group">
                  <Mail className="size-5 text-blue-500" />
                  <span className="group-hover:text-blue-500 transition-colors">{barber.email}</span>
                </div>
              </a>
            )}

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <MapPin className="size-5 text-orange-500" />
              <span>{barber.barbershop.address}</span>
            </div>
          </div>

           {/* Avaliações */}
            <div className="py-6">
              <div className="bg-border h-px w-full" />
            </div>

            <div className="flex flex-col gap-4 pb-10">
              <div className="flex items-center justify-between">
                <PageSectionTitle>Avaliações</PageSectionTitle>
                {session?.user && (
                    <ReviewForm 
                        barbershopId={barber.barbershop.id}
                        barberId={barber.id}
                        userId={session.user.id}
                        userEmail={session.user.email}
                        initialData={userReview ? { rating: userReview.rating, comment: userReview.comment } : undefined}
                    />
                )}
              </div>
              <ReviewList reviews={reviews as any} isAdmin={(session?.user as any)?.role === "ADMIN"} />
            </div>

          {/* CTA - WhatsApp or Schedule Fallback */}
          {barber.phone ? (
              <Link 
                href={`https://wa.me/${barber.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${barber.name}, gostaria de saber mais sobre seus serviços.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 gap-2 shadow-lg hover:shadow-green-500/20 transition-all" size="lg">
                  <MessageCircle className="size-6" />
                  Falar comigo
                </Button>
              </Link>
          ) : (
              <Link href={`/barbershops/${barber.barbershop.id}`} className="block">
                <Button className="w-full h-14 text-lg bg-neon-purple hover:bg-neon-purple/90 gap-2" size="lg">
                  <Calendar className="size-5" />
                  Agendar com {barber.name.split(' ')[0]}
                </Button>
              </Link>
          )}
          
          {/* Instagram Button */}
          {barber.instagram && (
            <Link 
              href={`https://instagram.com/${barber.instagram.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4"
            >
              <Button className="w-full h-14 text-lg bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 gap-2 shadow-lg transition-all text-white border-0" size="lg">
                <Instagram className="size-6 text-white" />
                Ver no Instagram
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

