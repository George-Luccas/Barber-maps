
import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Deleting user with email: ${email}`);
  
  try {
      await prisma.user.delete({
        where: { email }
      });
      console.log("✅ User deleted successfully.");
  } catch (e) {
      console.log("User not found or already deleted.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
