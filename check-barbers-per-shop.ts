
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkBarbersPerShop() {
  try {
    const barbershops = await prisma.barbershop.findMany({
      include: {
        _count: {
          select: { barbers: true },
        },
        barbers: {
            select: { name: true }
        }
      },
    });

    console.log("Barbers per Shop:");
    barbershops.forEach((shop) => {
      console.log(`- ${shop.name} (ID: ${shop.id}): ${shop._count.barbers} barbers`);
      console.log(`  Names: ${shop.barbers.map(b => b.name).join(", ")}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkBarbersPerShop();
