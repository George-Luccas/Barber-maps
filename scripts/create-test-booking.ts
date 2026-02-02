
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "georgeluccas300@gmail.com"; 
  console.log(`Finding user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error("User not found! Cannot create booking.");
    return;
  }

  // Get first shop and service
  const shop = await prisma.barbershop.findFirst();
  const service = await prisma.barbershopService.findFirst();

  if (!shop || !service) {
      console.error("No shop or service found. Please seed shops first.");
      // Check if we need to seed shops?
      const shopCount = await prisma.barbershop.count();
      console.log(`Shops: ${shopCount}`);
      return;
  }

  console.log(`Creating booking for ${user.name} at ${shop.name} for ${service.name}`);

  const booking = await prisma.booking.create({
      data: {
          userId: user.id,
          barbershopId: shop.id,
          serviceId: service.id,
          date: new Date(), // Today
          status: "CONFIRMED",
          userName: user.name,
      }
  });

  console.log(`Created booking ID: ${booking.id}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
