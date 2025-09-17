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
  compact={true}
/>
```
Props:
- `topicId` (string, required)
- `topicTitle` (string, required)
- `initialVoteCount` (number, optional)
- `className` (string, optional)
- `compact` (boolean, optional) - smaller styling for inline use

## Blog Integration (Automatic)
**Layout:** Inline engagement bar with tags on left, voting + sharing on right:
```astro
<!-- Tags on left -->
<PostTags tags={post.tags} />

<!-- Voting + Sharing on right -->
<ThumbsUpButton 
  topicId={`blog-post-${post.slug}`}
  topicTitle={post.title}
  initialVoteCount={initialVoteCount}
  compact={true}
/>
<SocialShare url={url} text={post.title} />
```
- **UX Pattern:** Follows Medium/GitHub - all engagement actions on same line
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

## Troubleshooting

### PostHog Events Not Capturing
**Symptoms:** "request missing data payload" errors, events don't appear in PostHog Live Events

**Root Causes & Solutions:**
1. **String Interpolation Bug** (Primary Issue)
   - **Problem:** Using `"{topicId}"` literal strings instead of actual prop values
   - **Fix:** Read from `button.dataset.topicId` in click handler
   - **Debug:** Enable `debug: true` in PostHog init to see what's being sent

2. **Multiple Component Conflicts**
   - **Problem:** `document.querySelector()` targets wrong button when multiple instances exist
   - **Fix:** Use event delegation with `e.target.closest('.thumbs-up-btn')`

3. **Astro Script Scope Issues** 
   - **Problem:** Scripts run globally, causing variable collisions between components
   - **Fix:** Use event delegation instead of per-component selectors

**Debugging Steps:**
1. Enable PostHog debug mode (`debug: true`)
2. Check browser console for click event logs
3. Verify PostHog receives correct `topic_id` and `topic_title` (not literal strings)
4. Test CLI: `curl -X POST https://us.i.posthog.com/capture/ -H 'Content-Type: application/json' -d '{"api_key":"your_key","event":"topic_vote","properties":{"distinct_id":"test","topic_id":"test"}}'`

## Real-time Vote Display

**Current State:** Vote counts only update on site redeploy (SSR-fetched on build)

**Need:** Netlify function to fetch live counts from PostHog API for better UX

**Implementation:** ✅ **DONE**
- `/.netlify/functions/get-vote-counts.js` - Netlify function
- Accepts `?topicIds=topic1,topic2` parameter
- Queries PostHog API for event counts per topic
- `ThumbsUpButton` calls function 2s after vote for real count
- **UX Flow:** Click → optimistic +1 → PostHog capture → 5s delay → fetch real count → update display (only if higher)
- **Optimistic Protection:** Real count only overwrites display if higher than current, preventing reversion due to PostHog ingestion latency

## Notes & Future Enhancements
- Optional: prevent duplicate votes per session/device
- Optional: thumbs down; animations; rate limiting
- Optional: move `upcoming-topics` into CMS/collection if desired
