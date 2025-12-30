import { useState, useMemo } from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarberShopCard } from './BarberShopCard';
import { BarberShop } from '../types/barber-shop';
import { mockBarberShops } from '../data/mock-data';

interface BarberShopListProps {
  onSelectBarberShop: (barberShop: BarberShop) => void;
}

type FilterType = 'all' | 'open' | 'top-rated' | 'nearby';

export function BarberShopList({ onSelectBarberShop }: BarberShopListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredBarberShops = useMemo(() => {
    let filtered = [...mockBarberShops];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'open':
        filtered = filtered.filter(shop => shop.isOpen);
        break;
      case 'top-rated':
        filtered = filtered.filter(shop => shop.rating >= 4.7);
        break;
      case 'nearby':
        filtered = filtered.filter(shop => shop.distance <= 2);
        break;
    }

    return filtered;
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-[#353535] text-white px-4 py-6 pb-8">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/logo1.png" alt="Barber Maps" className="h-32 w-auto" />
          </div>
          
          <p className="opacity-90 text-center">Descubra as melhores barbearias perto de você</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto px-4 -mt-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome ou serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-6 bg-white shadow-lg border-0 rounded-2xl"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">Filtros</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Badge
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap"
            onClick={() => setActiveFilter('all')}
          >
            Todas
          </Badge>
          <Badge
            variant={activeFilter === 'nearby' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap"
            onClick={() => setActiveFilter('nearby')}
          >
            Próximas
          </Badge>
          <Badge
            variant={activeFilter === 'top-rated' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap"
            onClick={() => setActiveFilter('top-rated')}
          >
            Mais Bem Avaliadas
          </Badge>
          <Badge
            variant={activeFilter === 'open' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 whitespace-nowrap"
            onClick={() => setActiveFilter('open')}
          >
            Aberto Agora
          </Badge>
        </div>
      </div>

      {/* Barber Shop List */}
      <div className="max-w-md mx-auto px-4 pb-6">
        {filteredBarberShops.length > 0 ? (
          <div className="space-y-4">
            {filteredBarberShops.map((barberShop) => (
              <BarberShopCard
                key={barberShop.id}
                barberShop={barberShop}
                onClick={() => onSelectBarberShop(barberShop)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma barbearia encontrada</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-2"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}