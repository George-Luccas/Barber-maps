
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "georgeluccas300@gmail.com"; // User from previous context
  console.log(`Searching for user with email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
        sessions: true,
        accounts: true
    }
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log("User found:", user.id, user.name);

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { barbershop: true }
  });

  console.log(`Found ${bookings.length} bookings for user.`);
  if (bookings.length > 0) {
      console.log("First booking:", bookings[0].id, bookings[0].date, bookings[0].barbershop.name);
  } else {
      console.log("Checking if there are ANY bookings in DB...");
      const count = await prisma.booking.count();
      console.log(`Total bookings in DB: ${count}`);
      if (count > 0) {
          const sample = await prisma.booking.findFirst();
          console.log("Sample booking UserID:", sample?.userId);
          console.log("Does it match user?", sample?.userId === user.id);
      }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
