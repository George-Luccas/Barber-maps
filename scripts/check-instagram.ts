
import { getBarbers } from "../data/barbers";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Fetching barbers from API...");
  const barbers = await getBarbers();
  console.log(`Found ${barbers.length} barbers from API.`);

  console.log("\nChecking local DB for Instagram data...");
  for (const barber of barbers) {
    const local = await prisma.barber.findUnique({
      where: { id: barber.id },
      select: { id: true, name: true, instagram: true }
    });

    console.log(`- [${barber.name}] (ID: ${barber.id}): Instagram = ${local?.instagram || "NULL"} (Local Record: ${local ? "YES" : "NO"})`);
    
    // Auto-fix for testing: Add instagram for the first barber if missing
    if (!local) {
        console.log(`  -> Creating local record for ${barber.name} with default Instagram...`);
        await prisma.barber.create({
            data: {
                id: barber.id,
                name: barber.name,
                instagram: "@" + barber.name.replace(/\s+/g, '').toLowerCase(),
                imageUrl: barber.imageUrl,
                barbershopId: barber.barbershopId,
                updatedAt: new Date()
            }
        });
        console.log("  -> Done.");
    } else if (!local.instagram) {
        console.log(`  -> Updating local record for ${barber.name} with default Instagram...`);
        await prisma.barber.update({
            where: { id: barber.id },
            data: {
                instagram: "@" + barber.name.replace(/\s+/g, '').toLowerCase()
            }
        });
        console.log("  -> Done.");
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
