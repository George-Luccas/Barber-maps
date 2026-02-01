
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay, setHours, setMinutes, addMinutes, format, isBefore } from "date-fns"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.COMERCIO_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get("date")

  if (!dateParam) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 })
  }

  try {
    const barbershop = await prisma.barbershop.findUnique({
      where: { id },
    })

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbershop not found" },
        { status: 404 },
      )
    }

    const date = new Date(dateParam)
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)

    // Get bookings for the day
    const bookings = await prisma.booking.findMany({
      where: {
        barbershopId: id,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
            not: "CANCELLED"
        }
      },
    })

    // Generate slots
    const slots: string[] = []
    let currentTime = setMinutes(setHours(dayStart, 9), 0) // Start at 9:00
    const endTime = setMinutes(setHours(dayStart, 21), 0) // End at 21:00

    // Adjust based on barbershop hours if available (could be added dynamically)
    // For now using fixed 9-21

    const timeInterval = 45 // minutes

    while (isBefore(currentTime, endTime)) {
        const slotTime = format(currentTime, "HH:mm")
        
        // Check if slot is taken
        const isTaken = bookings.some(booking => {
            return format(booking.date, "HH:mm") === slotTime
        })

        if (!isTaken) {
            slots.push(slotTime)
        }

        currentTime = addMinutes(currentTime, timeInterval)
    }

    return NextResponse.json({
        date: dateParam,
        availableSlots: slots
    })

  } catch (error) {
    console.error("[GET_SHOP_AVAILABILITY]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
