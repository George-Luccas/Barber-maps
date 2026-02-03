
import { prisma } from "@/lib/prisma";
import fs from 'fs';

async function main() {
  const shops = await prisma.barbershop.findMany({
    select: { name: true, id: true } 
  });
  
  const relevantShops = shops.filter(s => 
    s.name.toLowerCase().includes("car") || 
    s.name.toLowerCase().includes("barber")
  );

  let content = "--- MATCHING SHOPS ---\n";
  if (relevantShops.length === 0) {
      content += "No shops found matching 'car' or 'barber'.\n";
  } else {
      relevantShops.forEach(s => content += `FOUND: ${s.name} [${s.id}]\n`);
  }
  
  fs.writeFileSync('shops_list.txt', content);
  console.log("Wrote to shops_list.txt");
}

main();
