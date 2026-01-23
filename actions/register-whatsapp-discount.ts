"use server";

import { z } from "zod";
import { protectedActionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { sendContactsExportEmail } from "@/lib/email";

const inputSchema = z.object({
  phone: z.string().min(10, "Número de WhatsApp inválido"),
});

export const registerWhatsappDiscount = protectedActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { phone }, ctx: { user } }) => {
    // Verificar se o usuário já resgatou o desconto
    const dbUser = (await prisma.user.findUnique({
      where: { id: user.id },
    })) as any;

    if (dbUser?.welcomeDiscountClaimed) {
      throw new Error("Você já resgatou o seu desconto de boas-vindas.");
    }

    // Verificar se o número já existe (requisito: sem repetir números)
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: phone,
      },
    });

    if (existingPhone) {
      throw new Error("Este número de WhatsApp já foi cadastrado.");
    }

    // Atualizar o usuário com o telefone e marcar o desconto como resgatado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phone: phone,
        welcomeDiscountClaimed: true,
      } as any,
    });

    // Lógica de exportação automática (100 contatos)
    const contactsToExport = await prisma.user.findMany({
      where: {
        phone: { not: null },
        phoneExportedAt: null,
      },
    });

    if (contactsToExport.length >= 100) {
      try {
        await sendContactsExportEmail(contactsToExport);

        // Marcar como exportado
        await prisma.user.updateMany({
          where: {
            id: {
              in: contactsToExport.map((u: any) => u.id),
            },
          },
          data: {
            phoneExportedAt: new Date(),
          } as any,
        });
      } catch (error) {
        console.error("Erro ao exportar contatos:", error);
        // Não jogamos erro aqui para não travar o cadastro do usuário
      }
    }

    return { success: true };
  });
