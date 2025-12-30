export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BarberShop {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingHours: string;
  images: string[];
  services: Service[];
  reviews: Review[];
  location: {
    lat: number;
    lng: number;
  };
}
