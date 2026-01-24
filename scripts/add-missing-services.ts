import { PrismaClient } from "@prisma/client";
import { calculateServicePoints } from "../lib/loyalty-points";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting update of missing services...");

  const barbershops = await prisma.barbershop.findMany();
  console.log(`Found ${barbershops.length} barbershops.`);

  const missingServices = [
    {
        name: "Pigmentação",
        description: "Realce e definição para barba e cabelo.",
        price: 45.00,
        imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png" // Reusing eyebrow image or similar placeholder for now
    },
    {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.00,
        imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png"
    }
  ];

  for (const shop of barbershops) {
      console.log(`Checking shop: ${shop.name} (${shop.id})`);

      for (const serviceTemplate of missingServices) {
          const existing = await prisma.barbershopService.findFirst({
              where: {
                  barbershopId: shop.id,
                  name: serviceTemplate.name
              }
          });

          const autoPoints = calculateServicePoints(serviceTemplate.name, serviceTemplate.price);

          if (!existing) {
              console.log(`  + Adding missing: ${serviceTemplate.name} (${autoPoints} pts)`);
              await prisma.barbershopService.create({
                  data: {
                      name: serviceTemplate.name,
                      description: serviceTemplate.description,
                      priceInCents: serviceTemplate.price * 100,
                      imageUrl: serviceTemplate.imageUrl,
                      barbershopId: shop.id,
                      points: autoPoints
                  }
              });
          } else {
              // Optional: Update points if they differ from the new rule?
              if (existing.points !== autoPoints) {
                  console.log(`  ~ Updating points for ${serviceTemplate.name}: ${existing.points} -> ${autoPoints}`);
                  await prisma.barbershopService.update({
                      where: { id: existing.id },
                      data: { points: autoPoints }
                  });
              }
          }
      }
  }

  console.log("Update complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
