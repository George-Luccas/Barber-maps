"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { createBarbershopReview } from "@/app/_actions/review-actions"
import { toast } from "sonner"

const formSchema = z.object({
  rating: z.number().min(1, "Selecione pelo menos uma estrela").max(5),
  comment: z.string().optional(),
})

interface ReviewFormProps {
  barbershopId: string
  userId: string
  userEmail?: string | null
  initialData?: {
    rating: number
    comment?: string | null
  }
}

export const ReviewForm = ({ barbershopId, userId, userEmail, initialData }: ReviewFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await createBarbershopReview({
        barbershopId,
        userId,
        userEmail,
        rating: values.rating,
        comment: values.comment,
      })
      toast.success("Avaliação enviada com sucesso!")
      setIsOpen(false)
    } catch (error: any) {
      console.error(error)
      // Attempt to extract the error message if it's an Error object or string
      const message = error instanceof Error ? error.message : "Erro ao enviar avaliação.";
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          {initialData ? "Editar minha avaliação" : "Avaliar agora"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avaliar Barbearia</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua nota</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 justify-center py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={32}
                          className={`cursor-pointer transition-colors ${
                            star <= field.value
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu comentário (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte sua experiência..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
