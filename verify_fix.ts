
import { prisma } from "@/lib/prisma";

async function main() {
    try {
        const count = await prisma.barbershop.count();
        console.log(`Successfully checked database. Total Barbershops: ${count}`);
    } catch (e) {
        console.error("Error querying barbershops:", e);
        process.exit(1);
    }
}

main();
