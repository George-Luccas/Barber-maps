
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkBookings() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Checking bookings for email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log(`User ID: ${user.id}`);

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { barbershop: true }
  });

  if (bookings.length === 0) {
    console.log("No bookings found for this user.");
  } else {
    console.log(`Found ${bookings.length} bookings:`);
    bookings.forEach(b => {
      console.log(`--------------------------------------------------`);
      console.log(`Booking ID: ${b.id}`);
      console.log(`Barbershop: ${b.barbershop.name} (${b.barbershopId})`);
      console.log(`Date: ${b.date}`);
      console.log(`Status: '${b.status}'`);  // Quotes to see if there's whitespace
      console.log(`Date object:`, b.date);
      
      const isPast = new Date(b.date) < new Date();
      console.log(`Is Past Date: ${isPast}`);
    });
  }
}

checkBookings()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
