
import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const barbershopCount = await prisma.barbershop.count();
  const barberCount = await prisma.barber.count();
  const serviceCount = await prisma.barbershopService.count();

  console.log(`DATA_CHECK: Barbershops: ${barbershopCount} | Barbers: ${barberCount} | Services: ${serviceCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
