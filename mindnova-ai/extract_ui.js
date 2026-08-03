const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('instructor_all_code.md', 'utf8');
const regex = /File:\s*(H:\\[^\n]+).*?={64}(.*?)(?=\n={64}\nFile: |$)/gs;

let match;
while ((match = regex.exec(content)) !== null) {
  const fullPath = match[1].trim();
  // We want to map H:\du_an\website\mindnova-ai\... to .tmp_new_ui\...
  const relativePath = fullPath.replace(/H:\\du_an\\website\\mindnova-ai\\/i, '');
  const targetPath = path.join(__dirname, '.tmp_new_ui', relativePath);
  
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(targetPath, match[2].trim());
  console.log('Extracted:', relativePath);
}
