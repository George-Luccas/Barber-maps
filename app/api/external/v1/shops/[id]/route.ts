
import { startOfDay, addMinutes, format } from "date-fns"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.COMERCIO_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const barbershop = await prisma.barbershop.findUnique({
      where: { id },
      include: {
        Style: true,
        BarbershopProduct: true,
      },
    })

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbershop not found" },
        { status: 404 },
      )
    }

    const result = {
      id: barbershop.id,
      name: barbershop.name,
      address: barbershop.address,
      description: barbershop.description,
      imageUrl: barbershop.imageUrl || "",
      phones: barbershop.phones,
      city: barbershop.city || "",
      isOpen: barbershop.isOpen,
      latitude: barbershop.latitude || 0,
      longitude: barbershop.longitude || 0,
      photos: barbershop.photos,
      styles: barbershop.Style.map((s) => ({
        id: s.id,
        name: s.name,
        imageUrl: s.imageUrl,
      })),
      products: barbershop.BarbershopProduct.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        priceInCents: p.priceInCents,
        quantity: p.quantity,
      })),
      aboutUs: barbershop.aboutUs || undefined,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[GET_SHOP_DETAILS]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
