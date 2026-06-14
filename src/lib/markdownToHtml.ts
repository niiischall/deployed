import { remark } from 'remark';
import html from 'remark-html';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

export default async function markdownToHtml(markdown: string) {
  const youtubeRegex = /%\[https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)\]/g;
  markdown = markdown.replace(
    youtubeRegex,
    (_, videoId) =>
      `<iframe width="350" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
  );

  const imageRegex =
    /!\[([^\]]*)\]\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif|webp|svg))\s+align="(left|right|center)"\)/g;

  markdown = markdown.replace(imageRegex, (_, altText, imageUrl, align) => {
    let style = '';
    if (align === 'left') style = 'style="margin-right: 10px;"';
    if (align === 'right') style = 'style="margin-left: 10px;"';
    if (align === 'center') style = 'style="display: block; margin: 0 auto;"';

    return `<img src="${imageUrl}" alt="${altText}" ${style} />`;
  });

  const result = await remark()
    .use(html)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
