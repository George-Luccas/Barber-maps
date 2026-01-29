"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function getUserFavorites() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return []
  }

  const favorites = await prisma.userFavorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      barbershop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return favorites.map((fav) => ({
      ...fav.barbershop,
      dailyGoal: Number(fav.barbershop.dailyGoal)
  }))
}

export async function toggleFavoriteBarbershop(barbershopId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error("Você precisa estar logado para favoritar.")
  }

  const existingFavorite = await prisma.userFavorite.findUnique({
    where: {
      userId_barbershopId: {
        userId: session.user.id,
        barbershopId,
      },
    },
  })

  if (existingFavorite) {
    await prisma.userFavorite.delete({
      where: {
        userId_barbershopId: {
          userId: session.user.id,
          barbershopId,
        },
      },
    })
  } else {
    await prisma.userFavorite.create({
      data: {
        userId: session.user.id,
        barbershopId,
      },
    })
  }

  revalidatePath("/profile")
  revalidatePath(`/barbershops/${barbershopId}`)
}

const updateUserSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  phone: z.string().optional().nullable(),
  image: z.string().optional().nullable(), // Base64 string or URL
  coverImage: z.string().optional().nullable(), // Base64 string or URL
  imagePosition: z.string().optional(),
  coverImagePosition: z.string().optional(),
})

export async function updateUserProfile(data: z.infer<typeof updateUserSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error("Você precisa estar logado para editar o perfil.")
  }

  const validatedData = updateUserSchema.parse(data)

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: validatedData.name,
      phone: validatedData.phone,
      ...(validatedData.image && { image: validatedData.image }),
      ...(validatedData.coverImage && { coverImage: validatedData.coverImage }),
      ...(validatedData.imagePosition && { imagePosition: validatedData.imagePosition }),
      ...(validatedData.coverImagePosition && { coverImagePosition: validatedData.coverImagePosition }),
    },
  })

  revalidatePath("/profile")
}

export async function getUserStats() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    
    if (!session?.user) {
        return {
            bookingsCount: 0,
            favoritesCount: 0,
            reviewsCount: 0,
        }
    }

    const bookingsCount = await prisma.booking.count({
        where: {
            userId: session.user.id,
        }
    })

    const favoritesCount = await prisma.userFavorite.count({
        where: {
            userId: session.user.id,
        }
    })

    // Placeholder for reviews potentially
    const reviewsCount = 0

    return {
        bookingsCount,
        favoritesCount,
        reviewsCount
    }
}
