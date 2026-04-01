import Image from "next/image";
import Link from "next/link";

interface BarberItemProps {
  barber: {
    id: string;
    name: string;
    imageUrl: string | null;
    barbershop: {
      id: string;
      name: string;
      address: string;
    };
  };
}

const BarberItem = ({ barber }: BarberItemProps) => {
  return (
    <Link
      href={`/barbers/${barber.id}`}
      className="flex flex-col items-center gap-3 p-4 group transition-all duration-300 hover:scale-105"
    >
      {/* Foto Redonda */}
      <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-neon-purple transition-all duration-300 shadow-lg shadow-neon-purple/30 group-hover:shadow-neon-purple/50">
        <Image
          src={barber.imageUrl || "/default-barber.png"}
          alt={barber.name}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Info */}
      <div className="text-center">
        <h3 className="text-white font-bold group-hover:text-neon-purple transition-colors flex items-center justify-center gap-1.5">
          <span className="text-lg">✂️</span>
          {barber.name}
        </h3>
        <p className="text-gray-400 text-xs mt-1">{barber.barbershop.name}</p>
      </div>
    </Link>
  );
};

export default BarberItem;


