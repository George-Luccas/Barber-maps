"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/",
            });

            if (error) {
                console.error("Erro no cadastro (Client):", error);
                toast.error(error.message || "Erro ao criar conta");
                return;
            }

            toast.success("Conta criada com sucesso! Você está logado.");
            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("Exceção não tratada no cadastro:", err);
            toast.error("Ocorreu um erro inesperado ao criar conta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm p-6 bg-card rounded-xl border border-border shadow-lg">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-neon-purple drop-shadow-[0_0_8px_rgba(180,0,255,0.3)]">Criar Conta</h1>
                <p className="text-sm text-muted-foreground">Preencha os dados abaixo para se cadastrar</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                        id="name" 
                        type="text" 
                        placeholder="Seu Nome" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background/50 border-neon-purple/20 focus:border-neon-purple transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/50 border-neon-purple/20 focus:border-neon-purple transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50 border-neon-purple/20 focus:border-neon-purple transition-all"
                    />
                </div>
                <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white font-bold transition-all" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar conta"}
                </Button>
            </div>
            <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline text-neon-purple font-medium">
                    Fazer login
                </Link>
            </div>
        </form>
    );
};
