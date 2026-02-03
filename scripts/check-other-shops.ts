
import { prisma } from "@/lib/prisma";

async function main() {
  const shopIds = [
      "demo-shop-uuid",
      "0be86c9a-cb0e-4d31-9487-c936869a501c" // adm Barber Shop
  ];

  for (const id of shopIds) {
      const shop = await prisma.barbershop.findUnique({ where: { id } });
      if (!shop) continue;
      
      console.log(`Checking ${shop.name} (${id})...`);
      const bookings = await prisma.booking.count({ where: { barbershopId: id } });
      console.log(`- Total bookings: ${bookings}`);
      
      if (bookings > 0) {
          const sample = await prisma.booking.findFirst({ where: { barbershopId: id } });
          console.log(`- Sample booking ID: ${sample?.id}, User ID: ${sample?.userId}`);
      }
  }
}

main();
