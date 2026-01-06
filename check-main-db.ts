
import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  console.log("Checking Main DB for Barbers...");
  const barbers = await prisma.barber.findMany();
  console.table(barbers.map(b => ({ id: b.id, name: b.name, email: b.email })));

  console.log("Checking Main DB for Barbershops...");
  const shops = await prisma.barbershop.findMany();
  console.table(shops.map(s => ({ id: s.id, name: s.name })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
