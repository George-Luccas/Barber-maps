"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { formatCurrency } from "@/lib/utils";
import { BarbershopService, Barbershop, Barber } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useGetDateAvailableTimeSlots } from "@/hooks/data/use-get-date-availabe-time-slots";
import BookingSummary from "./booking-summary";
import { createBooking } from "@/actions/create-booking";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useUserMembership } from "@/hooks/data/use-user-membership";

interface ServiceItemProps {
  service: BarbershopService;
  barbershop: Pick<Barbershop, "name" | "id"> & {
    isOpen?: boolean;
    barbers?: Barber[];
  };
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const [paymentMethod, setPaymentMethod] = useState<"MONEY" | "SUBSCRIPTION">("MONEY");
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { executeAsync: executeCreateBooking, isPending: isCreatingBooking } =
    useAction(createBooking);
  const { data: availableTimeSlots, refetch } = useGetDateAvailableTimeSlots({
    barbershopId: barbershop.id,
    date: selectedDate,
    barberId: selectedBarberId,
  });

  // Fetch Membership
  const { data: membership } = useUserMembership();

  // Refetch when barber changes
  useEffect(() => {
    if (selectedDate) {
        refetch();
    }
  }, [selectedBarberId, selectedDate, refetch]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    const splittedTime = selectedTime.split(":");
    const hours = Number(splittedTime[0]);
    const minutes = Number(splittedTime[1]);
    const date = new Date(selectedDate);
    date.setHours(hours, minutes);
    
    const result = await executeCreateBooking({
      date,
      serviceId: service.id,
      barberId: selectedBarberId,
      isSubscription: paymentMethod === "SUBSCRIPTION",
    });
    
    if (result.validationErrors) {
      return toast.error(result.validationErrors._errors?.[0]);
    }
    if (result.serverError) {
      return toast.error(
        "Erro ao criar agendamento. Por favor, tente novamente.",
      );
    }
    
    toast.success("Reserva realizada com sucesso!");
    setSheetIsOpen(false);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedBarberId(undefined);
    setPaymentMethod("MONEY"); // Reset
  };

  const isOpen = barbershop.isOpen ?? true;

  const selectedBarber = barbershop.barbers?.find(
     (barber) => barber.id === selectedBarberId
  );
  
  const hasMembership = membership?.status === "ACTIVE";
  const hasCredits = (membership?.current_balance ?? 0) > 0;

