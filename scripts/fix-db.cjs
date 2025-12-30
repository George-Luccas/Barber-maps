const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load env vars manually to avoid pollution
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
let url = match ? match[1] : null;

// Sanitize quotes if regex didn't catch them all (being extra safe)
if (url && url.startsWith('"') && url.endsWith('"')) {
  url = url.slice(1, -1);
}

console.log('Extracted URL starts with:', url ? url.substring(0, 15) : 'null');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const tempSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.temp.prisma');

try {
  console.log('Reading schema...');
  let schema = fs.readFileSync(schemaPath, 'utf8');

  // Replace env("DATABASE_URL") with the actual string in quotes
  let newSchema = schema.replace('env("DATABASE_URL")', `"${url}"`);

  // Remove generator block to avoid config parsing issues during push
  newSchema = newSchema.replace(/generator client \{[\s\S]*?\}/, '');
  
  fs.writeFileSync(tempSchemaPath, newSchema);
  console.log('Temporary schema created at:', tempSchemaPath);

  console.log('Running prisma db push...');
  // Point to the temp schema explicitly using pnpm exec
  // Remove stdio: inherit to allow capturing output on error
  execSync('pnpm exec prisma db push --schema prisma/schema.temp.prisma --force-reset', { 
    cwd: path.join(__dirname, '..')
  });

  console.log('Running prisma db seed...');
  // Seed usually runs via tsx which loads .env, but we can try running it
  execSync('pnpm exec prisma db seed', {
      cwd: path.join(__dirname, '..')
  });

  console.log('Success!');

} catch (error) {
  console.error('Migration failed:', error.message);
  if (error.stdout) console.log('Stdout:', error.stdout.toString());
  if (error.stderr) console.error('Stderr:', error.stderr.toString());
  process.exit(1);
} finally {
  // Cleanup only on success or if explicitly desired
  // if (fs.existsSync(tempSchemaPath)) {
  //   fs.unlinkSync(tempSchemaPath);
  //   console.log('Temporary schema deleted.');
  // }
}
