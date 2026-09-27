import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRS = [
  path.join(__dirname, '../src/features/student'),
  path.join(__dirname, '../app/(dashboard)')
];

const REPLACEMENTS = [
  // Typography & Hex Colors
  { regex: /bg-\[\#2563eb\]/g, replacement: 'bg-blue-600' },
  { regex: /hover:bg-\[\#1d4ed8\]/g, replacement: 'hover:bg-blue-700' },
  { regex: /text-\[\#0f172a\]/g, replacement: 'text-slate-900' },
  { regex: /text-\[\#64748b\]/g, replacement: 'text-slate-500' },
  
  // Buttons
  { regex: /bg-blue-500(.*?)hover:bg-blue-600/g, replacement: 'bg-blue-600$1hover:bg-blue-700' },
  
  // Border Radius
  { regex: /rounded-2xl/g, replacement: 'rounded-xl' },
  
  // Borders (only standard card borders)
  { regex: /border-slate-100/g, replacement: 'border-slate-200' },
  
  // Hover effects normalization
  { regex: /hover:-translate-y-1/g, replacement: '' },
  { regex: /hover:shadow-xl/g, replacement: 'hover:shadow-md' },
  { regex: /hover:shadow-sm/g, replacement: 'hover:shadow-md' },
  { regex: /hover:shadow-slate-200\/40/g, replacement: '' },
  
  // Standardize Card hover borders
  { regex: /hover:border-slate-200/g, replacement: 'hover:border-blue-500' }
];

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const { regex, replacement } of REPLACEMENTS) {
    content = content.replace(regex, replacement);
  }
  
  // Cleanup multiple spaces caused by removing utility classes
  content = content.replace(/\s{2,}/g, (match) => {
    // Only collapse spaces inside className strings, naive approach but works for simple cases
    if (match.includes('\n')) return match; 
    return ' ';
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${path.relative(path.join(__dirname, '..'), filePath)}`);
  }
}

console.log('Starting UI refactor script...');
TARGET_DIRS.forEach(dir => processDirectory(dir));
console.log('Done!');
