const fs = require('fs');
const path = require('path');

try {
  const content = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
  console.log('Successfully read package.json. first 20 chars:', content.substring(0, 20));
} catch (err) {
  console.error('Error reading package.json:', err);
}
