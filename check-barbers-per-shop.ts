// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkBarbersPerShop() {
  try {
    const barbershops = await prisma.barbershop.findMany({
      include: {
        _count: {
          select: { Barber: true },
        },
        Barber: {
            select: { name: true }
        }
      },
    });

    console.log("Barbers per Shop:");
    barbershops.forEach((shop) => {
      console.log(`- ${shop.name} (ID: ${shop.id}): ${shop._count.Barber} barbers`);
      console.log(`  Names: ${shop.Barber.map(b => b.name).join(", ")}`);
    });

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkBarbersPerShop();
