
import { prisma } from "./lib/prisma";
import fs from "fs";

async function main() {
  let log = "";
  const print = (msg: string) => {
    console.log(msg);
    log += msg + "\n";
  };

  print("Checking for 'Barbearia Polaco' and its owner...");
  
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      name: {
        contains: "Polaco",
        mode: "insensitive"
      }
    },
    include: {
      user: true, // This is the manager/owner
      Barber: true
    }
  });

  if (!barbershop) {
    print("Barbearia Polaco NOT FOUND.");
    const all = await prisma.barbershop.findMany({ select: { name: true } });
    print(`Current barbershops in DB: ${all.map(b => b.name).join(", ")}`);
    fs.writeFileSync("polaco_result.txt", log);
    return;
  }

  print("-----------------------------------------");
  print(`Barbershop: ${barbershop.name}`);
  print(`ID: ${barbershop.id}`);
  print(`Manager ID: ${barbershop.managerId || "NONE"}`);
  
  if (barbershop.user) {
    print("Owner/Manager Details:");
    print(`- Name: ${barbershop.user.name}`);
    print(`- Email: ${barbershop.user.email}`);
    print(`- Role: ${barbershop.user.role}`);
  } else {
    print("This barbershop HAS NO OWNER assigned in the 'managerId' field.");
  }
  
  print("-----------------------------------------");
  print(`Associated Barbers (${barbershop.Barber.length}):`);
  barbershop.Barber.forEach(b => {
    print(`- ${b.name} (Email: ${b.email || "N/A"})`);
  });
  print("-----------------------------------------");
  
  fs.writeFileSync("polaco_result.txt", log);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
