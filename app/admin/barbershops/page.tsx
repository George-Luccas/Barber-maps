"use client";

import { useEffect, useState } from "react";
import { getAdminBarbershops, toggleBarbershopSuspension, deleteBarbershop } from "../_actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { Search, ArrowLeft, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminBarbershopsPage() {
    const [barbershops, setBarbershops] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!search) {
            setFiltered(barbershops);
        } else {
            setFiltered(barbershops.filter(b => b.name.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search, barbershops]);

    const loadData = async () => {
        try {
            const data = await getAdminBarbershops();
            setBarbershops(data);
            setFiltered(data);
        } catch (error) {
            toast.error("Erro ao carregar barbearias");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSuspension = async (id: string, currentStatus: boolean) => {
        try {
            await toggleBarbershopSuspension(id, !currentStatus);
            toast.success(`Barbearia ${!currentStatus ? 'suspensa' : 'ativada'} com sucesso`);
            loadData(); // Reload to refresh state
        } catch (error) {
            toast.error("Erro ao alterar status");
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
                    <h1 className="text-3xl font-bold">Barbearias</h1>
                    <p className="text-muted-foreground">Gerencie todas as barbearias parceiras.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar barbearia..." 
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
                    <div className="p-10 text-center border rounded-lg">Nenhuma barbearia encontrada.</div>
                ) : (
                    filtered.map((shop) => (
                        <Card key={shop.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center gap-4 p-4">
                                <div className="relative h-16 w-16 min-w-16 rounded-full overflow-hidden bg-muted">
                                    <Image src={shop.imageUrl || "/placeholder.png"} alt={shop.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-bold text-lg">{shop.name}</h3>
                                    <p className="text-sm text-muted-foreground">{shop.address}</p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                     <div className="text-sm font-medium">
                                        Status: {shop.isSuspended ? <Badge variant="destructive">Suspensa</Badge> : <Badge className="bg-green-500 hover:bg-green-600">Ativa</Badge>}
                                     </div>
                                     <div className="text-xs text-muted-foreground">
                                        {shop.bookingsCount} agendamentos
                                     </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <div className="flex gap-2">
                                        <Button 
                                            variant={shop.isSuspended ? "default" : "secondary"} 
                                            size="sm"
                                            onClick={() => handleToggleSuspension(shop.id, shop.isSuspended)}
                                        >
                                            {shop.isSuspended ? "Reativar" : "Suspender"}
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={async () => {
                                                if (confirm(`Tem certeza que deseja excluir a barbearia "${shop.name}"? Essa ação não pode ser desfeita.`)) {
                                                    try {
                                                        await deleteBarbershop(shop.id);
                                                        toast.success("Barbearia excluída com sucesso");
                                                        loadData();
                                                    } catch (error) {
                                                        toast.error("Erro ao excluir barbearia");
                                                    }
                                                }
                                            }}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                     </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
