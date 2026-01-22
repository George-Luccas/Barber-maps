"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteFeedback } from "@/app/_actions/feedback";
import { toast } from "sonner";
import { useTransition } from "react";

export function DeleteFeedbackButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Tem certeza que deseja excluir este feedback?")) return;

        startTransition(async () => {
            const result = await deleteFeedback(id);
            if (result.success) {
                toast.success("Feedback excluído com sucesso");
            } else {
                toast.error("Erro ao excluir feedback");
            }
        });
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete} 
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive"
        >
            <Trash2 className="size-4" />
        </Button>
    );
}
