
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("Checking local database for 'Car barber' values...");
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
      console.log(`Description: ${shop.description}`);
      console.log(`AboutUs: ${shop.aboutUs}`);
      console.log(`\n!!! LOCAL ID: ${shop.id} !!!`);
  } else {
      console.log("❌ Not found in LOCAL DB.");
  }
}

main();
