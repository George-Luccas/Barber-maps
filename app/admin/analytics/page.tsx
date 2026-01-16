"use client";

import { useEffect, useState } from "react";
import { getAdminAnalytics } from "../_actions/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Scissors, CalendarDays, TrendingUp, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAdminAnalytics();
                setData(res);
            } catch (error) {
                toast.error("Erro ao carregar analytics");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    if (isLoading) return <div className="p-10 text-center">Carregando...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/admin">
                    <ArrowLeft className="size-4 mr-2" />
                    Voltar
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Métricas de desempenho da plataforma.</p>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Barbearias</CardTitle>
                        <Scissors className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalBarbershops}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalBookings}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Barbershops */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                         <div className="flex items-center gap-2">
                             <TrendingUp className="size-5 text-neon-purple" />
                             <CardTitle>Top Barbearias</CardTitle>
                         </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.topBarbershops.map((shop: any, i: number) => (
                                <div key={shop.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <div className="font-medium">{shop.name}</div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {shop.bookingsCount} bookings
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Agendamentos Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {data?.recentBookings.map((booking: any) => (
                                <div key={booking.id} className="flex flex-col border-b pb-2 last:border-0">
                                    <div className="font-medium">{booking.service.name}</div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{booking.barbershop.name}</span>
                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
