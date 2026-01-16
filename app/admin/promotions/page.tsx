"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash, ExternalLink, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createPromotion, deletePromotion, getPromotions } from "@/app/_actions/promotions";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define Role Enum/Type if not available globally to avoid TS errors
type UserRole = "ADMIN" | "BARBER" | "CLIENT";

export default function AdminPromotionsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check Admin Role
    // Note: session user role might be typed differently, adding safe check
    const user = session?.user as any;
    const role = user?.role;
    
    // Wait for session to be determined (undefined means loading)
    if (session === undefined) return; 

    if (!session || role !== "ADMIN") {
        router.push("/");
        return;
    }

    // Fetch Promotions
    loadPromotions();
  }, [session, router]);

  const loadPromotions = async () => {
      try {
          const data = await getPromotions(false); // Get all
          setPromotions(data);
      } catch (error) {
          toast.error("Erro ao carregar promoções");
      } finally {
          setIsLoading(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !imageUrl) {
          toast.error("Preencha título e imagem");
          return;
      }

      setIsSubmitting(true);
      try {
          await createPromotion({
              title,
              description,
              imageUrl,
              linkUrl,
              active: true
          });
          toast.success("Promoção criada!");
          setIsOpen(false);
          resetForm();
          loadPromotions();
      } catch (error) {
          toast.error("Erro ao criar promoção");
      } finally {
          setIsSubmitting(false);
      }
  };

  const resetForm = () => {
      setTitle("");
      setDescription("");
      setImageUrl("");
      setLinkUrl("");
  }

  const handleDelete = async (id: string) => {
      if (!confirm("Tem certeza que deseja excluir esta promoção?")) return;
      try {
          await deletePromotion(id);
          toast.success("Promoção excluída");
          loadPromotions();
      } catch (error) {
          toast.error("Erro ao excluir");
      }
  }

  if (isLoading) return <div className="flex justify-center p-10">Carregando...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/admin">
                    <ArrowLeft className="size-4 mr-2" />
                    Voltar
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Gerenciar Promoções</h1>
                <p className="text-muted-foreground">Adicione banners para a página inicial</p>
            </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-neon-purple hover:bg-neon-purple/90">
                    <Plus className="size-4" /> Nova Promoção
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Promoção</DialogTitle>
                    <DialogDescription>Preencha os dados do banner promocional.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Título</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Semana Maluca" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descrição (Opcional)</label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes da promoção..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagem do Banner</label>
                        <div className="flex flex-col gap-4">
                            <Input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setImageUrl(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} 
                            />
                            {imageUrl && (
                                <div className="relative h-32 w-full rounded-md overflow-hidden border">
                                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => setImageUrl("")}
                                    >
                                        <Trash className="size-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Link de Redirecionamento (Opcional)</label>
                        <Input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <Button type="submit" className="w-full bg-neon-purple" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : "Criar Promoção"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promo) => (
              <Card key={promo.id} className="overflow-hidden border-neon-purple/20">
                  <div className="relative h-40 w-full bg-muted">
                      {promo.imageUrl ? (
                          <Image src={promo.imageUrl} alt={promo.title} fill className="object-cover" />
                      ) : (
                          <div className="flex items-center justify-center h-full">
                              <ImageIcon className="size-10 text-muted-foreground" />
                          </div>
                      )}
                  </div>
                  <CardHeader className="p-4">
                      <CardTitle className="text-lg flex justify-between items-start">
                          <span className="truncate" title={promo.title}>{promo.title}</span>
                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(promo.id)}>
                              <Trash className="size-4" />
                          </Button>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                          {promo.description || "Sem descrição"}
                      </CardDescription>
                      {promo.linkUrl && (
                          <div className="pt-2">
                              <a href={promo.linkUrl} target="_blank" className="text-xs text-neon-purple flex items-center gap-1 hover:underline">
                                  <ExternalLink className="size-3" /> {promo.linkUrl}
                              </a>
                          </div>
                      )}
                  </CardHeader>
              </Card>
          ))}
          
          {promotions.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                  Nenhuma promoção ativa.
              </div>
          )}
      </div>
    </div>
  );
}
