
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "georgeluccas300@gmail.com";
  
  /* 
   * FIX: Relations are missing in Prisma Schema for user -> bookings.
   * Querying bookings manually via findMany instead of include.
   */
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
      console.log("User not found");
      return;
  }

  const completedBookings = await prisma.booking.findMany({
      where: { 
          userId: user.id,
          status: "COMPLETED"
      },
      take: 5
  });

  console.log(`User ${user.name} has ${completedBookings.length} completed bookings.`);

  if (completedBookings.length === 0) {
      console.log("No completed bookings. Checking for ANY bookings to update...");
      const anyBooking = await prisma.booking.findFirst({
          where: { userId: user.id }
      });

      if (anyBooking) {
          console.log(`Found booking ${anyBooking.id} with status ${anyBooking.status}. Updating to COMPLETED...`);
          await prisma.booking.update({
              where: { id: anyBooking.id },
              data: { status: "COMPLETED" }
          });
          console.log("Updated to COMPLETED. User can now review.");
      } else {
          console.log("No bookings at all. User needs to book first.");
      }
  } else {
      console.log("User already has completed bookings. Review should work.");
       completedBookings.forEach(b => console.log(`- ${b.id} (${b.date})`));
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
