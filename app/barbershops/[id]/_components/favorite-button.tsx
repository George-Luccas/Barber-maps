"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleFavoriteBarbershop } from "@/app/_actions/user-actions"
import { toast } from "sonner"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  barbershopId: string
  isFavorited: boolean
}

export function FavoriteButton({ barbershopId, isFavorited: initialIsFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async () => {
    setIsLoading(true)
    try {
        await toggleFavoriteBarbershop(barbershopId)
        setIsFavorited(!isFavorited)
        toast.success(isFavorited ? "Removido dos favoritos." : "Adicionado aos favoritos!")
    } catch (error: any) {
        toast.error(error.message || "Erro ao favoritar.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Button 
        variant="secondary" 
        size="icon" 
        className={cn("rounded-full", isFavorited && "text-red-500 hover:text-red-600")}
        onClick={handleToggleFavorite}
        disabled={isLoading}
    >
        <Heart className={cn("size-5", isFavorited && "fill-current")} />
    </Button>
  )
}
