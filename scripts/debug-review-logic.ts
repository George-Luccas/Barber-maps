
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Debug Review Logic for: ${email}`);

  // 1. Get User
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error("User not found!");
    return;
  }
  console.log(`User ID: ${user.id}`);

  // 2. Find ALL Completed Bookings
  const completedBookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      status: "COMPLETED"
    },
    include: {
        barbershop: true
    }
  });

  console.log(`Found ${completedBookings.length} COMPLETED bookings.`);

  if (completedBookings.length === 0) {
      console.warn("❌ validation will FAIL: No completed bookings found.");
      // List confirmed ones to see if they just aren't completed
      const otherBookings = await prisma.booking.findMany({
          where: { userId: user.id },
          take: 3
      });
      console.log("Recent bookings (not completed):", otherBookings.map(b => `${b.id} - ${b.status}`));
      return;
  }

  // 3. For each unique shop, verify if Review creation would likely succeed
  const uniqueShops = new Set(completedBookings.map(b => b.barbershopId));
  console.log(`Eligible to review ${uniqueShops.size} shops:`);

  for (const shopId of uniqueShops) {
      const shop = completedBookings.find(b => b.barbershopId === shopId)?.barbershop;
      console.log(`- Shop: ${shop?.name} (ID: ${shopId})`);

      // Check for existing review
      const existingReview = await prisma.review.findUnique({
          where: {
              userId_barbershopId: {
                  userId: user.id,
                  barbershopId: shopId
              }
          }
      });

      if (existingReview) {
          console.log(`  ℹ️ Review ALREADY EXISTS (Rating: ${existingReview.rating})`);
          // Note: The action uses UPSERT, so this shouldn't fail, just update.
      } else {
          console.log(`  ✅ No review yet. This one should accept a NEW review.`);
      }

      console.log(`  --> Validation Check: does user have completed booking here? YES.`);
  }

  // 4. Check for a shop causing "Not Working" (One without completed booking)
  // Let's grab a random shop they have NOT visited
  const randomShop = await prisma.barbershop.findFirst({
      where: {
          id: { notIn: Array.from(uniqueShops) }
      }
  });

  if (randomShop) {
      console.log(`\nTest Case (Should Fail): Checking Shop ${randomShop.name} (ID: ${randomShop.id})`);
      const hasBooking = await prisma.booking.findFirst({
          where: {
              userId: user.id,
              barbershopId: randomShop.id,
              status: "COMPLETED"
          }
      });
      
      if (!hasBooking) {
          console.log("  ❌ Result: User has NO completed booking here. Action will throw 'Você só pode avaliar...'.");
      } else {
          console.log("  ❓ This shouldn't happen based on the logic above.");
      }
  }

}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
