import fs from 'fs';
import path from 'path';

const repoRoot = '/Users/lukas/.gemini/antigravity/scratch/trading-journal';
const srcDir = path.join(repoRoot, 'src', 'app');
const outDir = path.join(repoRoot, 'AtJournal');

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
console.log('Exported pages to', outDir);
