// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

import * as fs from 'fs';

const LOG_FILE = 'reproduce-output.txt';
function log(msg: string) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function debugAvailability() {
    fs.writeFileSync(LOG_FILE, ''); // clear file
  try {
    // 1. Get a barbershop and a barber
    // NOTE: Prisma Client relation name is "Barber" (capitalized) because of schema restoration
    const barbershop = await prisma.barbershop.findFirst({ include: { Barber: true } });
    if (!barbershop || !barbershop.Barber || barbershop.Barber.length === 0) {
        log("No barbershop or barbers found.");
        return;
    }
    
    const barber = barbershop.Barber[0];
    const barbershopId = barbershop.id;
    const barberId = barber.id;
    
    const now = new Date(); 
    const targetDate = new Date("2026-01-06T12:00:00.000Z"); // Jan 6th

    log(`Debug for Barbershop: ${barbershop.name}, Barber: ${barber.name}`);
    log(`Target Date: ${targetDate.toISOString()}`);
    
    // 2. Mock the Server Action Logic
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);
    
    // CASE A: SPECIFIC BARBER
    log("\n--- CASE A: Specific Barber (George/Id) ---");
    const whereA: any = {
      barbershopId,
      date: { gte: start, lte: end },
      cancelledAt: null,
      barberId: barberId 
    };
    
    const bookingsA = await prisma.booking.findMany({ where: whereA });
    log(`Bookings found: ${bookingsA.length}`);
    
    // Formatter
    const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    
    const occupiedCountA: Record<string, number> = {};
    bookingsA.forEach((booking) => {
      // Handle potential missing displayDate or just use date
      const slot = timeFormatter.format(booking.date);
      occupiedCountA[slot] = (occupiedCountA[slot] || 0) + 1;
    });
    
    const availableA = TIME_SLOTS.filter(slot => {
        const occupied = occupiedCountA[slot] ?? 0;
        // Logic from server action:
        return barberId ? occupied === 0 : occupied < 1; // simulation
    });
    log(`Available Slots (Count): ${availableA.length}`);
    log(`Available Slots: ${availableA.join(", ")}`);


    // CASE B: ANY PROFESSIONAL (NO BARBER ID)
    log("\n--- CASE B: Any Professional (No Barber ID) ---");
    let totalBarbers = barbershop.Barber.length;
    if (totalBarbers === 0) totalBarbers = 1;
    log(`Total Barbers: ${totalBarbers}`);

    const whereB: any = {
      barbershopId,
      date: { gte: start, lte: end },
      cancelledAt: null,
      // No barberId constraint
    };
    
    const bookingsB = await prisma.booking.findMany({ where: whereB });
    log(`Total Bookings for shop: ${bookingsB.length}`);

    const occupiedCountB: Record<string, number> = {};
    bookingsB.forEach((booking) => {
      const slot = timeFormatter.format(booking.date);
      occupiedCountB[slot] = (occupiedCountB[slot] || 0) + 1;
    });
    
    const availableB = TIME_SLOTS.filter(slot => {
        const occupied = occupiedCountB[slot] ?? 0;
        return occupied < totalBarbers;
    });
    log(`Available Slots (Count): ${availableB.length}`);
    log(`Available Slots: ${availableB.join(", ")}`);

  } catch (e) {
    log("ERROR: " + String(e));
  } finally {
    await prisma.$disconnect();
  }
}

debugAvailability();
