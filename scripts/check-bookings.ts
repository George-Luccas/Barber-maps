import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Verificando Banco de Dados (Schema Unificado) ===\n');

  // Buscar todos os usuários
  console.log('--- Usuários ---');
  // @ts-ignore
  const users = await prisma.user.findMany();
  console.log('Total de usuários:', users.length);
  users.forEach((user: any) => {
    console.log(`  ID: ${user.id} | Email: ${user.email} | Nome: ${user.name}`);
  });

  // Buscar todos os agendamentos
  console.log('\n--- Agendamentos ---');
  // Check Barbershops
  const barbershops = await prisma.barbershop.findMany();
  console.log('Total de barbearias:', barbershops.length);

  const bookings = await prisma.booking.findMany({
    include: {
      barbershop: true,
      service: true,
    },
  });
  console.log('Total de agendamentos:', bookings.length);
  bookings.forEach((booking: any) => {
    console.log(`  ID: ${booking.id}`);
    console.log(`  UserId: ${booking.userId}`);
    console.log(`  Data: ${booking.date}`);
    console.log(`  Barbearia: ${booking.barbershop?.name || 'N/A'}`);
    console.log(`  Serviço: ${booking.service?.name || 'N/A'}`);
    console.log('  ---');
  });

  // Verificar id
  const userIds = users.map((u: any) => u.id);
  for (const booking of bookings) {
      const exists = userIds.includes(booking.userId);
      console.log(`  Booking ID ${booking.id} user ${booking.userId} exists? ${exists}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
