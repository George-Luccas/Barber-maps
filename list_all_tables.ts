
// turbo-all
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Querying database for all table names...");
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log("Tables found in DB:");
    console.table(result);
  } catch (error) {
    console.error("Error querying tables:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
