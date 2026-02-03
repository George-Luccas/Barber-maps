
import { prisma } from "@/lib/prisma";

async function main() {
  const shops = await prisma.barbershop.findMany({
    select: { name: true, id: true }
  });
  console.log("All Shops:");
  shops.forEach(s => console.log(`- ${s.name} [${s.id}]`));
}

main();
