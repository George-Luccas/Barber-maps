import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  let output = '=== Verificando Banco de Dados (Schema Unificado) ===\n\n';

  // Buscar todos os usuários
  output += '--- Usuários ---\n';
  // @ts-ignore
  const users = await prisma.user.findMany();
  output += `Total de usuários: ${users.length}\n`;
  users.forEach((user: any) => {
    output += `  ID: ${user.id} | Email: ${user.email} | Nome: ${user.name}\n`;
  });

  // Check Barbershops
  output += '\n--- Barbearias ---\n';
  const barbershops = await prisma.barbershop.findMany();
  output += `Total de barbearias: ${barbershops.length}\n`;

  // Buscar todos os agendamentos
  output += '\n--- Agendamentos ---\n';
  const bookings = await prisma.booking.findMany({
    include: {
      barbershop: true,
      service: true,
    },
  });
  output += `Total de agendamentos: ${bookings.length}\n`;
  bookings.forEach((booking: any) => {
    output += `  ID: ${booking.id}\n`;
    output += `  UserId: ${booking.userId}\n`;
    output += `  Data: ${booking.date}\n`;
    output += `  Barbearia: ${booking.barbershop?.name || 'N/A'}\n`;
    output += `  Serviço: ${booking.service?.name || 'N/A'}\n`;
    output += '  ---\n';
  });

  // Verificar id
  output += '\n--- Verificação de UserIds ---\n';
  const userIds = users.map((u: any) => u.id);
  for (const booking of bookings) {
      const exists = userIds.includes(booking.userId);
      output += `  Booking ID ${booking.id} user ${booking.userId} exists? ${exists}\n`;
  }

  await prisma.$disconnect();
  
  fs.writeFileSync('debug-output.txt', output);
  console.log('Output written to debug-output.txt');
}

main().catch(console.error);
