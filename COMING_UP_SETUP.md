# Coming Up - Topic Voting System Setup

## Overview
This implementation adds a topic voting system to your blog using PostHog for analytics and vote tracking.

## Files Created/Modified

### New Files:
- `src/utils/posthog.ts` - PostHog API integration for fetching vote counts
- `src/data/upcoming-topics.ts` - Topic data structure and initial topics
- `src/pages/coming-up.astro` - Main voting page
- `COMING_UP_SETUP.md` - This setup guide

### Modified Files:
- `.gitignore` - Added `.env.local` (already done by you)
- `src/navigation.ts` - Added "Coming Up" link to header and footer navigation

## Environment Variables Setup

### 1. Create `.env.local` file:
```env
POSTHOG_PROJECT_ID=your_project_id_here
POSTHOG_API_KEY=your_api_key_here
POSTHOG_HOST=https://us.i.posthog.com
```

### 2. Netlify Environment Variables:
Add these to your Netlify dashboard under Site Settings > Environment Variables:

- `POSTHOG_PROJECT_ID` = your_project_id (non-secret)
- `POSTHOG_API_KEY` = your_api_key (SECRET - mark as sensitive)
- `POSTHOG_HOST` = https://us.i.posthog.com (non-secret)

## Current Topics Included:
1. **Custom Slash Commands in Claude Code** - AI assistants
2. **Creating Sub-Agents** - AI assistants  
3. **Custom GPT vs ChatGPT Assistant** - AI assistants
4. **Save a Bucket Load of Supabase Storage** - Database
5. **R2 Caching to Cut Down on API Costs** - Tools
6. **Monorepo Design System Chaos** - Design system

## How It Works:
1. **Vote Tracking**: Uses PostHog `topic_vote` events with `topic_id` and `topic_title` properties
2. **Vote Counts**: Fetched server-side during build using PostHog API
3. **User Experience**: Optimistic updates - votes appear immediately, tracked in PostHog
4. **Analytics**: All voting data available in PostHog dashboard

## Testing:
1. Set up your environment variables
2. Deploy to Netlify
3. Visit `/coming-up` page
4. Click thumbs up buttons to vote
5. Check PostHog dashboard for `topic_vote` events

## Adding More Topics:
Edit `src/data/upcoming-topics.ts` and add new topic objects to the `upcomingTopics` array.

## Customization:
- Styling: Modify CSS in `src/pages/coming-up.astro`
- Layout: Change the grid layout or card design
- Categories: Add more categories or change existing ones
- Vote tracking: Modify the `trackVote` function in the script section
