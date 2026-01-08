
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const services = await prisma.barbershopService.findMany({
      select: { name: true, id: true }
  });
  console.log("Services Found:", services);
  
  console.log("--- Testing Logic ---");
  services.forEach(s => {
      const name = s.name.toLowerCase();
      const eligible = name.includes("corte") && !name.includes("combo");
      console.log(`Service: "${s.name}" -> Eligible: ${eligible}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
