#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const [, , inputArg, outputArg] = process.argv;

if (!inputArg) {
  console.error(
    'Usage: node scripts/prepare-sanity-import.mjs <input.json> [output.ndjson]'
  );
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(
  process.cwd(),
  outputArg || 'scripts/sanity-import.ndjson'
);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf8');
const parsed = JSON.parse(raw);
const sourcePosts = Array.isArray(parsed)
  ? parsed
  : Array.isArray(parsed.posts)
    ? parsed.posts
    : [];

if (!sourcePosts.length) {
  console.error(
    'No posts found. Expected an array of posts or an object with a posts array.'
  );
  process.exit(1);
}

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const makeId = (prefix, value) => `${prefix}.${slugify(value) || cryptoRandom()}`;

const cryptoRandom = () => Math.random().toString(36).slice(2, 10);

const authorIds = new Map();
const tagIds = new Map();
const documents = [];

for (const source of sourcePosts) {
  const title = source.title || 'Untitled';
  const slug = source.slug || slugify(title);
  const excerpt = source.excerpt || source.subtitle || '';
  const markdown =
    source.content?.markdown || source.markdown || source.content || '';
  const publishedAt = source.publishedAt || new Date().toISOString();
  const coverImageUrl =
    source.coverImage?.url || source.coverImageUrl || source.featuredImage || '';

  let authorRef;
  const authorName = source.author?.name || source.authorName;
  if (authorName) {
    const authorId = authorIds.get(authorName) || makeId('author', authorName);
    if (!authorIds.has(authorName)) {
      authorIds.set(authorName, authorId);
      documents.push({
        _id: authorId,
        _type: 'author',
        name: authorName,
      });
    }
    authorRef = { _type: 'reference', _ref: authorId };
  }

  const sourceTags = Array.isArray(source.tags) ? source.tags : [];
  const tagRefs = sourceTags
    .map((entry) => (typeof entry === 'string' ? entry : entry?.title))
    .filter(Boolean)
    .map((tagTitle) => {
      const tagId = tagIds.get(tagTitle) || makeId('tag', tagTitle);
      if (!tagIds.has(tagTitle)) {
        tagIds.set(tagTitle, tagId);
        documents.push({
          _id: tagId,
          _type: 'tag',
          title: tagTitle,
        });
      }
      return { _type: 'reference', _ref: tagId };
    });

  documents.push({
    _id: makeId('post', slug),
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug },
    excerpt,
    publishedAt,
    markdown,
    coverImageUrl: coverImageUrl || undefined,
    author: authorRef,
    tags: tagRefs.length ? tagRefs : undefined,
  });
}

const lines = documents
  .map((doc) =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(doc).filter(([, value]) => value !== undefined)
      )
    )
  )
  .join('\n');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${lines}\n`, 'utf8');

console.log(`Prepared ${documents.length} documents`);
console.log(`Output written to ${outputPath}`);
console.log('Import with: sanity dataset import <output.ndjson> <dataset>');
