
import { prisma } from "./lib/prisma";

async function main() {
  const barbershop = await prisma.barbershop.findFirst({
    include: {
      Barber: true
    }
  });

  if (!barbershop) {
    console.log("No barbershop found");
    return;
  }

  console.log("Barbershop:", barbershop.name);
  console.log("Barbers:", JSON.stringify(barbershop.Barber, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
