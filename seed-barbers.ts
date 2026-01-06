
import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  console.log("Seeding Barbers...");
  
  const barbershops = await prisma.barbershop.findMany();
  
  if (barbershops.length === 0) {
      console.log("No barbershops found. Run main seed first.");
      return;
  }

  const barberNames = ["Diego", "Victor", "Maria", "João", "Ana", "Carlos"];
  const barberImages = [
      "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png", // Male generic
      "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
      "https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png",
      "https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png",
      "https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png",
      "https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png"
  ];

  for (const shop of barbershops) {
      const existingBarbers = await prisma.barber.count({ where: { barbershopId: shop.id }});
      if (existingBarbers > 0) continue;

      // Add 2-3 barbers per shop
      const count = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < count; i++) {
         const name = barberNames[Math.floor(Math.random() * barberNames.length)];
         const img = barberImages[i % barberImages.length];
         
         await prisma.barber.create({
             data: {
                 id: crypto.randomUUID(),
                 name: `${name} ${shop.name.split(" ")[0]}`, // Unique-ish name
                 barbershopId: shop.id,
                 imageUrl: img,
                 email: `${name.toLowerCase()}@barber.com`,
                 updatedAt: new Date(),
             }
         });
      }
      console.log(`Added ${count} barbers to ${shop.name}`);
  }
  
  console.log("Done seeding barbers.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
