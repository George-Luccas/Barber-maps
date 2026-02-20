
import { config } from "dotenv";
config();

async function main() {
  const { comercioApi } = await import("@/services/comercio-api");
  
  // We need a valid email to test. I'll search for a user in the DB first to get an email.


  const { prisma } = await import("@/lib/prisma");

  const users = await prisma.user.findMany({
      where: { email: { not: "" } },
      take: 5 // limit to 5 users to check
  });

  if (users.length === 0) {
      console.log("No users found in DB.");
      return;
  }


  for (const user of users) {
      console.log(`Checking bookings for: ${user.email}`);
      try {
          const bookings = await comercioApi.getUserBookings(user.email);
          if (bookings.length > 0) {
              console.log(`Found ${bookings.length} bookings for ${user.email}`);
              const output = JSON.stringify(bookings[0], null, 2);
              console.log("First booking sample:", output);
              
              const fs = await import("fs");
              fs.writeFileSync("debug_output_full.json", JSON.stringify(bookings, null, 2)); // improved: dump ALL bookings to see patterns
              console.log("Full output written to debug_output_full.json");
              return; 
          }
      } catch (e) {
          console.error(`Failed to fetch for ${user.email}`, e);
      }
  }
  console.log("No bookings found for any of the tested users.");

}

main();
