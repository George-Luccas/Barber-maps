
// Import from the custom generated client
// @ts-ignore
import { PrismaClient } from "../generated/auth-client";
import dotenv from "dotenv";

dotenv.config();

// Manually instantiate 
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL,
    },
  },
});

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Checking user: ${email}`);
  console.log(`DB URL available: ${!!process.env.AUTH_DATABASE_URL}`);
  
  // @ts-ignore
  const user = await prisma.user.findUnique({
      where: { email }
  });

  if (user) {
      console.log("User found!");
      console.log("Password Hash:", user.password);
  } else {
      console.log("User NOT found.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
