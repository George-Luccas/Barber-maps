
import { prisma } from "@/lib/prisma";

async function main() {
  const email = "georgeluccas300@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
        bookings: { take: 5 }
    }
  });

  if (!user) {
    console.log(`User ${email} not found.`);
  } else {
    console.log("User Found:");
    console.log(JSON.stringify(user, null, 2));
  }
  
  // Also check if 54 exists
  const user54 = await prisma.user.findUnique({
      where: { email: "georgeluccas54@gmail.com" }
  });
  console.log("\nUser 54:");
  console.log(user54 ? JSON.stringify(user54, null, 2) : "Not found locally");
}

main();
