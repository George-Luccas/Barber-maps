import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'georgeluccas300@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('Usuário não encontrado.');
    return;
  }

  console.log(`Encontrado usuário: ${user.name} (${user.id})`);

  // Check barbershops
  const barbershop = await prisma.barbershop.findUnique({
    where: { managerId: user.id }
  });

  if (barbershop) {
    console.log(`Usuário gerencia a barbearia: ${barbershop.name}`);
    // Desvincular para evitar erros ou perda de acesso
    await prisma.barbershop.update({
      where: { id: barbershop.id },
      data: { managerId: null }
    });
    console.log('Barbearia desvinculada temporariamente.');
  }

  // Delete user
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Usuário deletado com sucesso.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
