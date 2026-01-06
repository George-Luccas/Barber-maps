
import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const users = await prisma.barber.findMany({
    where: {
        name: { contains: "George", mode: "insensitive" }
    }
  });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
