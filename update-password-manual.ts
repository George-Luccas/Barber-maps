
import { prisma } from "./lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  const targetName = "George Luccas";
  const newPasswordPlain = "123456789";

  console.log(`Searching for user with name: ${targetName}`);

  // Find user (case insensitive search if possible, but distinct names usually work)
  // Using findFirst since name isn't unique constraint, email is.
  // But request asked by name.
  const user = await prisma.user.findFirst({
    where: {
      name: {
        contains: targetName,
        mode: 'insensitive'
      }
    }
  });

  if (!user) {
    console.log("❌ User not found!");
    return;
  }

  console.log(`✅ User found: ${user.name} (${user.email}) - ID: ${user.id}`);

  // Hash password
  // cost factor 10 is standard
  const hashedPassword = await hash(newPasswordPlain, 10);
  console.log("Password hashed.");

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword
    }
  });

  console.log(`✅ Password updated successfully to "${newPasswordPlain}" for user ${user.name}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
