import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, id: true, name: true }
  });
  console.log('Listando todos os emails no banco:');
  users.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
}

main().finally(() => prisma.$disconnect());
