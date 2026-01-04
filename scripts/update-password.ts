
// @ts-ignore
import { PrismaClient } from "../generated/auth-client";
// @ts-ignore
import { hashPassword } from "better-auth/crypto";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const email = "georgeluccas300@gmail.com";
  const newPassword = "123456789";

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

  console.log(`Upserting user...`);
  const crypto = await import("crypto");
  
  const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
          id: crypto.randomUUID(),
          email,
          password: hashedPassword,
          name: "George Luccas",
          role: "ADMIN",
          emailVerified: true,
          updatedAt: new Date(),
      }
  });

  console.log("Password updated/User created successfully for:", user.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
