import { remark } from 'remark';
import html from 'remark-html';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

export default async function markdownToHtml(markdown: string) {
  // Convert Hashnode-style youtube links
  const youtubeRegex = /%\[https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)\]/g;
  markdown = markdown.replace(
    youtubeRegex,
    (_, videoId) =>
      `<iframe width="350" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
  );

  // Convert Hashnode-style images with alignment
  const imageRegex =
    /!\[\]\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif|webp|svg))\s+align="(left|right|center)"\)/g;
  markdown = markdown.replace(imageRegex, (_, imageUrl, align) => {
    let style = '';
    if (align === 'left') style = 'style="margin-right: 10px;"';
    if (align === 'right') style = 'style="margin-left: 10px;"';
    if (align === 'center') style = 'style="display: block; margin: 0 auto;"';

    return `<img src="${imageUrl}" ${style} alt="Image" />`;
  });

  const result = await remark()
    .use(html)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert Markdown to HTML
    .use(rehypeRaw) // Process raw HTML inside Markdown
    .use(rehypeHighlight) // Highlight code blocks
    .use(rehypeStringify) // Convert to string output
    .process(markdown);

  return result.toString();
}
