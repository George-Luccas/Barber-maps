
// @ts-ignore
import { PrismaClient } from "../generated/auth-client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import dotenv from "dotenv";

dotenv.config();

// Custom prisma client for Auth DB
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL,
    },
  },
});

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: "http://localhost:3000", // Dummy URL for script
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 1, // Allow "12345"
  },
});

async function main() {
  const targetEmail = "georgeluccas300@gmail.com";
  const dummyEmail = "temp_fix_pass@gmail.com";
  const newPassword = "12345";

  console.log("Cleanup: Removing any existing dummy user...");
  try {
      // @ts-ignore
      await prisma.user.delete({ where: { email: dummyEmail } });
      await prisma.account.deleteMany({ where: { userId: { equals: "dummy" } } }); // Safety
  } catch(e) {}

  console.log("Creating dummy user to generate hash...");
  // Using api.signUpEmail manually. 
  // better-auth api usually wraps fetch? No, internal api works directly?
  // Actually, auth.api is often a client wrapper.
  // We can use auth.internal (if exposed) or proper API invocation mock.
  // better-auth v1: auth.api.signUpEmail({ body: ... }) might require request context?
  // Let's try to simulate or use auth.api directly.
  
  try {
      // Direct API call
      await auth.api.signUpEmail({
          body: {
              email: dummyEmail,
              password: newPassword,
              name: "Temp Fix"
          }
      });
      console.log("Dummy user created.");
  } catch (e) {
      console.log("Failed to create dummy user via API:", e);
      // If API needs request context, we might be stuck unless we mock it.
      process.exit(1);
  }

  console.log("Reading hash from User or Account...");
  // @ts-ignore
  const dummyUser = await prisma.user.findUnique({ 
      where: { email: dummyEmail },
      include: { accounts: true }
  });
  
  if (!dummyUser) {
      console.log("Dummy user NOT found in DB. API call failed silently?");
      process.exit(1);
  }

  let validHash = dummyUser.password;
  if (!validHash && dummyUser.accounts.length > 0) {
      // Check accounts
      const credAccount = dummyUser.accounts.find(a => a.password);
      if (credAccount) {
          console.log("Hash found in Account table!");
          validHash = credAccount.password;
      }
  }

  if (!validHash) {
      console.log("No hash found in User OR Account. Config mismatch?");
      console.log("User:", dummyUser);
      process.exit(1);
  }

  console.log("Captured Hash:", validHash.substring(0, 15) + "...");

  console.log(`Updating ${targetEmail}...`);
  // Update User table
  try {
    // @ts-ignore
    await prisma.user.update({
        where: { email: targetEmail },
        data: { password: validHash }
    });
    console.log("User.password updated.");
  } catch(e) { console.log("User update failed or user not found"); }

  // Update Account table if exists for email-password
  // @ts-ignore
  const targetUser = await prisma.user.findUnique({ 
      where: { email: targetEmail },
      include: { accounts: true }
  });

  if (targetUser) {
      // Find accounts or create one if missing?
      // Since changing password for existing user, we should update existing account or create 'email-password' account.
      // better-auth uses providerId='credential' or 'email-password'? 
      // Let's check dummy account providerId.
      const dummyProviderId = dummyUser.accounts[0]?.providerId;
      
      const targetAccount = targetUser.accounts.find(a => a.providerId === dummyProviderId) || targetUser.accounts[0];
      
      if (targetAccount) {
          // @ts-ignore
          await prisma.account.update({
              where: { id: targetAccount.id },
              data: { password: validHash }
          });
          console.log("Account.password updated.");
      } else {
          console.log("Target has no accounts? Creating one mechanism might be needed.");
      }
  }

  console.log("Cleanup dummy user...");
  // @ts-ignore
  await prisma.user.delete({ where: { email: dummyEmail } });
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
