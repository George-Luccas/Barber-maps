"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    // In Better Auth, explicitly getting the token from URL might not be strictly necessary if the client handles it, 
    // but usually resetPassword fn needs it or the flow handles it auto.
    // authClient.resetPassword usually takes { newPassword, token }.
    const token = searchParams.get("token"); // or "code"? usually "token".

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!token) {
         return (
             <div className="w-full max-w-sm p-6 bg-destructive/10 rounded-xl border border-destructive text-center space-y-4">
                <h1 className="text-xl font-bold text-destructive">Token Inválido</h1>
                <p className="text-muted-foreground">O link de redefinição parece inválido ou expirado.</p>
                <Button variant="outline" onClick={() => router.push("/forgot-password")}>Solicitar novo link</Button>
             </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token: token,
            });

            if (error) {
                toast.error(error.message || "Erro ao redefinir senha");
                return;
            }

            toast.success("Senha alterada com sucesso! Faça login.");
            router.push("/login");
        } catch (err: any) {
             console.error("Erro no reset:", err);
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm p-6 bg-card rounded-xl border border-border shadow-lg">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-neon-purple drop-shadow-[0_0_8px_rgba(180,0,255,0.3)]">Nova Senha</h1>
                <p className="text-sm text-muted-foreground">Digite sua nova senha abaixo</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Nova Senha</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50 border-neon-purple/20 focus:border-neon-purple transition-all"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input 
                        id="confirmPassword" 
                        type="password" 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background/50 border-neon-purple/20 focus:border-neon-purple transition-all"
                    />
                </div>
                <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white font-bold transition-all" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Salvar Nova Senha"}
                </Button>
            </div>
        </form>
    );
};
