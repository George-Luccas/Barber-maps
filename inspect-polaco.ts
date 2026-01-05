
import { prisma } from "./lib/prisma";

async function main() {
  console.log("Searching for 'Polaco'...");
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      name: {
        contains: "Polaco",
        mode: "insensitive"
      }
    },
    include: {
      Barber: true
    }
  });

  if (!barbershop) {
    console.log("Barbearia Polaco NOT FOUND.");
    
    // List all to see what exists
    const all = await prisma.barbershop.findMany({ select: { name: true } });
    console.log("Available shops:", all.map(b => b.name));
    return;
  }

  console.log(`Found: ${barbershop.name} (${barbershop.id})`);
  console.log("Barbers count:", barbershop.Barber.length);
  console.log("Barbers:", JSON.stringify(barbershop.Barber, null, 2));

  // Check if there are ANY barbers in the system not linked?
  const totalBarbers = await prisma.barber.count();
  console.log("Total barbers in system:", totalBarbers);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
