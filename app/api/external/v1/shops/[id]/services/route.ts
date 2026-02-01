
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
        services: {
            where: {
                deletedAt: null
            }
        },
        Barber: true,
      },
    })

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbershop not found" },
        { status: 404 },
      )
    }

    const services = barbershop.services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      imageUrl: s.imageUrl,
      priceInCents: s.priceInCents,
      points: s.points,
    }))

    const barbers = barbershop.Barber.map((b) => ({
      id: b.id,
      name: b.name,
      imageUrl: b.imageUrl || "",
    }))

    return NextResponse.json({ services, barbers })
  } catch (error) {
    console.error("[GET_SHOP_SERVICES]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
