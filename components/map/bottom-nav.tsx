"use client";

import { Map, Home, CalendarDays, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Mapa", href: "/", icon: Map },
  { label: "Início", href: "/inicio", icon: Home },
  { label: "Agenda", href: "/bookings", icon: CalendarDays },
  { label: "Perfil", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-[1000] bg-[#121212]/90 backdrop-blur-lg border-t border-neon-purple/20 pb-safe">
      <ul className="flex justify-around items-center h-16 pointer-events-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.label} className="flex-1 flex justify-center">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${
                  isActive ? "text-neon-purple drop-shadow-[0_0_8px_rgba(180,0,255,0.6)]" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
