"use client";


import Header from "@/components/header";
import Footer from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Settings, Camera, Grid, Heart, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import BookingItem from "@/components/booking-item";
import { getUserBookings } from "@/data/bookings"; // We might need to fetch this client side or server side
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Mock fetching bookings for now since getUserBookings is server-side usually
  // If getUserBookings is a server action, we can call it here if it's exposed, 
  // currently we will just show a placeholder or try to fetch if possible.
  // Ideally, we should use a server component for the page and pass data, 
  // but "use client" is needed for tabs state easily without search params.
  // Let's stick to client content for the interactive parts.
  
  // Actually, to properly fetch data, we should probably make this a server component 
  // and pass data to a client component for the tabs. 
  // But for speed and "Facebook-style" interactivity, client component is fine for the tabs wrapper.
  
  useEffect(() => {
     // Fetch bookings mock or real implementation
     // We can't easily call server actions directly in useEffect without wrapping usually, 
     // but if they are 'use server' they act like API calls.
     // For now, we'll display a "Coming Soon" or empty state if no data.
  }, []);

  if (!session) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center p-5 text-center gap-4">
                <h2 className="text-xl font-bold">Você não está logado</h2>
                <p className="text-muted-foreground">Faça login para ver seu perfil.</p>
                <Link href="/login">
                    <Button>Fazer Login</Button>
                </Link>
            </div>
            <Footer />
        </div>
    )
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      
      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 md:h-72 w-full bg-gradient-to-r from-neon-purple/40 via-purple-900/40 to-background overflow-hidden">
            {/* We could add an actual image here if the user had one */}
            <div className="absolute inset-0 bg-[url('/banner.png')] bg-cover bg-center opacity-30"></div>
            
            <Button 
                variant="secondary" 
                size="sm" 
                className="absolute bottom-4 right-4 gap-2 opacity-80 hover:opacity-100"
            >
                <Camera className="size-4" />
                <span className="hidden sm:inline">Editar Capa</span>
            </Button>
        </div>

        {/* Profile Header Info */}
        <div className="px-5 md:px-10 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 gap-4 md:gap-6">
                {/* Avatar */}
                <div className="relative">
                    <Avatar className="size-32 md:size-40 border-4 border-background shadow-xl">
                        <AvatarImage src={user.image ?? ""} alt={user.name} />
                        <AvatarFallback className="text-4xl bg-muted">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button 
                        size="icon" 
                        variant="secondary" 
                        className="absolute bottom-1 right-1 rounded-full size-8 shadow-md"
                    >
                        <Camera className="size-4" />
                    </Button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left mb-2 md:mb-6 space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-sm">
                        <span>Cliente desde 2026</span> {/* Mock date */}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mb-4 md:mb-8">
                    <Button variant="outline" className="gap-2">
                        <Settings className="size-4" />
                        <span className="hidden sm:inline">Editar Perfil</span>
                    </Button>
                </div>
            </div>

            <div className="mt-6 border-t border-border"></div>
            
            {/* Stats/Bio Section (Mobile friendly summary) */}
            <div className="grid grid-cols-3 gap-4 py-4 text-center border-b border-border">
                <div className="flex flex-col">
                    <span className="font-bold text-lg">0</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Agendamentos</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg">0</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Avaliações</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg">0</span>
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
                 <TabButton 
                    active={activeTab === "photos"} 
                    onClick={() => setActiveTab("photos")} 
                    icon={<Grid className="size-4" />}
                    label="Fotos"
                />
                 <TabButton 
                    active={activeTab === "about"} 
                    onClick={() => setActiveTab("about")} 
                    icon={<Star className="size-4" />}
                    label="Sobre"
                />
            </div>
        </div>
      </div>

      <div className="bg-background min-h-[300px] mt-2">
        <div className="max-w-4xl mx-auto px-5 py-6">
            {activeTab === "bookings" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-bold mb-4">Meus Agendamentos Recentes</h3>
                     <div className="p-10 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center gap-3">
                        <Calendar className="size-10 text-muted-foreground" />
                        <p className="text-muted-foreground">Você ainda não tem agendamentos recentes por aqui.</p>
                        <Link href="/barbershops">
                            <Button variant="outline" className="mt-2">Agendar Agora</Button>
                        </Link>
                    </div>
                </div>
            )}

            {activeTab === "favorites" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-bold mb-4">Barbearias Favoritas</h3>
                    <div className="p-10 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center gap-3">
                        <Heart className="size-10 text-muted-foreground" />
                        <p className="text-muted-foreground">Você ainda não favoritou nenhuma barbearia.</p>
                    </div>
                </div>
            )}
             
            {activeTab === "about" && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Informações de Contato</h4>
                        <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">Email:</span> {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">Telefone:</span> Não cadastrado
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "photos" && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-bold mb-4">Fotos e Cortes</h3>
                     <div className="p-10 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center gap-3">
                        <Camera className="size-10 text-muted-foreground" />
                        <p className="text-muted-foreground">Nenhuma foto adicionada ainda.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <Footer />
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
