# Docs

## Index

- Voting system (topics + thumbs up): `docs/voting.md`

## Quick links

- Manage upcoming topics: `src/data/upcoming-topics.ts`
- Reusable thumbs-up component: `src/components/ui/ThumbsUpButton.astro`
- Blog integration (auto-included): `src/components/blog/SinglePost.astro`
- Coming Up page: `src/pages/coming-up.astro`

## Dev notes

- Env vars (local): `.env.local` with `POSTHOG_PROJECT_ID`, `POSTHOG_API_KEY`, `POSTHOG_HOST`
- Env vars (Netlify): same keys (API key marked as secret)
- Build: `npm run build`  •  Dev: `npm run dev`

