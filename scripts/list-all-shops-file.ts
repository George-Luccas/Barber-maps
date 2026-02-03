
import { prisma } from "@/lib/prisma";
import fs from 'fs';

async function main() {
  const shops = await prisma.barbershop.findMany({
    select: { name: true, id: true } 
  });
  
  let content = "--- ALL SHOPS ---\n";
  shops.forEach(s => content += `FOUND: ${s.name} [${s.id}]\n`);
  
  fs.writeFileSync('all_shops_list.txt', content);
  console.log("Wrote to all_shops_list.txt");
}

main();
