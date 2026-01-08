
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingPlan = await prisma.plan.findFirst();

  if (existingPlan) {
      console.log("Plan already exists. Updating...");
      const updatedPlan = await prisma.plan.update({
          where: { id: existingPlan.id },
          data: {
              name: "Plano Navalha",
              price: 55.00,
              service_limit: 2,
              description: "Assinatura Mensal: 2 Cortes por mês.",
          }
      });
      console.log("Plan updated:", updatedPlan);
  } else {
      console.log("Creating new plan...");
      const plan = await prisma.plan.create({
        data: {
          name: "Plano Navalha",
          price: 55.00,
          service_limit: 2,
          description: "Assinatura Mensal: 2 Cortes por mês.",
        },
      });
      console.log("Plan created:", plan);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
