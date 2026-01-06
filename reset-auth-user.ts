
import "dotenv/config";
import { authPrisma } from "./lib/prisma";

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Deleting user with email: ${email}`);
  
  try {
      await authPrisma.user.delete({
        where: { email }
      });
      console.log("✅ User deleted successfully.");
  } catch (e) {
      console.log("User not found or already deleted.");
  }
}

main()
  .catch(console.error)
  .finally(() => authPrisma.$disconnect());
