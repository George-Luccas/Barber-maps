"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
import { BookingWithRelations } from "@/data/bookings";
import { getBookingStatus } from "@/lib/booking-status";
import BookingSummary from "./booking-summary";
import CopyButton from "@/app/barbershops/[id]/_components/copy-button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Smartphone, X, Loader2, UploadCloud, Copy } from "lucide-react";
import { cancelBooking } from "@/actions/cancel-booking";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import FinishServiceButton from "./finish-service-button";

interface BookingInfoSheetProps {
  booking: BookingWithRelations;
  onClose: () => void;
}

  /* ... */
const BookingInfoSheet = ({ booking, onClose }: BookingInfoSheetProps) => {
  const router = useRouter();
  const status = getBookingStatus(booking.date, booking.cancelledAt, booking.status);
  const { executeAsync: executeCancelBooking, isPending: isCancelling } =
    useAction(cancelBooking);

  const [isUploading, setIsUploading] = useState(false);
  const [pixKey, setPixKey] = useState<string | null>(null);

  // Fetch Pix Key on mount
  useState(() => {
      const fetchPixKey = async () => {
          try {
             const { getBarbershopInfo } = await import("@/app/_actions/get-barbershop-info");
             const info = await getBarbershopInfo(booking.barbershop.id);
             if (info && !info.error && info.pixKey) {
                 setPixKey(info.pixKey);
             }
          } catch (e) {
              console.error("Failed to fetch pix key", e);
          }
      };
      fetchPixKey();
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 3) {
      return toast.error("O arquivo deve ter no máximo 3MB.");
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const { uploadReceipt } = await import("@/app/_actions/upload-receipt");
        const result = await uploadReceipt({
          bookingId: booking.id,
          receiptDataVal: base64,
        });

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Comprovante enviado com sucesso!");
          router.refresh();
        }
      } catch (error) {
        toast.error("Erro ao enviar comprovante.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };
 /* ... */

  const handleCancelBooking = async () => {
    const result = await executeCancelBooking({ bookingId: booking.id });

    if (result?.validationErrors) {
      return toast.error(result.validationErrors._errors?.[0]);
    }

    if (result?.serverError) {
      return toast.error(
        "Erro ao cancelar agendamento. Por favor, tente novamente.",
      );
    }

    toast.success("Agendamento cancelado com sucesso!");
    onClose();
    router.refresh();
  };

  return (
    <SheetContent className="flex flex-col overflow-y-auto p-0">
      <SheetHeader className="flex flex-row items-center justify-between border-b px-5 py-6">
        <SheetTitle>Informações da Reserva</SheetTitle>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-6 px-5 py-6">
        <div className="relative h-45 w-full overflow-hidden rounded-lg">
          <Image src="/map.png" alt="Mapa" fill className="object-cover" />
          <div className="bg-background absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-lg px-5 py-3">
            <Avatar className="size-12">
              <AvatarImage src={booking.barbershop.imageUrl ?? ""} />
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="font-bold">{booking.barbershop.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {booking.barbershop.address}
              </p>
            </div>
          </div>
        </div>

        {/* Display Client Info in Sheet (App-side Join) */}
        {booking.user && (
            <div className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={booking.user.image ?? ""} />
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">Cliente</p>
                        <p className="text-sm text-foreground">{booking.user.name}</p>
                    </div>
                </div>
            </div>
        )}

        <div className="flex flex-col gap-3">
          {status === "cancelled" ? (
            <Badge variant="destructive" className="w-fit">
              CANCELADO
            </Badge>
          ) : status === "confirmed" ? (
            <Badge className={`w-fit ${booking.isSubscription ? "bg-violet-600 hover:bg-violet-700" : ""}`}>
                 {booking.isSubscription ? "ASSINATURA" : "CONFIRMADO"}
            </Badge>
          ) : (
            <Badge variant="secondary" className="w-fit">
              FINALIZADO
            </Badge>
          )}

          <BookingSummary
            serviceName={booking.service.name}
            servicePrice={booking.service.priceInCents}
            barbershopName={booking.barbershop.name}
            date={booking.date}
          />
        </div>

        {booking.barbershop.phones.length > 0 && (
          <div className="flex flex-col gap-3">
            {booking.barbershop.phones.map((phone: string, index: number) => (
              <div
                key={`${phone}-${index}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="size-6" />
                  <p className="text-sm">{phone}</p>
                </div>
                <CopyButton text={phone} />
              </div>
            ))}
          </div>
        )}

      {/* Receipt & Pix Section */}
      {(status === "pending" || status === "confirmed") && (
          <div className="px-5 pb-4 mt-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-yellow-600 mb-1">
                      {status === "pending" ? "Pagamento Pendente" : "Comprovante de Pagamento"}
                  </h3>
                  
                  {pixKey && !booking.receiptUrl && (
                      <div className="mb-4 bg-background/50 p-3 rounded border border-yellow-500/30">
                          <p className="text-xs font-semibold mb-1 text-muted-foreground">Chave Pix da Barbearia:</p>
                          <div className="flex items-center gap-2">
                              <code className="flex-1 bg-muted p-2 rounded text-xs break-all">{pixKey}</code>
                              <CopyButton text={pixKey} />
                          </div>
                      </div>
                  )}

                  <p className="text-xs text-muted-foreground mb-3">
                      {booking.receiptUrl 
                          ? "Comprovante enviado." 
                          : "Envie o comprovante para confirmar seu agendamento."}
                  </p>
                  
                  {booking.receiptUrl ? (
                      <div className="flex flex-col gap-2">
                          <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                              Sim, comprovante enviado! Aguardando aprovação.
                          </div>
                          <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                               <Image src={booking.receiptUrl} alt="Comprovante" fill className="object-cover" />
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col gap-2">
                          <Button 
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white" 
                            disabled={isUploading}
                            onClick={() => document.getElementById("receipt-upload")?.click()}
                          >
                              {isUploading ? <Loader2 className="animate-spin size-4 mr-2" /> : <UploadCloud className="size-4 mr-2" />}
                              {isUploading ? "Enviando..." : "Enviar Comprovante"}
                          </Button>
                          <input 
                              type="file" 
                              id="receipt-upload" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleFileChange}
                          />
                      </div>
                  )}
              </div>
          </div>
      )}
      </div>



      <div className="flex gap-3 border-t px-5 py-6 flex-col">
        <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={onClose}
            >
              Voltar
            </Button>

            {status === "confirmed" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1 rounded-full">
                    Cancelar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja cancelar esta reserva? Esta ação não
                      pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Não, manter reserva</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelBooking}
                      disabled={isCancelling}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isCancelling ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Sim, cancelar"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
        </div>
        
        {/* BARBER ACTION (For Demo Purposes - In prod, check if user is manager) */}
        {status === "confirmed" && (
            <div className="border-t pt-4 mt-2">
                 <p className="text-xs font-bold text-muted-foreground mb-2 text-center uppercase tracking-wider">Área do Profissional</p>
                 <FinishServiceButton 
                    bookingId={booking.id} 
                    isSubscription={booking.isSubscription ?? false} 
                    onSuccess={onClose}
                 />
            </div>
        )}
      </div>
    </SheetContent>
  );
};

export default BookingInfoSheet;
