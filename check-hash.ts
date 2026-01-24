
import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "george@barbermaps.com" }
  });
  console.log("Current Password Hash:", user?.password);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
