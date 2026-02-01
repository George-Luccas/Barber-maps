
import { PrismaClient } from "@prisma/client";
import { comercioApi } from "../services/comercio-api";

// Mock env vars for the script context if needed, 
// though tsx usually loads .env if configured or we can rely on defaults.
// We'll rely on the existing .env loading.

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Diagnosing Booking Flow (Full)...");

  // 1. Get User
  const email = "georgeluccas300@gmail.com";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("❌ User not found:", email);
    return;
  }
  console.log(`✅ User found: ${user.name}`);

  // 2. Find "Car barber" or any shop with services
  const shop = await prisma.barbershop.findFirst({
    where: {
        services: {
            some: {} // Must have at least one service
        }
    },
    include: {
        services: true
    }
  });

  if (!shop) {
    console.error("❌ No barbershop with services found in DB!");
    return;
  }
  console.log(`✅ Shop found: ${shop.name} (${shop.id})`);
  const service = shop.services[0];
  console.log(`✅ Service selected: ${service.name} (${service.id})`);

  // 3. Attempt Booking via API Function (Simulating the Server Action)
  console.log("🚀 Attempting comercioApi.createBooking...");
  
  try {
    const result = await comercioApi.createBooking({
        barbershopId: shop.id,
        serviceId: service.id,
        barberId: "", // Optional
        date: new Date().toISOString(),
        clientName: user.name,
        clientEmail: user.email,
        isSubscription: false
    });
    console.log("✅ Booking Created via API:", result);
  } catch (error: any) {
    console.error("❌ API Call Failed:", error.message);
    if (error.cause) console.error("Cause:", error.cause);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
