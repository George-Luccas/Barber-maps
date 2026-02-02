
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const shopCount = await prisma.barbershop.count();
    const serviceCount = await prisma.service.count();
    const userCount = await prisma.user.count();
    
    console.log("--- DB Status ---");
    console.log(`Shops: ${shopCount}`);
    console.log(`Services: ${serviceCount}`);
    console.log(`Users: ${userCount}`);

    if (shopCount > 0) {
        const firstShop = await prisma.barbershop.findFirst();
        console.log("First Shop ID:", firstShop?.id);
    }

  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
