
import { prisma } from "../lib/prisma";
import crypto from "crypto";

async function main() {
  const email = "georgeluccas300@gmail.com";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
      console.log("User not found");
      return;
  }

  console.log("Attempting to create session for user:", user.id);

  try {
      const session = await prisma.session.create({
          data: {
              id: crypto.randomUUID(),
              token: crypto.randomUUID(),
              userId: user.id,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60),
              ipAddress: "127.0.0.1",
              userAgent: "Debug Script"
          }
      });
      console.log("Session created successfully:", session.id);
      
      // Clean up
      await prisma.session.delete({ where: { id: session.id } });
      console.log("Session deleted.");
  } catch (e) {
      console.error("Failed to create session:", e);
      // Log full error
      if (e instanceof Error) console.error(e.message);
  }
}
main();
