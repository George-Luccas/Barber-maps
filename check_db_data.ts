
import { prisma } from "@/lib/prisma";
import fs from 'fs';

async function main() {
    const total = await prisma.barbershop.count();
    const withstate = await prisma.barbershop.count({
        where: {
            state: { not: null }
        }
    });
    const withCity = await prisma.barbershop.count({
        where: {
            city: { not: null }
        }
    });

    const output = `
Total Barbershops: ${total}
With State: ${withstate}
With City: ${withCity}
`;
    console.log(output);
    fs.writeFileSync('data-check.log', output);

    if (withstate > 0) {
        const locations = await prisma.barbershop.findMany({
            select: { name: true, city: true, state: true },
            take: 5
        });
        fs.appendFileSync('data-check.log', JSON.stringify(locations, null, 2));
    }
}

main()
    .catch(e => {
        console.error(e);
        fs.writeFileSync('data-check.log', `Error: ${e.message}`);
        process.exit(1);
    })
    .finally(async () => {
        // await prisma.$disconnect();
    });
