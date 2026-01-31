import { prisma } from './lib/prisma';

async function main() {
  console.log('--- START CLEANUP (Round 3) ---');
  
  try {
    const initialCount = await prisma.user.count();
    console.log(`Initial User Count: ${initialCount}`);

    console.log('Unlinking Barbershop managers...');
    await prisma.barbershop.updateMany({ data: { managerId: null } });

    console.log('Deleting dep tables...');
    try { await prisma.usageLog.deleteMany({}); } catch(e: any) { console.log('UsageLog err', e.message); }
    try { await prisma.subscription.deleteMany({}); } catch(e: any) { console.log('Subscription err', e.message); }
    try { await prisma.loyaltyCard.deleteMany({}); } catch(e: any) { console.log('Loyalty err', e.message); }
    try { await prisma.userFavorite.deleteMany({}); } catch(e: any) { console.log('Fav err', e.message); }
    try { await prisma.platformFeedback.deleteMany({}); } catch(e: any) { console.log('Feedback err', e.message); }
    
    // Deleting Bookings just in case constraint exists
    console.log('Deleting Bookings...');
    try { await prisma.booking.deleteMany({}); } catch(e: any) { console.log('Booking err', e.message); }

    try { await prisma.account.deleteMany({}); } catch(e: any) { console.log('Account err', e.message); }
    try { await prisma.session.deleteMany({}); } catch(e: any) { console.log('Session err', e.message); }
    try { await prisma.verification.deleteMany({}); } catch(e: any) { console.log('Verif err', e.message); }

    console.log('Deleting Users...');
    const result = await prisma.user.deleteMany({});
    console.log(`Delete Result count: ${result.count}`);

    const finalCount = await prisma.user.count();
    console.log(`Final User Count: ${finalCount}`);
    
  } catch (error) {
    console.error('FATAL ERROR:', error);
  } finally {
    await prisma.$disconnect();
    console.log('--- END CLEANUP ---');
  }
}

main();
