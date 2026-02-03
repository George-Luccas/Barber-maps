
import { prisma } from "@/lib/prisma";

async function main() {
  const userId = "pmvtzsVXPoKdzA7y8MCfbtCbEt1RwRcZ";
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  console.log("User by ID:", JSON.stringify(user, null, 2));
}

main();
