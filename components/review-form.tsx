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
import { createBarbershopReview, createBarberReview } from "@/app/_actions/review-actions"
import { toast } from "sonner"

const formSchema = z.object({
  rating: z.number().min(1, "Selecione pelo menos uma estrela").max(5),
  comment: z.string().optional(),
})

interface ReviewFormProps {
  barbershopId: string
  barberId?: string
  userId: string
  userEmail?: string | null
  initialData?: {
    rating: number
    comment?: string | null
  }
}
 
export const ReviewForm = ({ barbershopId, barberId, userId, userEmail, initialData }: ReviewFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(0) // 0, 1, 2 = Questions, 3 = Final Form

  // State for answers
  const [answers, setAnswers] = useState({
    q1: "", // Atendimento
    q2: "", // Corte
    q3: "", // Ambiente
  })

  // Questions Configuration
  const questions = [
    {
      id: "q1",
      question: "Como você avalia o atendimento?",
      options: ["Ruim 😠", "Regular 😐", "Bom 🙂", "Incrível 🤩"],
    },
    {
      id: "q2",
      question: "O resultado do corte ficou como esperado?",
      options: ["Não ❌", "Mais ou menos 😕", "Sim 👍", "Perfeito 🔥"],
    },
    {
      id: "q3",
      question: "O ambiente estava agradável e limpo?",
      options: ["Precisa melhorar 🧹", "Sim, estava ótimo ✨"],
    },
  ]

  const totalSteps = questions.length + 1 // Questions + Final Form

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
    // Auto advance to next step after a short delay for better UX
    setTimeout(() => {
      setStep((prev) => Math.min(prev + 1, totalSteps - 1))
    }, 250)
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    // Format the final comment by appending answers
    let finalComment = values.comment || ""
    if (!initialData) { // Only append answers for new reviews to avoid duplication on edit
        const formattedAnswers = `
--------------------------------
📝 Feedback Detalhado:
1. Atendimento: ${answers.q1}
2. Corte: ${answers.q2}
3. Ambiente: ${answers.q3}
--------------------------------
`
        finalComment = `${values.comment || ""}\n${formattedAnswers}`.trim()
    }

    try {
      if (barberId) {
          await createBarberReview({
            barberId,
            barbershopId,
            userId,
            userEmail,
            rating: values.rating,
            comment: finalComment,
          })
      } else {
          await createBarbershopReview({
            barbershopId,
            userId,
            userEmail,
            rating: values.rating,
            comment: finalComment,
          })
      }
      toast.success("Avaliação enviada com sucesso!")
      setIsOpen(false)
      // Reset form setup
      setStep(0)
      setAnswers({ q1: "", q2: "", q3: "" })
      form.reset()
    } catch (error: any) {
      console.error(error)
      const message = error instanceof Error ? error.message : "Erro ao enviar avaliação.";
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
            setStep(0) // Reset to start when closing
        }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          {initialData ? "Editar minha avaliação" : `Avaliar ${barberId ? "Barbeiro" : "Barbearia"}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step < questions.length ? `Pergunta ${step + 1} de ${questions.length}` : "Finalizar Avaliação"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress Bar */}
          <div className="w-full bg-secondary h-2 rounded-full mb-6 max-w-[200px] mx-auto">
            <div 
                className="bg-neon-purple h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Question Steps */}
          {step < questions.length ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="text-xl font-bold text-center mb-6">
                 {questions[step].question}
               </h3>
               <div className="grid grid-cols-1 gap-3">
                 {questions[step].options.map((option) => (
                   <Button
                     key={option}
                     variant="outline"
                     className="h-14 text-lg justify-start px-6 hover:bg-neon-purple/20 hover:border-neon-purple transition-all"
                     onClick={() => handleOptionSelect(questions[step].id, option)}
                   >
                     {option}
                   </Button>
                 ))}
               </div>
               
               <div className="flex justify-start mt-4">
                  {step > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground">
                        Voltar
                      </Button>
                  )}
               </div>
            </div>
          ) : (
            /* Final Form Step */
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-center block text-lg font-semibold">Quantas estrelas?</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 justify-center py-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={36}
                              className={`cursor-pointer transition-all hover:scale-110 ${
                                star <= field.value
                                  ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                  : "text-gray-600"
                              }`}
                              onClick={() => field.onChange(star)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentário (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Algo mais a acrescentar? Deixe seu elogio ou crítica aqui..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3 justify-between pt-2">
                    <Button type="button" variant="ghost" onClick={handleBack}>
                        Voltar
                    </Button>
                    <Button type="submit" className="flex-1 bg-neon-purple hover:bg-neon-purple/90" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Confirmar Avaliação"}
                    </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
