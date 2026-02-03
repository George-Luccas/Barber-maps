
import { prisma } from "@/lib/prisma";
import fs from "fs";

async function main() {
  const userId = "pmvtzsVXPoKdzA7y8MCfbtCbEt1RwRcZ";
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });
  fs.writeFileSync("email.txt", user?.email || "NOT FOUND");
}

main();
