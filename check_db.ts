
import { prisma } from './lib/prisma';

async function checkBarbershops() {
  const barbershops = await prisma.barbershop.findMany();
  console.log('Total barbershops:', barbershops.length);
  barbershops.forEach(b => {
    console.log(`- ${b.name} (ID: ${b.id}, Manager: ${b.managerId})`);
  });
}

checkBarbershops()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
