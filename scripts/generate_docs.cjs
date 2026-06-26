const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

const srcFiles = getFiles('src').filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.css'));
let massiveContent = '\n\n---\n\n# 9. Exhaustive Component Reference (Deep Dive)\n\nThis section contains the exact, line-by-line code reference for every single component, utility, and state slice in the application. This ensures absolute architectural preservation. If a component behaves unexpectedly, reference this exact snapshot.\n\n';

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const ext = file.endsWith('.css') ? 'css' : (file.endsWith('.jsx') ? 'jsx' : 'javascript');
  
  let semanticSummary = '';
  if (file.includes('store/')) semanticSummary = 'This file manages the global state. Pay attention to how state is never mutated directly.';
  else if (file.includes('components/ui/')) semanticSummary = 'Domain-agnostic UI primitive. Must remain purely presentational.';
  else if (file.includes('components/goals/')) semanticSummary = 'Domain-specific component. Expects Goal/Milestone objects from the store.';
  else if (file.includes('pages/')) semanticSummary = 'Top-level route container. Orchestrates layout and global state injection.';
  else if (file.includes('layout/')) semanticSummary = 'App Chrome/Layout wrapper.';
  else semanticSummary = 'Core utility or foundational file.';
  
  massiveContent += `## File: \`${file}\`\n\n`;
  massiveContent += `**Architectural Role:** ${semanticSummary}\n\n`;
  massiveContent += '### Source Snapshot\n\n';
  massiveContent += '```' + ext + '\n' + content + '\n```\n\n';
}

fs.appendFileSync('documentation/developer_guide.md', massiveContent);
console.log(`Appended ${srcFiles.length} files to developer_guide.md`);
