
import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';

const prisma = new PrismaClient();
const LOG_FILE = 'schema_check_result.txt';

async function main() {
  try {
    fs.writeFileSync(LOG_FILE, "Starting schema check...\n");
    
    // Fetch a user
    const user = await prisma.user.findFirst();
    
    fs.appendFileSync(LOG_FILE, user ? "User found.\n" : "No user found.\n");
    
    if (user) {
        fs.appendFileSync(LOG_FILE, "User keys: " + Object.keys(user).join(", ") + "\n");
        if ('coverImage' in user) {
            fs.appendFileSync(LOG_FILE, "coverImage field exists in returned object.\n");
        } else {
            fs.appendFileSync(LOG_FILE, "coverImage field MISSING.\n");
        }
    }
  } catch (e: any) {
    fs.appendFileSync(LOG_FILE, "ERROR: " + e.message + "\n");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
