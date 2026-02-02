
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const userId = "pmvtzsVXPoKdzA7y8MCfbtCbEt1RwRcZ";
  const barbershopId = "099d3846-2648-41be-bde3-8bcdfc741a0c";

  console.log(`Checking matching for User ${userId} and Shop ${barbershopId}`);

  const hasCompletedBooking = await prisma.booking.findFirst({
    where: {
      userId,
      barbershopId,
      status: "COMPLETED"
    }
  });

  if (hasCompletedBooking) {
      console.log("FOUND IT!");
      console.log(hasCompletedBooking);
  } else {
      console.log("DID NOT FIND IT.");
      // Check partial matches
      const byUser = await prisma.booking.count({ where: { userId } });
      const byShop = await prisma.booking.count({ where: { barbershopId } });
      const byBoth = await prisma.booking.count({ where: { userId, barbershopId } });
      console.log(`Debug: User has ${byUser} bookings. Shop has ${byShop} bookings. Both have ${byBoth}.`);
  }
}

check().finally(() => prisma.$disconnect());
