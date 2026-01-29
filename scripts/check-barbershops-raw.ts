
import { prisma } from "@/lib/prisma";

async function main() {
    console.log("Testing RAW Prisma query for Barbershops with Stories...");
    try {
        const barbershops = await prisma.barbershop.findMany({
            orderBy: {
                name: "asc", 
            },
            include: {
                Style: {
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5 
                }
            },
            take: 10 
        });

        console.log(`Successfully fetched ${barbershops.length} barbershops.`);
        
        const output = barbershops.map(barbershop => ({
            ...barbershop,
            dailyGoal: Number(barbershop.dailyGoal)
        }));
        
        console.log("Mapped Output Sample:", output.length > 0 ? output[0].name : "No barbershops");

    } catch (e: any) {
        console.error("FAILED to fetch barbershops (RAW):", e);
    }
}

main();
