"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Scissors } from "lucide-react";

const NavigationTabs = () => {
  const pathname = usePathname();
  
  const tabs = [
    { href: "/", label: "Barbearias", icon: Store },
    { href: "/barbers", label: "Barbeiros", icon: Scissors },
  ];

  return (
    <div className="flex items-center gap-2 px-5 py-3">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
              ${isActive 
                ? "bg-neon-purple text-white shadow-lg shadow-neon-purple/30" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }
            `}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavigationTabs;
