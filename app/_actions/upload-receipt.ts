"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const uploadReceiptSchema = z.object({
  bookingId: z.string().uuid(),
  receiptDataVal: z.string().min(1, "Imagem é obrigatória"), // Expecting base64 string
});

export async function uploadReceipt(input: z.infer<typeof uploadReceiptSchema>) {
  const result = uploadReceiptSchema.safeParse(input);

  if (!result.success) {
    return { error: "Dados inválidos." };
  }

  const { bookingId, receiptDataVal } = result.data;

  try {
    // 1. Check if booking exists locally
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    // If local booking exists, validate and update it
    if (booking) {
        if ((booking.status as string) !== "PENDING" && (booking.status as string) !== "CONFIRMED") {
             return { error: "O agendamento não está pendente de pagamento." };
        }

        // Update booking with receipt locally
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            receiptUrl: receiptDataVal,
          },
        });
    }

    // 2. Sync/Update with External API
    // If booking was not found locally, we ASSUME it exists remotely and try to update it.
    try {
        const { comercioApi } = await import("@/services/comercio-api");
        await comercioApi.updateBooking(bookingId, {
            receiptUrl: receiptDataVal,
            status: "PENDING" // Re-affirm status or let backend handle
        });
    } catch (apiError: any) {
        console.error("[EXTERNAL_API_SYNC_ERROR]", apiError);
        
        // If we didn't find it locally AND failed correctly remotely
        if (!booking) {
             return { error: `Erro ao localizar agendamento: ${apiError.message}` };
        }
        
        return { error: `Erro ao sincronizar com a barbearia: ${apiError.message}` };
    }

    revalidatePath("/bookings");
    return { success: true };
  } catch (error: any) {
    console.error("[UPLOAD_RECEIPT_ERROR]", error);
    return { error: `Erro ao enviar comprovante: ${error.message}` };
  }
}
