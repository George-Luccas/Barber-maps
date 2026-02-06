"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Loader2, Plus, X } from "lucide-react";
import { updateBarberProfileAction } from "@/actions/barber-profile-actions";
import { toast } from "sonner";

interface BarberProfile {
  name?: string;
  image?: string | null;
  bio?: string | null;
  phone?: string | null;
  yearsOfExperience?: number;
  workplaceName?: string | null;
  isAutonomous?: boolean;
  specialties?: string[];
}

interface EditBarberProfileDialogProps {
  profile: BarberProfile;
  onUpdate?: () => void;
}

export function EditBarberProfileDialog({ profile, onUpdate }: EditBarberProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile.name || "",
    image: profile.image || "",
    bio: profile.bio || "",
    phone: profile.phone || "",
    yearsOfExperience: profile.yearsOfExperience || 0,
    workplaceName: profile.workplaceName || "",
    isAutonomous: profile.isAutonomous || false,
    specialties: profile.specialties || [],
  });

  const [newSpecialty, setNewSpecialty] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateBarberProfileAction({
        name: formData.name || undefined,
        image: formData.image || undefined,
        bio: formData.bio || undefined,
        phone: formData.phone || undefined,
        yearsOfExperience: formData.yearsOfExperience || undefined,
        workplaceName: formData.workplaceName || undefined,
        isAutonomous: formData.isAutonomous,
        specialties: formData.specialties.length > 0 ? formData.specialties : undefined,
      });

      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
        setOpen(false);
        onUpdate?.();
      } else {
        toast.error(result.error || "Erro ao atualizar perfil");
      }
    } catch {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()],
      });
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="size-4" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil de Barbeiro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome"
            />
          </div>

          {/* Foto */}
          <div className="space-y-2">
            <Label htmlFor="image">URL da Foto de Perfil</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Sobre</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Fale um pouco sobre você e seu trabalho..."
              rows={3}
            />
          </div>

          {/* Anos de Experiência */}
          <div className="space-y-2">
            <Label htmlFor="years">Anos de Experiência</Label>
            <Input
              id="years"
              type="number"
              min={0}
              max={50}
              value={formData.yearsOfExperience}
              onChange={(e) =>
                setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          {/* Local de Trabalho */}
          <div className="space-y-2">
            <Label htmlFor="workplace">Barbearia onde trabalha</Label>
            <Input
              id="workplace"
              value={formData.workplaceName}
              onChange={(e) => setFormData({ ...formData, workplaceName: e.target.value })}
              placeholder="Nome da barbearia"
            />
          </div>

          {/* Autônomo */}
          <div className="flex items-center justify-between">
            <Label htmlFor="autonomous">Sou barbeiro autônomo</Label>
            <Switch
              id="autonomous"
              checked={formData.isAutonomous}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isAutonomous: checked })
              }
            />
          </div>

          {/* Especialidades */}
          <div className="space-y-2">
            <Label>Especialidades</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Ex: Degradê, Barba..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSpecialty();
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSpecialty}>
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm flex items-center gap-1"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(specialty)}
                    className="hover:text-red-400"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-neon-purple">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
