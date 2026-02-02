
import { PrismaClient } from "@prisma/client";
import fs from 'fs';

const prisma = new PrismaClient();

async function check() {
  try {
    let output = "";
    const email = "georgeluccas300@gmail.com";
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        output +="User not found\n";
    } else {
        output += `User Email: ${email}\nUser ID: ${user.id}\n`;
        const bookings = await prisma.booking.findMany({
            where: { userId: user.id },
            select: { id: true, status: true, barbershopId: true, date: true }
        });
        
        if (bookings.length === 0) output += "No bookings\n";
        
        bookings.forEach(b => {
            output += `ID: ${b.id} | Shop: ${b.barbershopId} | Status: >${b.status}< | Date: ${b.date}\n`;
        });
    }
    
    fs.writeFileSync('./status_output.txt', output);
    console.log("Done");
  } catch (e: any) {
      fs.writeFileSync('./error_output.txt', e.toString());
      console.error(e);
      process.exit(1);
  }
}

check().finally(() => prisma.$disconnect());
