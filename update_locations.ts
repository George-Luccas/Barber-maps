
import { prisma } from "@/lib/prisma";

async function main() {
    const barbershops = await prisma.barbershop.findMany();
    
    if (barbershops.length === 0) {
        console.log("No barbershops found to update.");
        return;
    }

    console.log(`Found ${barbershops.length} barbershops. Updating locations...`);

    // Update first one to SP
    if (barbershops[0]) {
        await prisma.barbershop.update({
            where: { id: barbershops[0].id },
            data: {
                city: "São Paulo",
                state: "SP"
            }
        });
        console.log(`Updated ${barbershops[0].name} to São Paulo, SP`);
    }

    // Update second one to Cuiabá/MT if exists
    if (barbershops[1]) {
        await prisma.barbershop.update({
            where: { id: barbershops[1].id },
            data: {
                city: "Cuiabá",
                state: "MT"
            }
        });
         console.log(`Updated ${barbershops[1].name} to Cuiabá, MT`);
    }

    // If more, update cyclically or just leave
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // await prisma.$disconnect();
    });
