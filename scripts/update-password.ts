
// @ts-ignore
import { PrismaClient } from "../generated/auth-client";
// @ts-ignore
import { hashPassword } from "better-auth";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL,
    },
  },
});

async function main() {
  const email = "georgeluccas300@gmail.com";
  const newPassword = "12345";

  console.log(`Hashing password for: ${email}`);
  
  // Use better-auth hasher if available, or fallback if import fails
  let hashedPassword;
  try {
      hashedPassword = await hashPassword(newPassword);
      console.log("Hashed using better-auth");
  } catch (e) {
      console.log("better-auth hashPassword not found/failed, falling back to manual scrypt?");
      console.error(e);
      process.exit(1);
  }

  console.log(`Updating user...`);
  const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
  });

  console.log("Password updated successfully for:", user.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
