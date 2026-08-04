const fs = require('fs');
const content = fs.readFileSync('edit.md', 'utf-8');

const getCode = (fileName) => {
  const fileIndex = content.indexOf(fileName);
  if (fileIndex === -1) return null;
  const tsxIndex = content.indexOf('```tsx', fileIndex);
  if (tsxIndex === -1) return null;
  const start = tsxIndex + 6;
  const end = content.indexOf('```', start);
  return content.substring(start, end).trim();
}

const step1Code = getCode('Step1BasicInfo.tsx');
const step3Code = getCode('Step3SettingsPrice.tsx');
const editCode = getCode('EditCourseContainer.tsx');

if (step1Code) fs.writeFileSync('src/features/instructor/create-course/components/Step1BasicInfo.tsx', step1Code);
if (step3Code) fs.writeFileSync('src/features/instructor/create-course/components/Step3SettingsPrice.tsx', step3Code);
if (editCode) fs.writeFileSync('src/features/instructor/create-course/components/EditCourseContainer.tsx', editCode);

console.log('Done extracting.');
