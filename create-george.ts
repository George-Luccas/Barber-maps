
import "dotenv/config";
import { authPrisma } from "./lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  const id = "bf056478-433d-417f-8f2f-3151e6eb8112";
  const name = "George Luccas";
  const email = "george@barbermaps.com"; // Default email
  const passwordPlain = "123456789";

  console.log(`Creating/Updating user: ${name} (${id})`);

  const hashedPassword = await hash(passwordPlain, 10);

  // Upsert: Create if missing, Update if exists
  const user = await authPrisma.user.upsert({
    where: { id },
    update: {
      password: hashedPassword,
      name: name, // Ensure name is correct
    },
    create: {
      id,
      name,
      email,
      password: hashedPassword,
      role: "BARBER",
      emailVerified: true
    }
  });

  console.log(`✅ User Upserted: ${user.name}`);
  console.log(`✅ Password set to: ${passwordPlain}`);
  console.log(`✅ Email set to: ${user.email}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    // If email conflict, maybe try another email?
  })
  .finally(() => authPrisma.$disconnect());
