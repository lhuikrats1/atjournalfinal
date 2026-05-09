import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

export default async function VaultPage() {
  const dir = path.join(process.cwd(), 'AtJournal');
  const entries = await fs.readdir(dir);
  const files = entries.filter((name) => name.endsWith('.md'));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Vault</h1>
      <ul className="list-disc pl-5 space-y-2">
        {files.map((file) => {
          const name = file.replace(/\.md$/, '');
          return (
            <li key={file}>
              <Link href={`/vault/${encodeURIComponent(name)}`} className="text-blue-600 hover:underline">
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
