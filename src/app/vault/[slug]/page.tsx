import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default async function VaultFile({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'AtJournal', `${params.slug}.md`);

  let content: string;
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (e) {
    notFound();
    return null; // unreachable
  }

  return (
    <div className="p-8 prose max-w-3xl">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
