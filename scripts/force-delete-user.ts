import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'georgeluccas300@gmail.com';
  console.log(`Buscando dados residuais para: ${email}`);

  // 1. Encontrar o usuário pelo email
  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true, sessions: true }
  });

  if (user) {
    console.log(`Usuário encontrado: ${user.id}`);
    
    // 2. Deletar sessões explicitamente
    await prisma.session.deleteMany({
      where: { userId: user.id }
    });
    console.log('Sessões deletadas.');

    // 3. Deletar contas explicitamente
    await prisma.account.deleteMany({
      where: { userId: user.id }
    });
    console.log('Contas vinculadas deletadas.');

    // 4. Deletar o usuário
    await prisma.user.delete({
      where: { id: user.id }
    });
    console.log('Usuário deletado.');
  } else {
    console.log('Nenhum usuário encontrado com esse email.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
