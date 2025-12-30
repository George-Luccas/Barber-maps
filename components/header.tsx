
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";
import MenuSheet from "./menu-sheet";
import { ThemeToggle } from "./theme-toggle"

const Header = () => {
  return (
    <header className="bg-background flex items-center justify-between px-5 py-6 border-b border-transparent dark:border-neon-purple/20 dark:shadow-[0_1px_10px_rgba(180,0,255,0.05)] transition-all">
      <Link href="/">
        <Image src="/logo1.png" alt="BarberMaps" width={400} height={24} className="dark:drop-shadow-[0_0_8px_rgba(180,0,255,0.3)] transition-all" />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <MenuSheet />
      </div>
    </header>
  );
};

export default Header;
