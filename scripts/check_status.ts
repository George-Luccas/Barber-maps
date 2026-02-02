
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const email = "georgeluccas300@gmail.com";
  console.log(`User: ${email}`);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return console.log("User not found");

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    select: { id: true, status: true, barbershopId: true, date: true }
  });
  
  if (bookings.length === 0) console.log("No bookings");
  
  bookings.forEach(b => {
      console.log(`ID: ${b.id} | Shop: ${b.barbershopId} | Status: >${b.status}< | Date: ${b.date}`);
  });
}

check().finally(() => prisma.$disconnect());
