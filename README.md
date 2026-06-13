# deployed

Personal blog at [blog.nischalnikit.xyz](https://blog.nischalnikit.xyz) — built with Next.js 15, fetching posts from Hashnode via GraphQL.

## Stack

- Next.js 15 (App Router, Turbopack)
- TypeScript + Tailwind CSS
- Hashnode GraphQL API via Apollo Client
- remark / rehype for Markdown → HTML
- PostHog for analytics

## Local development

1. Clone the repo and install dependencies:
   ```bash
   pnpm install
   ```
2. Create a `.env.local` file at the project root:
   ```
   NEXT_HASHNODE_HOSTNAME=<your-hashnode-publication-hostname>
   ```
3. Start the dev server:
   ```bash
   pnpm dev
   ```

## Project structure

```
src/app/              — App Router pages and root layout
src/app/_components/  — UI components (header, post body, theme switcher, …)
src/lib/              — API helpers, GraphQL queries, markdown utilities
public/               — Static assets and favicons
```

## Deploy

Deployed on Vercel. Pushing to `main` triggers a production build.
