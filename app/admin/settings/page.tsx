"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
    
    const handleSave = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'Salvando configurações...',
                success: 'Configurações salvas com sucesso!',
                error: 'Erro ao salvar'
            }
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/admin">
                    <ArrowLeft className="size-4 mr-2" />
                    Voltar
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-muted-foreground">Ajustes gerais do sistema.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Geral</CardTitle>
                    <CardDescription>Controle o comportamento global da aplicação.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Modo Manutenção</Label>
                            <p className="text-sm text-muted-foreground">
                                Desativa o acesso público à aplicação, exceto para administradores.
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <div className="border-b" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Novos Cadastros</Label>
                            <p className="text-sm text-muted-foreground">
                                Permitir que novos usuários se cadastrem na plataforma.
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                     <div className="border-b" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                             <Label className="text-base">Notificações por Email</Label>
                             <p className="text-sm text-muted-foreground">
                                 Habilitar envio de emails transacionais.
                             </p>
                        </div>
                         <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="bg-neon-purple hover:bg-neon-purple/90">
                    Salvar Alterações
                </Button>
            </div>
        </div>
    );
}
