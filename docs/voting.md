# Voting System (PostHog + Astro)

Central guide for the "Coming Up" topics and reusable thumbs-up voting.

## Overview
- Readers vote on upcoming topics and on individual blog posts
- Votes captured via PostHog events (`topic_vote`)
- Initial counts fetched server-side (SSR) from PostHog API

## Files
- `src/utils/posthog.ts` — PostHog API helper (SSR counts + event capture)
- `src/components/ui/ThumbsUpButton.astro` — Reusable voting button
- `src/pages/coming-up.astro` — Public page to vote on upcoming topics
- `src/data/upcoming-topics.ts` — Source of truth for draft topics
- `src/components/blog/SinglePost.astro` — Auto-includes the button under sharing for all blog posts

## Environment Variables
Local `.env.local` and Netlify env vars:
```
POSTHOG_PROJECT_ID=your_project_id
POSTHOG_API_KEY=your_api_key   # secret
POSTHOG_HOST=https://us.i.posthog.com
```

## Managing Upcoming Topics
Edit `src/data/upcoming-topics.ts`:
```ts
export const upcomingTopics = [
  { id: 'custom-slash-commands', title: 'Custom Slash Commands in Claude Code', summary: '...', category: 'ai-assistants' },
  // ...
];
```
- `id` must be stable (PostHog counts are keyed by this)
- Change `title/summary` freely; changing `id` starts a new vote stream
- Order in array = display order on `/coming-up`

## Reusable Thumbs-Up Component
Use anywhere:
```astro
---
import ThumbsUpButton from '~/components/ui/ThumbsUpButton.astro';
---

<ThumbsUpButton 
  topicId="my-topic"
  topicTitle="My Topic"
  initialVoteCount={0}
/>
```
Props:
- `topicId` (string, required)
- `topicTitle` (string, required)
- `initialVoteCount` (number, optional)
- `className` (string, optional)

## Blog Integration (Automatic)
Added inside `src/components/blog/SinglePost.astro` below social sharing:
```astro
<ThumbsUpButton 
  topicId={`blog-post-${post.slug}`}
  topicTitle={post.title}
  initialVoteCount={initialVoteCount}
/>
```
- Initial count is fetched server-side via `getPostHogVoteCounts([voteKey])`
- Privacy/Terms pages are unaffected (different layout)

## Coming Up Page
`/coming-up` lists `upcomingTopics` with vote buttons:
```astro
<ThumbsUpButton topicId={topic.id} topicTitle={topic.title} initialVoteCount={voteCounts[topic.id] || 0} />
```

## Testing
1. Set env vars (local and Netlify)
2. Deploy to Netlify (auto)
3. Visit `/coming-up` and any blog post
4. Click 👍; verify `topic_vote` events in PostHog

## Notes & Future Enhancements
- Optional: prevent duplicate votes per session/device
- Optional: thumbs down; animations; rate limiting
- Optional: move `upcoming-topics` into CMS/collection if desired
