
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkBarbers() {
  try {
    const count = await prisma.barber.count();
    console.log(`Total Barbers in DB: ${count}`);
    
    if (count === 0) {
        console.log("WARNING: No barbers found. 'Any Professional' availability logic will return 0 slots.");
    } else {
        const barbers = await prisma.barber.findMany({ take: 3, select: { name: true, barbershopId: true } });
        console.log("Sample barbers:", barbers);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkBarbers();
