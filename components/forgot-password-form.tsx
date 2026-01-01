"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await authClient.forgetPassword({
                email,
                redirectTo: "/reset-password",
            });

            if (error) {
                toast.error(error.message || "Erro ao enviar email de recuperação");
                return;
            }

            setSubmitted(true);
            toast.success("Email enviado! Verifique sua caixa de entrada.");
        } catch (err: any) {
            console.error("Erro na recuperação:", err);
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
             <div className="w-full max-w-sm p-6 bg-card rounded-xl border border-border shadow-lg text-center space-y-4">
                <h1 className="text-2xl font-bold text-neon-purple">Email Enviado!</h1>
                <p className="text-muted-foreground">
                    Verifique sua caixa de entrada (e spam) para redefinir sua senha.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Tentar outro email</Button>
             </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm p-6 bg-card rounded-xl border border-border shadow-lg">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-neon-purple drop-shadow-[0_0_8px_rgba(180,0,255,0.3)]">Recuperar Senha</h1>
                <p className="text-sm text-muted-foreground">Digite seu email para receber o link de redefinição</p>
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
                <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white font-bold transition-all" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar Link"}
                </Button>
            </div>
        </form>
    );
};
