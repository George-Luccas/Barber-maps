
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.barbershop.deleteMany({});
        console.log(`Successfully deleted ${result.count} barbershops.`);
    } catch (e) {
        console.error("Error deleting barbershops:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
