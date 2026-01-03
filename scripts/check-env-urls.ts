import 'dotenv/config';

console.log("Checking DB URLs...");
const dbUrl = process.env.DATABASE_URL;
const authUrl = process.env.AUTH_DATABASE_URL;

if (dbUrl === authUrl) {
    console.log("WARNING: DATABASE_URL and AUTH_DATABASE_URL are IDENTICAL!");
} else {
    console.log("OK: Database URLs are different.");
}
