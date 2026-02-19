
import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
     const { id } = await params;
    // NOTE: In production/remote scenario, validate API Key
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
    // if (apiKey !== process.env.COMERCIO_API_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { receiptUrl, status } = body;

    console.log(`[API] Updating booking ${id}`, body);

    const booking = await db.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        receiptUrl: receiptUrl !== undefined ? receiptUrl : undefined,
        status: status !== undefined ? status : undefined,
      },
    });

    console.log(`[API] Booking updated: ${updatedBooking.id}`);

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error: any) {
    console.error("[API] Update Booking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
