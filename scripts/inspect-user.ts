
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // Assuming you use bcryptjs, need to verify.
// Better-auth handles password hashing internally usually. 
// Let's just check if user exists first.

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Inspecting user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("User NOT found in DB.");
  } else {
    console.log("User Found:");
    console.log(`- ID: ${user.id}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Password set: ${user.password ? "YES" : "NO"}`);
    // console.log(`- Accounts: ${user.account.length}`);
  }
}

main();
