
import { prisma } from "@/lib/prisma";

async function main() {
    try {
        console.log("Searching for users starting with 'george'...");
        const users = await prisma.user.findMany({
            where: { name: { startsWith: 'george', mode: 'insensitive' } },
            select: { id: true, name: true, email: true }
        });

        if (users.length === 0) {
            console.log("No users found starting with 'george'.");
            return;
        }

        const ids = users.map(u => u.id);
        console.log(`Found ${users.length} users. Cleaning up related data...`);
        users.forEach(u => console.log(` - ${u.name} (${u.email})`));

        // Helper to delete related data (catcher to ensure process continues even if one fails)
        const cleanup = async (model: any, name: string) => {
            if (!model) {
                console.log(` - Skipping ${name} (model not found)`);
                return;
            }
            try {
                const { count } = await model.deleteMany({ where: { userId: { in: ids } } });
                console.log(` - Deleted ${count} ${name}`);
            } catch(e: any) { 
                console.log(` - Error deleting ${name}: ${e.message}`); 
            }
        };

        // Delete dependencies (manual cascade for robust cleanup)
        await cleanup(prisma.booking, "Bookings");
        await cleanup(prisma.loyaltyCard, "LoyaltyCards");
        await cleanup(prisma.platformFeedback, "PlatformFeedbacks");
        await cleanup(prisma.subscription, "Subscriptions");
        await cleanup(prisma.notification, "Notifications");
        await cleanup(prisma.userFavorite, "UserFavorites");
        await cleanup(prisma.session, "Sessions");
        await cleanup(prisma.account, "Accounts");
        
        // Delete users
        const { count } = await prisma.user.deleteMany({
            where: { id: { in: ids } }
        });

        console.log(`SUCCESS: Deleted ${count} users.`);
    } catch (error: any) {
        console.error("Cleanup failed:", error.message);
    }
}

main();
