"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreatePromotionParams {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  active?: boolean;
}

export const createPromotion = async (params: CreatePromotionParams) => {
  // TODO: Add proper server-side auth check here.
  // dependent on how auth headers are passed to server actions in this stack.
  // For now relying on client-side protection + awareness that this is an MVP.
  await prisma.promotion.create({
    data: params,
  });
  revalidatePath("/");
  revalidatePath("/admin/promotions");
};

export const deletePromotion = async (id: string) => {
  await prisma.promotion.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin/promotions");
};

export const getPromotions = async (onlyActive = true) => {
  if (onlyActive) {
      return await prisma.promotion.findMany({
          where: { active: true },
          orderBy: { createdAt: "desc" },
      });
  }
  return await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
  });
};
