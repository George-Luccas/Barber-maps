
import { prisma } from "../lib/prisma";

async function main() {
  try {
    console.log("Testing Prisma Connection...");
    const count = await prisma.barbershop.count();
    console.log(`Successfully connected! Found ${count} barbershops.`);
    
    const shop = await prisma.barbershop.findFirst();
    if (shop) {
        console.log("First shop:", shop.name);
        console.log("Coordinates:", shop.latitude, shop.longitude);
    }
  } catch (error) {
    console.error("Connection Failed:", error);
    process.exit(1);
  } finally {
    // Force disconnect to not hang
    process.exit(0); 
  }
}

main();
