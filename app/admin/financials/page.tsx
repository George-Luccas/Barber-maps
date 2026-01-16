"use client";

import { useEffect, useState } from "react";
import { getAdminFinancials } from "../_actions/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, ArrowRightLeft, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminFinancialsPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAdminFinancials();
                setData(res);
            } catch (error) {
                toast.error("Erro ao carregar dados financeiros");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value);
    };

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
                <h1 className="text-3xl font-bold">Financeiro</h1>
                <p className="text-muted-foreground">Visão geral das transações do sistema.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-green-500/10 border-green-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-500">
                            Receita Total
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">{formatCurrency(data?.totalIncome || 0)}</div>
                        <p className="text-xs text-muted-foreground">Entradas registradas</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-500">
                            Despesas Totais
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-400">{formatCurrency(data?.totalExpense || 0)}</div>
                        <p className="text-xs text-muted-foreground">Saídas registradas</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-500">
                            Balanço
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-400">{formatCurrency(data?.balance || 0)}</div>
                        <p className="text-xs text-muted-foreground">
                            {data?.transactionCount} transações no total
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
