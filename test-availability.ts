
import { prisma } from "./lib/prisma";
import { startOfDay, endOfDay, format } from "date-fns";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

async function main() {
  // 1. Find the Barber created earlier
  const barber = await prisma.barber.findFirst({
    include: { barbershop: true }
  });

  if (!barber) {
    console.log("No barber found! Data issue.");
    return;
  }

  console.log(`Testing with Barber: ${barber.name} (${barber.id})`);
  console.log(`Barbershop: ${barber.barbershop.name} (${barber.barbershopId})`);
  
  // 2. Select a Date (Tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log("Testing Date:", tomorrow);

  const start = startOfDay(tomorrow);
  const end = endOfDay(tomorrow);

  // 3. Run Query (Logic from action)
  // Scenario A: Filter by Barber
  console.log("\n--- Scenario A: With BarberId ---");
  await testLogic(barber.barbershopId, tomorrow, barber.id);

  // Scenario B: No BarberId
  console.log("\n--- Scenario B: No BarberId ---");
  await testLogic(barber.barbershopId, tomorrow, undefined);
}

async function testLogic(barbershopId: string, date: Date, barberId?: string) {
  const where: any = {
    barbershopId,
    date: {
      gte: startOfDay(date),
      lte: endOfDay(date),
    },
    cancelledAt: null,
  };

  if (barberId) {
    where.barberId = barberId;
  }

  console.log("Query 'where':", JSON.stringify(where, null, 2));

  const bookings = await prisma.booking.findMany({ where });
  console.log(`Found ${bookings.length} bookings.`);

  // Use Intl (Simulated)
  const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
  });

  const occupiedSlots = bookings.map(
    (booking) => timeFormatter.format(booking.date),
  );
  console.log("Occupied Slots:", occupiedSlots);

  const available = TIME_SLOTS.filter(
    (slot) => !occupiedSlots.includes(slot),
  );
  console.log("Available Slots Count:", available.length);
  console.log("First 5 Available:", available.slice(0, 5));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
