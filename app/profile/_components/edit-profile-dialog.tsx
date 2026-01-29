"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateUserProfile } from "@/app/_actions/user-actions"
import { toast } from "sonner"
import { Loader2, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  phone: z.string().optional(),
  imagePosition: z.string().optional(),
  coverImagePosition: z.string().optional(),
})

interface EditProfileDialogProps {
  user: {
    name: string
    phone?: string | null
    image?: string | null
    coverImage?: string | null
    imagePosition?: string
    coverImagePosition?: string
  }
}

// Helper to extract Y percentage from string like "center 50%" or "top" (0%) or "bottom" (100%) or "center" (50%)
function parsePositionToNumber(pos?: string | null): number {
    if (!pos) return 50;
    if (pos === "top") return 0;
    if (pos === "bottom") return 100;
    if (pos === "center") return 50;
    
    // Check for "center X%"
    const match = pos.match(/(\d+)%/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return 50;
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone || "",
      imagePosition: user.imagePosition || "center",
      coverImagePosition: user.coverImagePosition || "center",
    },
  })

  // Normalize phone on change (basic masking) if needed, currently just plain text.
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error("A imagem deve ter no máximo 1MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setSelectedImage(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error("A imagem deve ter no máximo 1MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setSelectedCoverImage(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      await updateUserProfile({
        name: values.name,
        phone: values.phone,
        image: selectedImage,
        coverImage: selectedCoverImage,
        imagePosition: values.imagePosition,
        coverImagePosition: values.coverImagePosition,
      })
      toast.success("Perfil atualizado com sucesso!")
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao atualizar perfil.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
            <Settings className="size-4" />
            <span className="hidden sm:inline">Editar Perfil</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações em seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
                <Label htmlFor="image">Foto de Perfil</Label>
                <div className="flex items-center gap-4">
                    {selectedImage && (
                        <div className="size-12 rounded-full overflow-hidden border border-border">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={selectedImage} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                                style={{ objectPosition: form.watch("imagePosition") }}
                            />
                        </div>
                    )}
                    <Input 
                        id="image" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            <FormField
              control={form.control}
              name="imagePosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Posição Vertical da Foto de Perfil
                    <span className="text-xs text-muted-foreground">{parsePositionToNumber(field.value)}%</span>
                  </FormLabel>
                  <FormControl>
                    <Slider 
                      min={0} 
                      max={100} 
                      step={1} 
                      defaultValue={[parsePositionToNumber(field.value)]}
                      onValueChange={(vals) => {
                          // We are controlling vertical position primarily (Y axis)
                          // X is usually centered. value "center" means "50% 50%" or just "center"
                          // We will store as "center [Y]%"
                          const yPos = vals[0];
                          field.onChange(`center ${yPos}%`);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
                <Label htmlFor="coverImage">Foto de Capa</Label>
                <div className="flex items-center gap-4">
                    {selectedCoverImage && (
                        <div className="h-12 w-20 rounded-md overflow-hidden border border-border">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={selectedCoverImage} 
                                alt="Cover Preview" 
                                className="w-full h-full object-cover" 
                                style={{ objectPosition: form.watch("coverImagePosition") }}
                            />
                        </div>
                    )}
                    <Input 
                        id="coverImage" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCoverImageChange}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            <FormField
              control={form.control}
              name="coverImagePosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Posição Vertical da Capa
                    <span className="text-xs text-muted-foreground">{parsePositionToNumber(field.value)}%</span>
                  </FormLabel>
                  <FormControl>
                     <Slider 
                      min={0} 
                      max={100} 
                      step={1} 
                      defaultValue={[parsePositionToNumber(field.value)]}
                      onValueChange={(vals) => {
                          const yPos = vals[0];
                          field.onChange(`center ${yPos}%`);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-muted-foreground">Recomendado: 1MB máx.</p>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
