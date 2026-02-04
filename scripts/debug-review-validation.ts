
require("dotenv").config({ path: ".env" });

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { comercioApi } = await import("../services/comercio-api");
    const { prisma } = await import("../lib/prisma");

    const userId = "pmvtzsVXPoKdzA7y8MCfbtCbEt1RwRcZ"; 
    const barbershopId = "a4061b12-3c70-42d0-bb19-f5f0d6a12d68";

    console.log("Checking for user:", userId);
    console.log("Checking for shop:", barbershopId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        console.error("User not found locally");
        return;
    }
    console.log("User email:", user.email);

    if (!user.email) return;

    const externalBookings = await comercioApi.getUserBookings(user.email);
    console.log(`Found ${externalBookings.length} external bookings.`);

    const fs = require('fs');
    let output = "";
    output += `Check for user: ${userId}\n`;
    output += `Check for shop: ${barbershopId}\n`;
    output += `Found ${externalBookings.length} external bookings.\n`;

    externalBookings.forEach((b: any) => {
        const isShopMatch = b.barbershopId === barbershopId;
        const bookingDate = new Date(b.date);
        
        output += `\n--- BOOKING ${b.id} ---\n`;
        output += `  Shop ID:    ${b.barbershopId} (Match? ${isShopMatch})\n`;
        output += `  Status:     ${b.status}\n`;
        output += `  Date Raw:   ${JSON.stringify(b.date)}\n`;
        output += `  Parsed:     ${bookingDate.toISOString()}\n`;
    });

    fs.writeFileSync('scripts/debug_output.txt', output);
    console.log("Debug output written to scripts/debug_output.txt");
}

main();
