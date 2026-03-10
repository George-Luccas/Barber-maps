
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("Checking local database for 'Car barber'...");
  const shop = await prisma.barbershop.findFirst({
      where: {
          name: {
              contains: "Car",
              mode: "insensitive"
          }
      }
  });

  if (shop) {
      console.log("✅ Found in LOCAL DB:");
      console.log(`ID: ${shop.id}`);
      console.log(`Name: ${shop.name}`);
      // Check if it has any unexpected fields via keys
      console.log("Keys:", Object.keys(shop));
  } else {
      console.log("❌ Not found in LOCAL DB.");
  }
}

main();
