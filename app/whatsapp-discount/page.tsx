"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer, PageSectionTitle } from "@/components/ui/page";
import Footer from "@/components/footer";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { registerWhatsappDiscount } from "@/actions/register-whatsapp-discount";
import { toast } from "sonner";
import { Loader2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const WhatsappDiscountPage = () => {
  const [phone, setPhone] = useState("");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const { execute, isPending } = useAction(registerWhatsappDiscount, {
    onSuccess: () => {
      toast.success("Desconto resgatado com sucesso! Utilize no seu próximo agendamento.");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao resgatar desconto. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      return toast.error("Você precisa estar logado para resgatar o desconto.");
    }
    execute({ phone });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PageContainer className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-neon-purple/10 p-4 ring-1 ring-neon-purple/20">
              <MessageSquare className="size-8 text-neon-purple" />
            </div>
          </div>
          
            <h1 className="text-3xl font-bold tracking-tight">Receba Promoções</h1>
            <p className="text-muted-foreground">
              Insira seu número aqui para receber nossas melhores ofertas.
            </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none">
                Seu WhatsApp
              </label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-full"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full rounded-full bg-neon-purple hover:bg-neon-purple/90" 
              disabled={isPending || !phone}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Resgatar Desconto"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            * Desconto válido para uma única utilização por usuário.
          </p>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default WhatsappDiscountPage;
