
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.plan.create({
    data: {
      name: "Plano Navalha",
      price: 55.00,
      service_limit: 2,
      description: "Assinatura Mensal: 2 Cortes por mês.",
      // stripePriceId will be updated later manually or via logic if we create it via API
    },
  });
  console.log("Plan created:", plan);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
