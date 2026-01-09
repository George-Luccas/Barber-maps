
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";
import MenuSheet from "./menu-sheet";
import { ThemeToggle } from "./theme-toggle"
import NotificationList from "./notification-list";

const Header = () => {
  return (
    <header className="bg-transparent/50 backdrop-blur-sm flex items-center justify-between px-5 py-6 border-b border-white/10 dark:border-neon-purple/20 dark:shadow-[0_1px_10px_rgba(180,0,255,0.05)] transition-all z-20 relative">
      <Link href="/">
        <Image src="/logo1.png" alt="BarberMaps" width={400} height={24} className="dark:drop-shadow-[0_0_8px_rgba(180,0,255,0.3)] transition-all" />
      </Link>
      <div className="flex items-center gap-2">
        <NotificationList />
        <ThemeToggle />
        <MenuSheet />
      </div>
    </header>
  );
};

export default Header;
