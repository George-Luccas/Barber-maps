"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Settings, Camera, Grid, Heart, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { EditProfileDialog } from "./edit-profile-dialog";
import BookingItem from "@/components/booking-item"; 
import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";


interface ProfileContentProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    coverImage?: string | null;
    phone?: string | null;
    createdAt: Date;
    imagePosition?: string;
    coverImagePosition?: string;
  };
  bookings: {
    confirmed: any[];
    finished: any[];
  };
  favorites: any[];
  stats: {
    bookingsCount: number;
    favoritesCount: number;
    reviewsCount: number;
  };
}

export function ProfileContent({ user, bookings, favorites, stats }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("bookings");
  const router = useRouter();

  const handleLogout = async () => {
      await authClient.signOut({
          fetchOptions: {
              onSuccess: () => {
                  toast.success("Saiu com sucesso!");
                  router.push("/login");
                  router.refresh();
              },
          },
      });
  };


  return (
    <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-60 md:h-80 w-full bg-gradient-to-r from-neon-purple/40 via-purple-900/40 to-background overflow-hidden relative group">
            {user.coverImage ? (
                <div 
                  className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-105" 
                  style={{ 
                    backgroundImage: `url('${user.coverImage}')`,
                    backgroundPosition: user.coverImagePosition || "center"
                  }}
                ></div>
            ) : (
                <div className="absolute inset-0 bg-[url('/banner.png')] bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-105"></div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
            
            {/* 
            <Button 
                variant="secondary" 
                size="sm" 
                className="absolute bottom-4 right-4 gap-2 opacity-80 hover:opacity-100 transition-opacity"
            >
                <Camera className="size-4" />
                <span className="hidden sm:inline">Editar Capa</span>
            </Button>
             */}
        </div>

        {/* Profile Header Info */}
        <div className="px-5 md:px-10 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 gap-4 md:gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <Avatar className="size-32 md:size-40 border-4 border-background shadow-xl ring-2 ring-transparent group-hover:ring-neon-purple/50 transition-all duration-300">
                        <AvatarImage 
                          src={user.image ?? ""} 
                          alt={user.name} 
                          className="object-cover"
                          style={{ objectPosition: user.imagePosition || "center" }} 
                        />
                        <AvatarFallback className="text-4xl bg-muted">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {/* Only show photo edit via the main Edit Profile dialog for now to keep it simple, or add a dedicated button here that opens the dialog */}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left mb-2 md:mb-6 space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-sm">
                        <span>Cliente desde {user.createdAt.getFullYear()}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mb-4 md:mb-8">
                   <EditProfileDialog user={user} />
                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                        <LogOut className="size-5" />
                   </Button>
                </div>

            </div>

            <div className="mt-6 border-t border-border"></div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 py-4 text-center border-b border-border">
                <div className="flex flex-col group cursor-default">
                    <span className="font-bold text-lg group-hover:text-neon-purple transition-colors">{stats.bookingsCount}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Agendamentos</span>
                </div>
                <div className="flex flex-col group cursor-default">
                    <span className="font-bold text-lg group-hover:text-neon-purple transition-colors">{stats.reviewsCount}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Avaliações</span>
                </div>
                <div className="flex flex-col group cursor-default">
                    <span className="font-bold text-lg group-hover:text-neon-purple transition-colors">{stats.favoritesCount}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Favoritos</span>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-2 scrollbar-none">
                <TabButton 
                    active={activeTab === "bookings"} 
                    onClick={() => setActiveTab("bookings")} 
                    icon={<Calendar className="size-4" />}
                    label="Agendamentos"
                />
                 <TabButton 
                    active={activeTab === "favorites"} 
                    onClick={() => setActiveTab("favorites")} 
                    icon={<Heart className="size-4" />}
                    label="Favoritos"
                />
                 {/* Removed Photos tab for now as it's not core */}
                 <TabButton 
                    active={activeTab === "about"} 
                    onClick={() => setActiveTab("about")} 
                    icon={<Settings className="size-4" />}
                    label="Dados"
                />
            </div>
        </div>

      <div className="bg-background min-h-[300px] mt-2">
        <div className=" px-5 py-6">
            {activeTab === "bookings" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {bookings.confirmed.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                                Agendados
                            </h3>
                            <div className="grid gap-4">
                                {bookings.confirmed.map((booking) => (
                                   <BookingItem key={booking.id} booking={booking} />
                                ))}
                            </div>

                        </div>
                    )}

                    {bookings.finished.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-muted-foreground">Histórico</h3>
                            <div className="grid gap-4 opacity-80 hover:opacity-100 transition-opacity">
                                {bookings.finished.map((booking) => (
                                     <BookingItem key={booking.id} booking={booking} />
                                ))}
                            </div>

                        </div>
                    )}

                    {bookings.confirmed.length === 0 && bookings.finished.length === 0 && (
                        <div className="p-10 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center gap-3">
                            <Calendar className="size-10 text-muted-foreground" />
                            <p className="text-muted-foreground">Você ainda não tem agendamentos.</p>
                            <Link href="/barbershops">
                                <Button variant="outline" className="mt-2">Agendar Agora</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "favorites" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-bold mb-4">Barbearias Favoritas</h3>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {favorites.map((barbershop) => (
                                <Link href={`/barbershops/${barbershop.id}`} key={barbershop.id}>
                                    <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors flex gap-4">
                                        <Avatar className="h-16 w-16 rounded-md">
                                             <AvatarImage src={barbershop.imageUrl} className="object-cover" />
                                             <AvatarFallback>{barbershop.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold">{barbershop.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate">{barbershop.address}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center gap-3">
                            <Heart className="size-10 text-muted-foreground" />
                            <p className="text-muted-foreground">Você ainda não favoritou nenhuma barbearia.</p>
                            <Link href="/">
                                <Button variant="ghost" size="sm">Explorar Barbearias</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
             
            {activeTab === "about" && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4 max-w-xl">
                        <h4 className="font-semibold text-foreground border-b pb-2">Informações Pessoais</h4>
                        <div className="grid gap-4 text-sm">
                            <div className="grid grid-cols-3 items-center">
                                <span className="font-medium text-muted-foreground">Nome</span>
                                <span className="col-span-2">{user.name}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center">
                                <span className="font-medium text-muted-foreground">Email</span>
                                <span className="col-span-2 truncate">{user.email}</span>
                            </div>
                            <div className="grid grid-cols-3 items-center">
                                <span className="font-medium text-muted-foreground">Telefone</span>
                                <span className="col-span-2">{user.phone || "—"}</span>
                            </div>
                             <div className="grid grid-cols-3 items-center">
                                <span className="font-medium text-muted-foreground">Membro desde</span>
                                <span className="col-span-2">{format(user.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${active 
                    ? "bg-neon-purple/10 text-neon-purple ring-1 ring-neon-purple/50" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"}
            `}
        >
            {icon}
            {label}
        </button>
    )
}

// BookingCard removed in favor of BookingItem

