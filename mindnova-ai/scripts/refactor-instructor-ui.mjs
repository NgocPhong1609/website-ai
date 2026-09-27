import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRS = [
  path.join(__dirname, '../src/features/instructor'),
  path.join(__dirname, '../app/(instructor)')
];

const REPLACEMENTS = [
  // Hex Colors to Tailwind standard palette
  { regex: /bg-\[\#F8FAFC\]/ig, replacement: 'bg-slate-50' },
  { regex: /border-\[\#E2E8F0\]/ig, replacement: 'border-slate-200' },
  { regex: /text-\[\#64748B\]/ig, replacement: 'text-slate-500' },
  { regex: /text-\[\#0F172A\]/ig, replacement: 'text-slate-900' },
  { regex: /text-\[\#3B82F6\]/ig, replacement: 'text-blue-500' },
  { regex: /bg-\[\#3B82F6\]/ig, replacement: 'bg-blue-500' },
  { regex: /hover:bg-\[\#2563EB\]/ig, replacement: 'hover:bg-blue-600' },
  { regex: /hover:bg-\[\#F8FAFC\]/ig, replacement: 'hover:bg-slate-50' },
  
  // Font weight standardizations
  { regex: /font-black/g, replacement: 'font-bold' },
  { regex: /font-extrabold/g, replacement: 'font-semibold' },
  
  // Border Radius (reduce roundness per user feedback)
  { regex: /rounded-3xl/g, replacement: 'rounded-lg' },
  { regex: /rounded-2xl/g, replacement: 'rounded-lg' },
  { regex: /rounded-xl/g, replacement: 'rounded-lg' },
  
  // Hover effects normalization
  { regex: /shadow-2xs/g, replacement: 'shadow-sm' },
  { regex: /hover:-translate-y-1/g, replacement: '' },
  { regex: /hover:shadow-xl/g, replacement: 'hover:shadow-md' }
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

console.log('Starting UI refactor script for Instructor...');
TARGET_DIRS.forEach(dir => processDirectory(dir));
console.log('Done!');
