import { authPrisma } from "@/lib/prisma";

async function main() {
  console.log("Testing connection to Auth Database...");
  console.log("URL:", process.env.AUTH_DATABASE_URL?.substring(0, 20) + "...");
  
  try {
    const userCount = await authPrisma.user.count();
    console.log("Connection SUCCESS!");
    console.log("Number of users in Auth DB:", userCount);
  } catch (error) {
    console.error("Connection FAILED:", error);
  }
}

main();
