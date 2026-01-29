
import { prisma } from "../lib/prisma";
import { compare } from "bcryptjs";

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Inspecting user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log("User found:", {
    id: user.id,
    email: user.email,
    passwordHash: user.password ? user.password.substring(0, 10) + "..." : "null",
    role: user.role,
  });

  console.log("Accounts:", user.accounts.map(a => ({
    id: a.id,
    providerId: a.providerId,
    passwordHash: a.password ? a.password.substring(0, 10) + "..." : "null",
  })));

  // Test password verification if provided
  // User tried "987654321" in screenshot.
  const testPass = "987654321";
  console.log(`Testing verification for password: ${testPass}`);
  
  if (user.password) {
      const matchUser = await compare(testPass, user.password);
      console.log(`Match against User.password: ${matchUser}`);
  }

  for (const acc of user.accounts) {
      if (acc.password) {
          const matchAcc = await compare(testPass, acc.password);
          console.log(`Match against Account(${acc.providerId}).password: ${matchAcc}`);
      }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