  return (
    <div className="border-border bg-card flex gap-3 rounded-2xl border p-3">
      {/* Service Image */}
      <div className="relative h-[110px] w-[110px] shrink-0">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="rounded-xl object-cover"
        />
      </div>

      {/* Service Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold">{service.name}</p>
          <p className="text-muted-foreground text-sm">{service.description}</p>
        </div>

        {/* Price and Booking Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            {formatCurrency(service.priceInCents)}
          </p>

          <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
            <SheetTrigger asChild>
              <Button 
                className="rounded-full" 
                size="sm"
                disabled={!isOpen}
              >
                {isOpen ? "Reservar" : "Fechado"}
              </Button>
            </SheetTrigger>
            <SheetContent className="px-0 pb-0 overflow-y-auto w-[90%] sm:max-w-sm">
              <SheetHeader className="border-border border-b px-5 py-6">
                <SheetTitle>Fazer Reserva</SheetTitle>
              </SheetHeader>

              <div className="border-border border-b px-5 py-6">
                {barbershop.barbers && barbershop.barbers.length > 0 && (
                   <div className="mb-6 w-full">
                      <p className="mb-3 text-sm font-bold">Selecione o Profissional</p>
                      <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden mobile-touch-scroll w-full">
                         {barbershop.barbers.map((barber) => (
                             <div 
                                key={barber.id} 
                                onClick={() => setSelectedBarberId(barber.id === selectedBarberId ? undefined : barber.id)}
                                className={`flex flex-col items-center gap-2 cursor-pointer min-w-[80px] rounded-xl p-2 transition-all border ${selectedBarberId === barber.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted border-transparent'}`}
                             >
                                <Avatar className={`size-12 ${selectedBarberId === barber.id ? "border-2 border-primary" : "border border-border"}`}>
                                   <AvatarImage src={barber.imageUrl ?? ""} />
                                   <AvatarFallback className="font-bold">{barber.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <p className={`text-xs font-semibold text-center ${selectedBarberId === barber.id ? "text-primary" : "text-muted-foreground"}`}>{barber.name.split(" ")[0]}</p>
                             </div>
                         ))}
                      </div>
                   </div>
                )}
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={ptBR}
                  className="w-full p-0"
                  disabled={{ before: new Date() }}
                  classNames={{
                    cell: "w-full",
                    day: "w-[36px] h-[36px] mx-auto text-sm bg-transparent hover:bg-muted rounded-full data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
                    head_cell:
                      "w-full text-xs font-normal text-muted-foreground capitalize",
                    caption: "capitalize",
                    caption_label: "text-base font-bold",
                    nav: "flex gap-1 absolute right-0 top-0 z-10",
                    nav_button_previous:
                      "w-7 h-7 bg-transparent border border-border rounded-lg hover:opacity-100 hover:bg-transparent",
                    nav_button_next:
                      "w-7 h-7 bg-muted text-muted-foreground rounded-lg hover:opacity-100 hover:bg-muted",
                    month_caption:
                      "flex justify-start pt-1 relative items-center w-full px-0",
                  }}
                />
              </div>

              {/* Time Selection Container - Always Visible to debug layout */}
              <div className="border-border border-b px-5 py-6 flex flex-col gap-3">
                 <p className="text-sm font-bold">Horários</p>
                 {!selectedDate ? (
                     <p className="text-xs text-muted-foreground">Selecione uma data para ver os horários.</p>
                 ) : (
                     <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden w-full pb-4 mobile-touch-scroll">
                        {availableTimeSlots === undefined ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin text-primary" />
                                <span className="text-xs text-muted-foreground">Carregando horários...</span>
                            </div>
                        ) : availableTimeSlots?.data && availableTimeSlots.data.length > 0 ? (
                          availableTimeSlots.data.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              className="rounded-full"
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </Button>
                          ))
                        ) : (
                           <p className="text-xs text-muted-foreground w-full">Nenhum horário disponível para esta data.</p>
                        )}
                      </div>
                 )}
              </div>
              
              {/* PAYMENT METHOD SELECTION */}
              <div className="border-border border-b px-5 py-6">
                 <p className="text-sm font-bold mb-3">Forma de Pagamento</p>
                 <div className="flex flex-col gap-3">
                    {/* OPTION 1: MONEY/LOCALE */}
                    <div 
                        className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${paymentMethod === 'MONEY' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                        onClick={() => setPaymentMethod('MONEY')}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'MONEY' ? 'border-primary' : 'border-muted-foreground'}`}>
                                {paymentMethod === 'MONEY' && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                            <span className="text-sm font-medium">No Local (Dinheiro/PIX/Cartão)</span>
                        </div>
                    </div>
                    
                    {/* OPTION 2: SUBSCRIPTION */}
                    {hasMembership && service.name.toLowerCase().includes("corte") && (
                        <div 
                            className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${paymentMethod === 'SUBSCRIPTION' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'} ${!hasCredits ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => hasCredits && setPaymentMethod('SUBSCRIPTION')}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'SUBSCRIPTION' ? 'border-primary' : 'border-muted-foreground'}`}>
                                    {paymentMethod === 'SUBSCRIPTION' && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        Assinatura 
                                        {hasCredits ? (
                                             <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                                                {membership.current_balance} créditos
                                             </span> 
                                        ) : (
                                             <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-bold">
                                                Esgotado
                                             </span> 
                                        )}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Utilizar 1 crédito do plano</span>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
              </div>


              {/* Booking Summary */}
              {selectedDate && selectedTime && (
                <div className="px-5 py-6">
                  <BookingSummary
                    serviceName={service.name}
                    servicePrice={paymentMethod === 'SUBSCRIPTION' ? 0 : service.priceInCents}
                    barbershopName={barbershop.name}
                    date={selectedDate}
                    time={selectedTime}
                    barberName={selectedBarber?.name}
                  />
                  {paymentMethod === 'SUBSCRIPTION' && (
                       <p className="mt-2 text-xs text-primary font-bold text-center bg-primary/10 p-2 rounded-lg">
                           Será descontado 1 crédito da sua assinatura
                       </p>
                  )}
                </div>
              )}

              <SheetFooter className="px-5 pb-6">
                <Button
                  className="w-full"
                  disabled={!selectedDate || !selectedTime || isCreatingBooking}
                  onClick={handleConfirmBooking}
                >
                  {isCreatingBooking ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Confirmar Reserva"
                  )}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
