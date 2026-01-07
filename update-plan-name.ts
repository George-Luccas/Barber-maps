
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.plan.findFirst();
  if (plan) {
    await prisma.plan.update({
        where: { id: plan.id },
        data: { name: "Plano Navalha" }
    });
    console.log("Plan renamed to Plano Navalha");
  } else {
    console.log("No plan found to update.");
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
