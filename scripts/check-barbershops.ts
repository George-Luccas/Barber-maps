
import { getBarbershopsWithStories } from "@/data/barbershops";

async function main() {
    console.log("Testing getBarbershopsWithStories...");
    try {
        const barbershops = await getBarbershopsWithStories();
        console.log(`Successfully fetched ${barbershops.length} barbershops.`);
        if (barbershops.length > 0) {
            console.log("Sample Barbershop:", barbershops[0].name);
            console.log("Sample Stories Count:", barbershops[0].Style?.length || 0);
        }
    } catch (e: any) {
        console.error("FAILED to fetch barbershops:", e);
    }
}

main();
