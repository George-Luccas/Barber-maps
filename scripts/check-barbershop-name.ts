
import { prisma } from "@/lib/prisma";

async function main() {
  const shopId = "099d3846-2648-41be-bde3-8bcdfc741a0c";
  const shop = await prisma.barbershop.findUnique({
    where: { id: shopId }
  });
  console.log("Shop Info:", shop);
}

main();
