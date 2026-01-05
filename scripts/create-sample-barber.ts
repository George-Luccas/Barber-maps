
import { prisma } from "../lib/prisma";

async function main() {
  const barbershop = await prisma.barbershop.findFirst();

  if (!barbershop) {
    console.log("No barbershop found");
    return;
  }

  const barber = await prisma.barber.create({
    data: {
      id: "sample-barber-1",
      name: "João o Barbeiro",
      barbershopId: barbershop.id,
      updatedAt: new Date()
    }
  });

  console.log("Created sample barber:", barber.name);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
