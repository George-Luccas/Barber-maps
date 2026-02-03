
import { prisma } from "@/lib/prisma";

async function main() {
  const userId = "pmvtzsVXPoKdzA7y8MCfbtCbEt1RwRcZ";
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });
  console.log("!!!EMAIL_START!!!");
  console.log(user?.email);
  console.log("!!!EMAIL_END!!!");
}

main();
