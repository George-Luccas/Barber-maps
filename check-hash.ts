
import "dotenv/config";
import { authPrisma } from "./lib/prisma";

async function main() {
  const user = await authPrisma.user.findUnique({
    where: { email: "george@barbermaps.com" }
  });
  console.log("Current Password Hash:", user?.password);
}

main()
  .catch(console.error)
  .finally(() => authPrisma.$disconnect());
