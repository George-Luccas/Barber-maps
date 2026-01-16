"use client";

import { useEffect, useState } from "react";
import { getAdminUsers } from "../_actions/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAdminUsers();
                setUsers(data);
            } catch (error) {
                toast.error("Erro ao carregar usuários");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/admin">
                    <ArrowLeft className="size-4 mr-2" />
                    Voltar
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Usuários</h1>
                <p className="text-muted-foreground">Lista de usuários cadastrados (Últimos 50).</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usuários Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center p-4">Carregando...</div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={user.image ?? ""} />
                                            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
