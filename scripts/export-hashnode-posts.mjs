#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const [, , outputArg, ...urlArgs] = process.argv;

if (!outputArg || !urlArgs.length) {
  console.error(
    'Usage: node scripts/export-hashnode-posts.mjs <output.json> <url1> [url2] [url3...]'
  );
  process.exit(1);
}

const endpoint = 'https://gql.hashnode.com/';
const outputPath = path.resolve(process.cwd(), outputArg);

const query = `
  query PostBySlug($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        id
        title
        subtitle
        slug
        publishedAt
        coverImage {
          url
        }
        content {
          markdown
        }
        tags {
          name
        }
      }
    }
  }
`;

const parseHashnodeUrl = (input) => {
  const parsed = new URL(input);
  const host = parsed.host;
  const slug = parsed.pathname.replace(/^\/+/, '').replace(/\/+$/, '');

  if (!host || !slug) {
    throw new Error(`Invalid Hashnode URL: ${input}`);
  }

  return { host, slug };
};

const fetchPost = async ({ host, slug }) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { host, slug },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Hashnode request failed (${response.status}) for ${host}/${slug}`
    );
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(
      `Hashnode GraphQL error for ${host}/${slug}: ${payload.errors[0].message}`
    );
  }

  return payload.data?.publication?.post ?? null;
};

const run = async () => {
  const results = [];

  for (const inputUrl of urlArgs) {
    const parsed = parseHashnodeUrl(inputUrl);
    const post = await fetchPost(parsed);

    if (!post) {
      console.warn(`No post found for: ${inputUrl}`);
      continue;
    }

    results.push(post);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({ posts: results }, null, 2));

  console.log(`Exported ${results.length} posts to ${outputPath}`);
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
