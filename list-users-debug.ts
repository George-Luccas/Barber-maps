
import "dotenv/config";
import { authPrisma } from "./lib/prisma";

async function main() {
  console.log("Auth DB URL:", process.env.AUTH_DATABASE_URL ? "Loaded" : "Missing");
  console.log("Listing all users...");
  const users = await authPrisma.user.findMany();
  
  if (users.length === 0) {
    console.log("No users found in database.");
  } else {
    console.table(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
  }
}

main()
  .catch(console.error)
  .finally(() => authPrisma.$disconnect());
