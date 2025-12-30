import { MapPin, Star, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BarberShop } from '../types/barber-shop';

interface BarberShopCardProps {
  barberShop: BarberShop;
  onClick: () => void;
}

export function BarberShopCard({ barberShop, onClick }: BarberShopCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-0 shadow-md"
      onClick={onClick}
    >
      <div className="flex gap-4 p-3">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <ImageWithFallback
            src={barberShop.images[0]}
            alt={barberShop.name}
            className="w-full h-full object-cover"
          />
          {barberShop.isOpen && (
            <Badge className="absolute top-2 left-2 bg-[#D4AF37] text-[#353535] border-0 px-2 py-0">
              Aberto
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="truncate mb-1">{barberShop.name}</h3>
            
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="mr-1">{barberShop.rating}</span>
              <span className="text-gray-500">({barberShop.reviewCount})</span>
            </div>

            <div className="flex items-start gap-1 text-gray-600 mb-1">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="truncate">{barberShop.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">{barberShop.distance} km</span>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>30-60min</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}