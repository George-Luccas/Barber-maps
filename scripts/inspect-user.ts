import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Inspecting user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
      sessions: true,
    }
  });

  if (!user) {
    console.log("User NOT FOUND.");
    return;
  }

  console.log("User Record:");
  console.log({
    id: user.id,
    email: user.email,
    passwordHash: user.password, // Let's see if it's there
    emailVerified: user.emailVerified,
    role: user.role,
  });

  console.log("Linked Accounts:");
  user.accounts.forEach(acc => {
    console.log({
      id: acc.id,
      providerId: acc.providerId,
      accountId: acc.accountId,
      password: acc.password, // Check if local accounts have it here
    });
  });

  console.log("Active Sessions:", user.sessions.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
