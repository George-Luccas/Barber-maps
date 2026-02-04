"use client";

import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteBarbershopReview } from "@/app/_actions/review-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteReviewButtonProps {
  reviewId: string;
}

const DeleteReviewButton = ({ reviewId }: DeleteReviewButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBarbershopReview(reviewId);
      toast.success("Avaliação excluída com sucesso.");
      router.refresh(); // Refresh to update list
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir avaliação.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Avaliação?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta avaliação de forma permanente?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            {isDeleting ? "Excluindo..." : "Sim, Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReviewButton;
