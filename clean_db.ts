
import { prisma } from './lib/prisma';

const fakeNames = [
  "Barbearia Vintage",
  "Corte & Estilo",
  "Barba & Navalha",
  "The Dapper Den",
  "Cabelo & Cia.",
  "Machado & Tesoura",
  "Barbearia Elegance",
  "Aparência Impecável",
  "Estilo Urbano",
  "Estilo Clássico",
];

async function cleanDatabase() {
  console.log('Starting cleanup...');
  
  const result = await prisma.barbershop.deleteMany({
    where: {
      name: {
        in: fakeNames
      }
    }
  });

  console.log(`Deleted ${result.count} fake barbershops.`);

  const remaining = await prisma.barbershop.count();
  console.log(`Remaining barbershops in DB: ${remaining}`);
}

cleanDatabase()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
