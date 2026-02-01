
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Diagnosing Booking Issue...");

  const email = "georgeluccas300@gmail.com";
  console.log(`Checking user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error("❌ User NOT found in database!");
    return;
  }
  console.log("✅ User found:", user.id, user.name);

  // Check Barbershops
  const shop = await prisma.barbershop.findFirst();
  if (!shop) {
    console.error("❌ No barbershops found!");
    return;
  }
  console.log("✅ Found Shop:", shop.name, shop.id);

  // Check Services
  const service = await prisma.barbershopService.findFirst({
    where: { barbershopId: shop.id }
  });
  if (!service) {
    console.error("❌ No services found for shop!");
    return;
  }
  console.log("✅ Found Service:", service.name, service.id);

  console.log("Attempting to simulate Booking creation (Prisma call)...");
  
  try {
      const booking = await prisma.booking.create({
          data: {
              barbershopId: shop.id,
              serviceId: service.id,
              userId: user.id,
              date: new Date(),
              status: "CONFIRMED",
              userName: user.name,
              isSubscription: false
              // barberId is optional
          }
      });
      console.log("✅ Prisma Booking Creation SUCCESS:", booking.id);
      
      // Clean up
      await prisma.booking.delete({ where: { id: booking.id } });
      console.log("✅ Diagnostic booking deleted.");
      
  } catch (error) {
      console.error("❌ Prisma Creation Failed:", error);
  }

}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
