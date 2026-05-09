import fs from 'fs';
import path from 'path';

// Simple script to copy UI pages as markdown placeholders into the Obsidian vault.
// Run with `node scripts/exportPages.ts`

const srcDir = path.join(process.cwd(), 'src', 'app');
const outDir = path.join(process.cwd(), 'AtJournal');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.tsx')) {
      const rel = path.relative(srcDir, full).replace(/\\/g, '/');
      const name = rel.replace(/\.tsx$/, '');
      const outPath = path.join(outDir, `${name}.md`);
      const placeholder = `# ${name}\n\n_Exported from ${rel}_`;
      ensureDir(path.dirname(outPath));
      fs.writeFileSync(outPath, placeholder);
    }
  }
}

ensureDir(outDir);
walk(srcDir);
console.log('Exported pages to Obsidian vault at', outDir);
