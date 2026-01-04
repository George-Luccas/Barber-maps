// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import { PrismaClient as AuthPrismaClient } from "../generated/auth-client";

async function main() {
  console.log("Loading environment...");
  if (!process.env.DATABASE_URL || !process.env.AUTH_DATABASE_URL) {
    console.error("❌ Missing DATABASE_URL or AUTH_DATABASE_URL");
    process.exit(1);
  }

  // Instantiate directly to avoid adapter issues in script context
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } }
  });

  const authPrisma = new AuthPrismaClient({
    datasources: { db: { url: process.env.AUTH_DATABASE_URL } }
  });

  console.log("⚠️  STARTING FULL DUAL-DATABASE RESET ⚠️");

  // --- 1. Clear MAIN Database (Business Data) ---
  console.log("--- Clearing Business DB ---");
  console.log("Deleting Bookings...");
  await prisma.booking.deleteMany();

  console.log("Deleting Financial Transactions...");
  await prisma.financialTransaction.deleteMany();

  console.log("Deleting Stock Items...");
  await prisma.stockItem.deleteMany();
  
  console.log("Deleting Barbershop Styles...");
  await prisma.style.deleteMany();

  console.log("Deleting Barbershop Services...");
  await prisma.barbershopService.deleteMany();

  console.log("Deleting Barbershops...");
  await prisma.barbershop.deleteMany();


  // --- 2. Clear AUTH Database (User Data) ---
  console.log("--- Clearing Auth DB ---");
  
  console.log("Deleting Sessions...");
  await authPrisma.session.deleteMany();
  
  console.log("Deleting Accounts...");
  await authPrisma.account.deleteMany();

  console.log("Deleting Verifications...");
  await authPrisma.verification.deleteMany();

  console.log("Deleting Users...");
  await authPrisma.user.deleteMany();

  console.log("✅ BOTH Databases cleared successfully.");
  
  await prisma.$disconnect();
  await authPrisma.$disconnect();
}

main().catch(e => {
  console.error("Reset Error:", e);
  process.exit(1);
});
