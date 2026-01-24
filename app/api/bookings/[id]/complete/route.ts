import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { incrementLoyalty } from "@/app/_actions/loyalty";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // 1. Verify Booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status === "COMPLETED") {
       return NextResponse.json(
        { message: "Booking already completed" },
        { status: 200 }
      );
    }

    // 2. Mark as Completed
    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: "COMPLETED",
            updatedAt: new Date()
        }
    });

    // 3. Increment Loyalty Points (Trigger automatic logic)
    const loyaltyResult = await incrementLoyalty(bookingId);

    if (loyaltyResult?.success === false) {
        console.error("Failed to increment loyalty:", loyaltyResult.error);
        // We still return success for the booking completion, but maybe warn?
    }

    return NextResponse.json({
      success: true,
      message: "Booking completed and points credited.",
      loyalty: loyaltyResult
    });

  } catch (error) {
    console.error("Error completing booking API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
