"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BarberBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  barbershop: any;
}

export function BarberBottomSheet({ isOpen, onClose, barbershop }: BarberBottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && barbershop && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1001] bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[1002] bg-[#1a1a1a] rounded-t-3xl border-t border-neon-purple/30 shadow-[0_-10px_40px_rgba(180,0,255,0.15)] pb-safe overflow-hidden"
          >
            {/* Handle bar */}
            <div className="w-full flex justify-center py-3" onClick={onClose}>
              <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
            </div>

            <div className="px-6 pb-20 pt-2 flex flex-col gap-4">
              {/* Image & Header */}
              <div className="flex gap-4 items-center">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-neon-purple/20 shrink-0">
                  <Image
                    src={barbershop.imageUrl || "/default-barber.png"}
                    alt={barbershop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white leading-tight mb-1">
                    {barbershop.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      {barbershop.evaluation || "4.9"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      1.2 km
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 -mt-8 -mr-2 bg-black/20 hover:bg-black/40 rounded-full text-gray-400" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

               {/* Info row */}
               <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
                 <MapPinIcon className="w-4 h-4 text-neon-purple shrink-0" />
                 <span className="truncate">{barbershop.address || "Endereço não informado"}</span>
               </div>
               
               <div className="flex items-center gap-2 text-sm text-green-400">
                 <Clock className="w-4 h-4 shrink-0" />
                 <span>Aberto agora • 09:00 - 20:00</span>
               </div>

              {/* Action */}
              <Link href={`/barbershops/${barbershop.id}`} className="mt-2 block w-full">
                <Button className="w-full h-14 bg-neon-purple hover:bg-[#8a19cc] text-white font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(180,0,255,0.3)] transition-all">
                  Agendar Agora
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MapPinIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
