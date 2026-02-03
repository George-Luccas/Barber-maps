
import { prisma } from "@/lib/prisma";

async function main() {
  // 1. Find the shop "Car Barber" (using insensitive search to be safe)
  const shops = await prisma.barbershop.findMany({
    where: {
      name: {
        contains: "Car",
        mode: "insensitive"
      }
    }
  });

  console.log("--- Found Shops ---");
  console.log(shops.map(s => `${s.name} (${s.id})`));

  if (shops.length === 0) {
    console.log("No shop found with 'Car' in name.");
    return;
  }

  // 2. For each found shop, check bookings
  for (const shop of shops) {
    console.log(`\n--- Checking bookings for: ${shop.name} ---`);
    
    // Check bookings for the specific user we debugged earlier
    const myUserBookings = await prisma.booking.findMany({
      where: {
        barbershopId: shop.id,
        userId: "pmvtzsVXPoKdzA7y8MCfbtCbEt1RwRcZ" // The ID confirmed in debug
      }
    });

    console.log(`Bookings for User 'pmvtz...': ${myUserBookings.length}`);
    if (myUserBookings.length > 0) {
        console.log(JSON.stringify(myUserBookings, null, 2));
    }

    // Check ALL bookings for this shop to see if they exist under ANY user
    const totalBookings = await prisma.booking.count({
        where: { barbershopId: shop.id }
    });
    console.log(`Total bookings in DB for this shop (any user): ${totalBookings}`);
    
    if (totalBookings > 0 && myUserBookings.length === 0) {
         // List a few to see who they belong to
         const someBookings = await prisma.booking.findMany({
             where: { barbershopId: shop.id },
             take: 3,
             select: { id: true, userId: true, date: true, status: true, userName: true }
         });
         console.log("Sample bookings from other users:", someBookings);
    }
  }
}

main();
