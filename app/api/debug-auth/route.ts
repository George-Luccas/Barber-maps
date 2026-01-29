
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

export const dynamic = "force-dynamic";

// ... imports

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  
  const results: any = {
    env: {
       DATABASE_URL_SET: !!process.env.DATABASE_URL,
       BETTER_AUTH_SECRET_SET: !!process.env.BETTER_AUTH_SECRET,
       NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    db: {},
    hashing: {},
    actionPerformed: null
  };

  try {
    // EMERGENCY RESET ACTION
    if (action === "reset") {
        const hardcodedPass = "123456789";
        const hashedPassword = await hash(hardcodedPass, 10);
        
        await prisma.user.update({
            where: { email: "georgeluccas300@gmail.com" },
            data: { password: hashedPassword }
        });
        
        const user = await prisma.user.findUnique({ where: { email: "georgeluccas300@gmail.com" } });
        if (user) {
             await prisma.account.updateMany({
                where: { userId: user.id },
                data: { password: hashedPassword }
            });
        }
        
        results.actionPerformed = "PASSWORD_RESET_TO_123456789";
        results.db.userFound = !!user;
        return NextResponse.json(results);
    }

    // 1. Test DB Connection
    const user = await prisma.user.findUnique({
      where: { email: "georgeluccas300@gmail.com" },
      include: { accounts: true },
    });
    
    // ... existing read logic ...
    results.db.connection = "Success";
    results.db.userFound = !!user;
    
    if (user) {
        results.db.userRole = user.role;
        results.db.hasPassword = !!user.password;
        results.db.passwordLength = user.password?.length;
        results.db.accountsCount = user.accounts.length;
        
        // 2. Test Hashing
        const testPass = "123456789"; 
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
        
        try {
            const newHash = await hash("test", 10);
            results.hashing.newHashGenerated = !!newHash;
        } catch(e: any) {
            results.hashing.generationError = e.message;
        }

        // 3. Test Session Creation (Write Access)
        try {
            const dummySessionId = "debug-" + Date.now();
            await prisma.session.create({
                data: {
                    id: dummySessionId,
                    token: dummySessionId,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 10000),
                    ipAddress: "127.0.0.1",
                    userAgent: "DebugProbe"
                }
            });
            results.db.sessionCreate = "Success";
            
            await prisma.session.delete({ where: { id: dummySessionId } });
            results.db.sessionDelete = "Success";
        } catch (e: any) {
             results.db.sessionError = e.message;
             results.db.sessionStack = e.stack;
        }
    }

  } catch (error: any) {
    results.db.error = error.message;
    results.db.stack = error.stack;
  }

  return NextResponse.json(results);
}
