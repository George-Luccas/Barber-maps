"use client";

import { useEffect, useState } from "react";
import { getAdminBarbers, deleteBarber } from "../_actions/dashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { Search, ArrowLeft, Trash2, User, Globe, Scissors } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface BarberData {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    imageUrl?: string | null;
    barbershopName: string;
    bookingsCount: number;
    isAutonomous?: boolean;
    accountType?: string;
    source: "local" | "comercio";
}

export default function AdminBarbersPage() {
    const [barbers, setBarbers] = useState<BarberData[]>([]);
    const [filtered, setFiltered] = useState<BarberData[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!search) {
            setFiltered(barbers);
        } else {
            setFiltered(barbers.filter(b => 
                b.name.toLowerCase().includes(search.toLowerCase()) ||
                b.barbershopName.toLowerCase().includes(search.toLowerCase())
            ));
        }
    }, [search, barbers]);

    const loadData = async () => {
        try {
            const data = await getAdminBarbers();
            setBarbers(data);
            setFiltered(data);
        } catch (error) {
            toast.error("Erro ao carregar barbeiros");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (barber: BarberData) => {
        if (!confirm(`Tem certeza que deseja excluir o barbeiro "${barber.name}"? Essa ação não pode ser desfeita.`)) {
            return;
        }
        try {
            await deleteBarber(barber.id, barber.source);
            toast.success("Barbeiro excluído com sucesso");
            loadData();
        } catch (error) {
            toast.error("Erro ao excluir barbeiro");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/admin">
                    <ArrowLeft className="size-4 mr-2" />
                    Voltar
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Barbeiros</h1>
                    <p className="text-muted-foreground">Gerencie todos os barbeiros cadastrados.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar barbeiro..." 
                        className="pl-8" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="p-10 text-center">Carregando...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center border rounded-lg">Nenhum barbeiro encontrado.</div>
                ) : (
                    filtered.map((barber) => (
                        <Card key={`${barber.source}-${barber.id}`} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center gap-4 p-4">
                                <div className="relative h-16 w-16 min-w-16 rounded-full overflow-hidden bg-muted">
                                    <Image 
                                        src={barber.imageUrl || "/default-barber.png"} 
                                        alt={barber.name} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                                        <h3 className="font-bold text-lg">{barber.name}</h3>
                                        <Badge 
                                            variant="outline" 
                                            className={barber.source === "comercio" ? "border-blue-500 text-blue-500" : "border-green-500 text-green-500"}
                                        >
                                            {barber.source === "comercio" ? (
                                                <><Globe className="size-3 mr-1" /> Comercio</>
                                            ) : (
                                                <><User className="size-3 mr-1" /> Local</>
                                            )}
                                        </Badge>
                                        {barber.isAutonomous && (
                                            <Badge variant="secondary">
                                                <Scissors className="size-3 mr-1" /> Autônomo
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{barber.barbershopName}</p>
                                    {barber.email && <p className="text-xs text-muted-foreground">{barber.email}</p>}
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-xs text-muted-foreground">
                                        {barber.bookingsCount} agendamentos
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleDelete(barber)}
                                    >
                                        <Trash2 className="size-4 mr-2" />
                                        Excluir
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
