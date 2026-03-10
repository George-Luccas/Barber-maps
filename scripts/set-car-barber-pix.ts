
import { prisma } from "@/lib/prisma";

async function main() {
  const shopName = "Car barber";
  const pixKey = "a4358c54-4785-4578-8647-136806848be2";

  console.log(`Updating/Creating '${shopName}' with Pix Key: ${pixKey}...`);

  // First, check if it exists
  const existing = await prisma.barbershop.findFirst({
      where: { name: { equals: shopName, mode: 'insensitive' } }
  });

  if (existing) {
      console.log(`Found existing shop (ID: ${existing.id}). Updating...`);
      await prisma.barbershop.update({
          where: { id: existing.id },
          data: { pixKey: pixKey }
      });
      console.log("✅ Updated successfully.");
  } else {
      console.log("Shop not found locally. Creating simple record...");
      await prisma.barbershop.create({
          data: {
              name: shopName,
              address: "Rua Exemplo, 123", // Dummy address
              description: "Barbearia Car Barber",
              phones: ["(11) 99999-9999"],
              pixKey: pixKey,
              imageUrl: "" // Optional
          }
      });
      console.log("✅ Created successfully.");
  }
}

main();
