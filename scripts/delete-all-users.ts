
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🗑️ Iniciando exclusão de usuários e dados relacionados...")

  // 1. Delete dependent data that might restrict deletion or should be cleaned up
  
  console.log("Deleting Loyalty Cards...")
  await prisma.loyaltyCard.deleteMany({})

  console.log("Deleting User Favorites...")
  try {
    await prisma.userFavorite.deleteMany({})
  } catch (error: any) {
    console.warn("Could not delete favorites (table might not exist):", error.code)
  }

  console.log("Deleting Platform Feedback...")
  await prisma.platformFeedback.deleteMany({})

  // Bookings seem to not have a hard FK to user in schema, but we should clean them up 
  // to avoid orphaned data if we are wiping users.
  // BUT, we must be careful not to delete bookings if they are not strictly tied to these users 
  // (though in this app, userId on Booking is the user).
  console.log("Deleting Bookings...")
  await prisma.booking.deleteMany({})

  // 2. Delete Accounts and Sessions (usually cascade, but efficient to clear)
  console.log("Deleting Accounts and Sessions...")
  await prisma.account.deleteMany({})
  await prisma.session.deleteMany({})

  // 3. Delete Users
  console.log("Deleting Users...")
  const { count } = await prisma.user.deleteMany({})

  console.log(`✅ Sucesso! ${count} usuários deletados.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
