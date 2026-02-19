import 'dotenv/config';
import { comercioApi } from "@/services/comercio-api";

async function main() {
  const shopId = "a4061b12-3c70-42d0-bb19-f5f0d6a12d68"; // From user logs
  console.log("Fetching services for shop:", shopId);
  const { services, barbers } = await comercioApi.getShopServices(shopId);

  if (!services.length) {
    console.error("No services found for shop.");
    return;
  }

  const service = services[0];
  console.log("Found service:", service.name, service.id);

  const barberId = barbers.length > 0 ? barbers[0].id : undefined;
  console.log("Selected barber:", barberId);

  // Future date
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);

  console.log("Attempting to create booking...");
  try {
    const booking = await comercioApi.createBooking({
      barbershopId: shopId,
      serviceId: service.id,
      barberId: "", // Test empty barber ID
      date: date.toISOString(),
      user: {
        name: "Debug User No Email",
        // email: "debug@test.com" // Comment out email to test if it fails
      },
      clientName: "Debug User No Email",
      // clientEmail: "debug@test.com", // Comment out email
      clientPhone: "11999999999"
    });
    console.log("Booking created successfully:", booking);
  } catch (error: any) {
    console.error("Error creating booking:");
    console.error(error);
    const fs = require('fs');
    fs.writeFileSync('debug-error.log', JSON.stringify({ error: error.message, stack: error.stack }, null, 2));
  }
}

main();
