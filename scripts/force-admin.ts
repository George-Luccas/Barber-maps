
import { prisma } from "@/lib/prisma";

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Checking user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log("User not found in DB.");
    return;
  }

  console.log(`Current role: ${user.role}`);

  if (user.role !== "ADMIN") {
    console.log("Updating to ADMIN...");
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    });
    console.log("Updated successfully.");
  } else {
    console.log("User is already ADMIN.");
  }
}

main();
