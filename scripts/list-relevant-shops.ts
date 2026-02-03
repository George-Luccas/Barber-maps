
import { prisma } from "@/lib/prisma";

async function main() {
  const shops = await prisma.barbershop.findMany({
    select: { name: true, id: true } 
  });
  
  const relevantShops = shops.filter(s => 
    s.name.toLowerCase().includes("car") || 
    s.name.toLowerCase().includes("barber")
  );

  console.log("--- MATCHING SHOPS ---");
  if (relevantShops.length === 0) {
      console.log("No shops found matching 'car' or 'barber'.");
  } else {
      relevantShops.forEach(s => console.log(`FOUND: ${s.name} [${s.id}]`));
  }
}

main();
