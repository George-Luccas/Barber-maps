import { useState } from 'react';
import { ArrowLeft, MapPin, Star, Clock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BarberShop } from '../types/barber-shop';

interface BarberShopDetailsProps {
  barberShop: BarberShop;
  onBack: () => void;
}

export function BarberShopDetails({ barberShop, onBack }: BarberShopDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === barberShop.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? barberShop.images.length - 1 : prev - 1
    );
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${barberShop.location.lat},${barberShop.location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="flex-1 truncate">{barberShop.name}</h2>
        {barberShop.isOpen && (
          <Badge className="bg-[#D4AF37] text-[#353535] border-0">Aberto</Badge>
        )}
      </div>

      {/* Image Carousel */}
      <div className="relative aspect-[16/10] bg-gray-100">
        <ImageWithFallback
          src={barberShop.images[currentImageIndex]}
          alt={`${barberShop.name} - Imagem ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {barberShop.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {barberShop.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
            <span className="mr-1">{barberShop.rating}</span>
            <span className="text-gray-500">({barberShop.reviewCount} avaliações)</span>
          </div>

          <div className="flex items-start gap-2 text-gray-600 mb-2">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{barberShop.address}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span>{barberShop.openingHours}</span>
          </div>
        </div>

        <Separator />

        {/* Services */}
        <div>
          <h3 className="mb-4">Serviços e Valores</h3>
          <div className="space-y-2">
            {barberShop.services.map((service) => (
              <Card key={service.id} className="p-4 border shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p>{service.name}</p>
                    <p className="text-gray-500">{service.duration} minutos</p>
                  </div>
                  <div className="text-[#D4AF37]">
                    R$ {service.price.toFixed(2)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location Map */}
        <div>
          <h3 className="mb-4">Localização</h3>
          <Card className="overflow-hidden border shadow-sm">
            <div className="relative aspect-video bg-gray-100">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${barberShop.location.lat},${barberShop.location.lng}&zoom=15`}
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={openInGoogleMaps}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir no Google Maps
              </Button>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Reviews */}
        <div>
          <h3 className="mb-4">Avaliações</h3>
          <div className="space-y-4">
            {barberShop.reviews.map((review) => (
              <Card key={review.id} className="p-4 border shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <p>{review.userName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <p className="text-gray-400">
                  {new Date(review.date).toLocaleDateString('pt-BR')}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full py-6 bg-[#D4AF37] hover:bg-[#C5A028] text-[#353535]">
            Agendar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}