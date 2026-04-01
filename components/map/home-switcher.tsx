"use client";

import { Map, LayoutList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function HomeSwitcher() {
  const pathname = usePathname();
  const isMap = pathname === "/";
  const isFeed = pathname === "/inicio";

  if (!isMap && !isFeed) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1001] pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-full">
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-1 rounded-full border border-neon-purple/30 flex items-center relative">
        <Link 
          href="/" 
          className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors ${isMap ? "text-white" : "text-gray-400 hover:text-white"}`}
        >
          <Map className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wide">Mapa</span>
          {isMap && (
            <motion.div 
              layoutId="switcher-active"
              className="absolute inset-0 bg-neon-purple/40 border border-neon-purple rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </Link>
        <Link 
          href="/inicio" 
          className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors ${isFeed ? "text-white" : "text-gray-400 hover:text-white"}`}
        >
          <LayoutList className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wide">Início</span>
          {isFeed && (
            <motion.div 
              layoutId="switcher-active"
              className="absolute inset-0 bg-neon-purple/40 border border-neon-purple rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </Link>
      </div>
    </div>
  );
}
