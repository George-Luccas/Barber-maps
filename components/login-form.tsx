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

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/",
            });

            if (error) {
                console.error("Erro no login (Client):", error);
                toast.error(error.message || "Erro ao fazer login");
                return;
            }

            toast.success("Login realizado com sucesso!");
            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("Exceção não tratada no login:", err);
            toast.error("Ocorreu um erro inesperado ao fazer login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm p-6 bg-card rounded-xl border border-border shadow-lg">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-neon-purple drop-shadow-[0_0_8px_rgba(180,0,255,0.3)]">Login</h1>
                <p className="text-sm text-muted-foreground">Insira suas credenciais para acessar sua conta</p>
            </div>
            <div className="space-y-4">
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
                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-neon-purple transition-colors">
                        Esqueceu a senha?
                    </Link>
                </div>
                <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white font-bold transition-all" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
                </Button>
            </div>
            <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <Link href="/register" className="underline text-neon-purple font-medium">
                    Cadastre-se
                </Link>
            </div>
        </form>
    );
};
