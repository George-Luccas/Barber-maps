
import { authPrisma } from "@/lib/prisma";

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Deleting user from AUTH DB: ${email}...`);

  try {
    const user = await authPrisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log("User not found in Auth DB.");
      return;
    }

    // Delete related sessions and accounts manually
    await authPrisma.session.deleteMany({ where: { userId: user.id } });
    await authPrisma.account.deleteMany({ where: { userId: user.id } });
    
    // Delete the user
    await authPrisma.user.delete({
      where: { email }
    });

    console.log("User deleted successfully from AUTH DB.");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

main();
