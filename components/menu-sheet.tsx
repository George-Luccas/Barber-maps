"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MenuIcon, Home, CalendarDays, LogOut, LogIn, MapPin, MessageSquare, Crown, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Removed redundant constant

const categories = [
  { label: "Cabelo", search: "cabelo" },
  { label: "Barba", search: "barba" },
  { label: "Acabamento", search: "acabamento" },
  { label: "Sobrancelha", search: "sobrancelha" },
  { label: "Massagem", search: "massagem" },
  { label: "Hidratacao", search: "hidratacao" },
];

const MenuSheet = () => {
  const { data: session } = authClient.useSession();
// Login functionality removed as requested

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
  };
  const isLoggedIn = !!session?.user;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="size-11">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-border border-b px-5 py-6 text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Menu de navegação da barbearia</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6 h-full overflow-y-auto pb-20">
          <div className="flex items-center justify-between px-5">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name}
                  />
                  <AvatarFallback>
                    {session.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{session.user.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {session.user.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">Olá. Faça seu login!</p>
                    <p className="text-muted-foreground text-[10px]">BarberMaps</p>
                  </div>
                </div>
                <SheetClose asChild>
                  <Link href="/login">
                    <Button size="sm" className="gap-2 rounded-full bg-neon-purple hover:bg-neon-purple/80 text-white font-bold transition-all shadow-[0_0_15px_rgba(180,0,255,0.3)]">
                      Login
                      <LogIn className="size-4" />
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <SheetClose asChild>
              <Link
                href="/"
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium"
              >
                <Home className="size-4" />
                Início
              </Link>
            </SheetClose>
            {isLoggedIn && (
              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium"
                >
                  <User className="size-4" />
                  Meu Perfil
                </Link>
              </SheetClose>
            )}
            <SheetClose asChild>
              <Link
                href="/bookings"
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium"
              >
                <CalendarDays className="size-4" />
                Agendamentos
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium"
              >
                <Crown className="size-4 text-primary" />
                Planos e Assinatura
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/whatsapp-discount"
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neon-purple"
              >
                <MessageSquare className="size-4" />
                Receba Promoções
              </Link>
            </SheetClose>

            {/* Painel Administrativo - Apenas Admins */}
            {(session?.user as any)?.role === "ADMIN" && (
                <SheetClose asChild>
                <Link
                    href="/admin"
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500"
                >
                    <Crown className="size-4" />
                    Painel Administrativo
                </Link>
                </SheetClose>
            )}
          </div>

          <div className="border-border border-b" />

          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <SheetClose key={category.search} asChild>
                <Link
                  href={`/barbershops?search=${category.search}`}
                  className="px-5 py-3 text-sm font-medium"
                >
                  {category.label}
                </Link>
              </SheetClose>
            ))}
          </div>


          <div className="border-border border-b" />

          <Link
            href="/barber-radar"
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium"
          >
            <MapPin className="size-4" />
            Barber Radar
          </Link>

          {isLoggedIn && (
            <Button
              variant="ghost"
              className="justify-left w-fit text-left"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Sair da conta
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuSheet;
