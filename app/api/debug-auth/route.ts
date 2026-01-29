
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = {
    env: {
       DATABASE_URL_SET: !!process.env.DATABASE_URL,
       BETTER_AUTH_SECRET_SET: !!process.env.BETTER_AUTH_SECRET,
       NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    db: {},
    hashing: {},
  };

  try {
    // 1. Test DB Connection
    const user = await prisma.user.findUnique({
      where: { email: "georgeluccas300@gmail.com" },
      include: { accounts: true },
    });
    
    results.db.connection = "Success";
    results.db.userFound = !!user;
    
    if (user) {
        results.db.userRole = user.role;
        results.db.hasPassword = !!user.password;
        results.db.passwordLength = user.password?.length;
        results.db.accountsCount = user.accounts.length;
        
        // 2. Test Hashing
        const testPass = "123456789"; // Example pass user tried
        results.hashing.testPass = testPass;
        
        if (user.password) {
             try {
                const match = await compare(testPass, user.password);
                results.hashing.compareResult = match;
             } catch (e: any) {
                results.hashing.compareError = e.message;
             }
        } else {
             results.hashing.skip = "No password on user record";
        }
        
        // Check hashing function itself
        try {
            const newHash = await hash("test", 10);
            results.hashing.newHashGenerated = !!newHash;
        } catch(e: any) {
            results.hashing.generationError = e.message;
        }
    }

  } catch (error: any) {
    results.db.error = error.message;
    results.db.stack = error.stack;
  }

  return NextResponse.json(results);
}
