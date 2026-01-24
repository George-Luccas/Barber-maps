import { prisma } from "./lib/prisma";

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Checking role for user: ${email}`);
  
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log("❌ User not found in database.");
  } else {
    console.log(`✅ User found: ${user.name}`);
    console.log(`Current Role: ${user.role}`);
    console.log(`ID: ${user.id}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
