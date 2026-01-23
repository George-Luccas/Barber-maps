import Image from "next/image";
import Link from "next/link";

interface Barbershop {
  id: string;
  name: string;
  address: string;
  imageUrl: string | null;
}

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Link
      href={`/barbershops/${barbershop.id}`}
      className="block relative w-full h-[180px] rounded-xl group transition-all duration-300 hover:scale-[1.02] border border-transparent dark:hover:border-neon-purple dark:hover:shadow-neon-purple/40 overflow-hidden"
    >
      <div className="absolute top-0 left-0 z-10 h-full w-full rounded-lg bg-linear-to-t from-black to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
      <Image
        src={barbershop.imageUrl || "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"}
        alt={barbershop.name}
        fill
        className="rounded-xl object-cover"
      />
      <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
        <h3 className="text-white text-lg font-bold group-hover:text-neon-purple transition-colors">{barbershop.name}</h3>
        <p className="text-gray-300 text-xs">{barbershop.address}</p>
      </div>
    </Link>
  );
};

export default BarbershopItem;
