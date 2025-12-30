import { useState } from 'react';
import { BarberShopList } from './components/BarberShopList';
import { BarberShopDetails } from './components/BarberShopDetails';
import { BarberShop } from './types/barber-shop';

export default function App() {
  const [selectedBarberShop, setSelectedBarberShop] = useState<BarberShop | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedBarberShop ? (
        <BarberShopDetails 
          barberShop={selectedBarberShop} 
          onBack={() => setSelectedBarberShop(null)}
        />
      ) : (
        <BarberShopList onSelectBarberShop={setSelectedBarberShop} />
      )}
    </div>
  );
}
