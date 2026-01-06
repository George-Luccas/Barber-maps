
import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const users = await prisma.barber.findMany({
    where: {
        name: { contains: "George", mode: "insensitive" }
    },
    select: { id: true, name: true, email: true }
  });
  
  if (users.length > 0) {
      console.log(`FOUND_BARBER: ${users[0].id} | ${users[0].name} | ${users[0].email}`);
  } else {
      console.log("NO_BARBER_FOUND");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
