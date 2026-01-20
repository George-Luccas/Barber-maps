
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/app/_actions/feedback";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  type: z.enum(["BUG", "SUGGESTION", "COMPLAIMENT", "OTHER"], {
    required_error: "Selecione o tipo de feedback.",
  }),
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }).max(1000, {
      message: "A mensagem não pode exceder 1000 caracteres."
  }),
});

export function FeedbackForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "SUGGESTION",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        const result = await submitFeedback(values);
        if (result.success) {
            toast.success("Feedback enviado com sucesso! Obrigado.");
            form.reset();
        } else {
            toast.error("Erro ao enviar feedback. Tente novamente.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Ocorreu um erro inesperado.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-lg p-6 bg-card rounded-xl border border-border shadow-md">
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-neon-purple">Envie seu Feedback</h2>
            <p className="text-sm text-muted-foreground">
                Ajude-nos a melhorar a plataforma. Envie sugestões, reporte bugs ou faça críticas.
            </p>
        </div>
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SUGGESTION">Sugestão</SelectItem>
                  <SelectItem value="BUG">Problema / Bug</SelectItem>
                  <SelectItem value="COMPLAIMENT">Crítica / Reclamação</SelectItem>
                  <SelectItem value="OTHER">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva seu feedback aqui..."
                  className="resize-none min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Seja o mais detalhado possível.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/80 font-bold" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar Feedback"}
        </Button>
      </form>
    </Form>
  );
}
