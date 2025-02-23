import { remark } from 'remark';
import html from 'remark-html';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert Markdown to HTML
    .use(rehypeRaw) // Process raw HTML inside Markdown
    .use(rehypeHighlight) // Highlight code blocks
    .use(rehypeStringify) // Convert to string output
    .process(markdown);

  return result.toString();
}
