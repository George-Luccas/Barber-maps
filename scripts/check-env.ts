import 'dotenv/config';

console.log(`DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@')}`);
console.log(`AUTH_DATABASE_URL: ${process.env.AUTH_DATABASE_URL?.replace(/:[^:]+@/, ':****@')}`);
