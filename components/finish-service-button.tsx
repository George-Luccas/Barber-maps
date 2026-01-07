"use client";

import { finishService } from "@/actions/finish-service";
import { Button } from "./ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

interface FinishServiceButtonProps {
  bookingId: string;
  isSubscription: boolean;
  onSuccess?: () => void;
}

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// ...

const FinishServiceButton = ({ bookingId, isSubscription, onSuccess }: FinishServiceButtonProps) => {
  const { executeAsync, isPending } = useAction(finishService);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleFinish = async () => {
    const result = await executeAsync({ bookingId });
    
    if (result.serverError) {
        toast.error("Erro ao concluir serviço.");
        return;
    }

    if (result.data?.success) {
        toast.success("Serviço concluído e crédito descontado!");
        await queryClient.invalidateQueries({ queryKey: ["user-membership"] });
        router.refresh();
        onSuccess?.();
    } else {
        toast.info(result.data?.message ?? "Serviço concluído.");
    }
  };

  return (
    <Button 
        className="w-full font-bold bg-green-600 hover:bg-green-700 text-white" 
        onClick={handleFinish}
        disabled={isPending}
    >
        {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle className="mr-2 size-4" />}
        Concluir Atendimento {isSubscription && "(1 Crédito)"}
    </Button>
  );
};

export default FinishServiceButton;
