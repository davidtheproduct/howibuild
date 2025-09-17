---
title: "Building Content Backlogs with PostHog + Astro Voting"
excerpt: "Built audience‑driven content ranking with PostHog + Astro. Full implementation with troubleshooting, live vote counts, and UX best practices."
category: { slug: "build-log", title: "Build Log" }
tags:
  - { slug: "posthog", title: "PostHog" }
  - { slug: "astro", title: "Astro" }
  - { slug: "netlify", title: "Netlify" }
  - { slug: "audience-building", title: "Audience Building" }
  - { slug: "analytics", title: "Analytics" }
  - { slug: "ui", title: "UI" }
publishDate: 2025-09-17T12:00:00.000Z
author: David Webb
image: ~/assets/images/builder-thumbs-up.png
---

I had dozens of blog topics but no signal on what my audience actually wanted. Instead of guessing, you can vote now and help rank my content backlog.

Here's how I built an audience-driven voting system using PostHog events, Astro components, and Netlify functions, plus every gotcha I hit along the way.

## The Problem: No Signal on Audience Needs

As a solo founder documenting my build journey, I accumulated dozens of potential blog topics:
- "Custom Slash Commands in Claude Code"
- "Supabase Storage Optimization Tricks" 
- "Creating Sub-Agents for Complex Tasks"
- "R2 Caching to Cut API Costs"

But which ones would actually provide value? I'm time poor so need data-driven ranking, not assumptions.

## The Solution: Audience Voting System

**Requirements:**
- Public voting on upcoming topics
- Real-time vote counts
- Reusable thumbs-up component for all blog posts
- Analytics integration for tracking engagement
- Mobile-friendly UX following industry patterns

**Tech Stack:**
- **PostHog** - Event capture and analytics
- **Astro** - Static site generator with component architecture
- **Netlify Functions** - Real-time vote count API
- **Tailwind CSS** - Styling and responsive design

## Implementation Walkthrough

### 1. Data Structure for Topics

First, I created a consolidated data source for upcoming topics:

```typescript
// src/data/upcoming-topics.ts
export interface UpcomingTopic {
  id: string;           // Stable identifier for PostHog events
  title: string;        // Display title
  summary: string;      // One-line description
  category?: string;    // Optional categorization
}

export const upcomingTopics: UpcomingTopic[] = [
  {
    id: 'custom-slash-commands',
    title: 'Custom Slash Commands in Claude Code',
    summary: 'Build your own slash commands for faster AI-assisted development',
    category: 'ai-assistants'
  },
  // ... simply copy and paste to add more topics or edit the sort order
];
```

**Key Decision:** The `id` field is immutable once voting starts. Changing it creates a new vote stream, so I made it descriptive and stable.

### 2. PostHog Event Tracking

I used PostHog to capture `topic_vote` events with structured properties:

```javascript
// Event structure
posthog.capture('topic_vote', {
  topic_id: 'custom-slash-commands',
  topic_title: 'Custom Slash Commands in Claude Code',
  timestamp: new Date().toISOString()
});
```

**Environment Variables:**
```bash
# .env.local (local development)
POSTHOG_PROJECT_ID=your_project_id  # Public, safe to commit
POSTHOG_API_KEY=your_api_key         # SECRET - add to .gitignore
POSTHOG_HOST=https://us.i.posthog.com # Public, safe to commit
```

**Security Notes:**
- Add `.env.local` to `.gitignore` to prevent committing secrets
- Set `POSTHOG_API_KEY` as an environment variable in Netlify dashboard, mark as a secret
- `POSTHOG_PROJECT_ID` and `POSTHOG_HOST` are safe to commit

### 3. Reusable ThumbsUpButton Component

The core voting component needed to work in multiple contexts:

```astro
---
// src/components/ui/ThumbsUpButton.astro
export interface Props {
  topicId: string;
  topicTitle: string;
  initialVoteCount?: number;
  compact?: boolean;
  className?: string;
}

const { topicId, topicTitle, initialVoteCount = 0, compact = false, className = "" } = Astro.props;

const buttonStyles = compact 
  ? `thumbs-up-btn flex items-center gap-1 px-2 py-1 text-sm rounded ${className}`
  : `thumbs-up-btn flex items-center gap-2 px-3 py-2 rounded-md ${className}`;
---

<button 
  class={buttonStyles}
  data-topic-id={topicId}
  data-topic-title={topicTitle}
>
  👍 <span class="vote-count font-bold" id={`votes-${topicId}`}>
    {initialVoteCount}
  </span>
</button>

<script>
  // Event delegation for multiple button instances
  document.addEventListener('click', (e) => {
    if (e.target.closest('.thumbs-up-btn')) {
      e.preventDefault();
      
      const button = e.target.closest('.thumbs-up-btn');
      const topicId = button.dataset.topicId;
      const topicTitle = button.dataset.topicTitle;
      
      if (topicId && topicTitle && window.posthog) {
        // Optimistic update
        const countElement = document.getElementById(`votes-${topicId}`);
        if (countElement) {
          const currentCount = parseInt(countElement.textContent) || 0;
          countElement.textContent = currentCount + 1;
        }
        
        // Track in PostHog
        window.posthog.capture('topic_vote', {
          topic_id: topicId,
          topic_title: topicTitle,
          timestamp: new Date().toISOString()
        });
        
        // Fetch real count after delay for PostHog processing
        setTimeout(async () => {
          const response = await fetch(`/.netlify/functions/get-vote-counts?topicIds=${topicId}`);
          if (response.ok) {
            const data = await response.json();
            const realCount = data.voteCounts[topicId] || 0;
            const currentDisplayCount = parseInt(countElement.textContent) || 0;
            
            // Only update if real count is higher (prevents reversion due to ingestion latency)
            if (realCount >= currentDisplayCount) {
              countElement.textContent = realCount;
            }
          }
        }, 5000);
      }
    }
  });
</script>
```

### 4. Real-time Vote Count API

PostHog has ingestion latency, so I created a Netlify function to fetch live counts:

```javascript
// netlify/functions/get-vote-counts.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { topicIds } = event.queryStringParameters || {};
  if (!topicIds) {
    return { statusCode: 400, body: JSON.stringify({ error: 'topicIds parameter required' }) };
  }

  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';

  const topicIdArray = topicIds.split(',');
  const voteCounts = {};

  for (const topicId of topicIdArray) {
    try {
      const response = await fetch(
        `${host}/api/projects/${projectId}/events/?event=topic_vote&properties=${encodeURIComponent(JSON.stringify({ topic_id: topicId }))}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        voteCounts[topicId] = data.results?.length || 0;
      } else {
        voteCounts[topicId] = 0;
      }
    } catch (error) {
      console.error(`Error fetching votes for ${topicId}:`, error);
      voteCounts[topicId] = 0;
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ voteCounts })
  };
};
```

### 5. Coming Up Page

The main page displays all upcoming topics with voting:

```astro
---
// src/pages/coming-up.astro
import Layout from '~/layouts/PageLayout.astro';
import { upcomingTopics } from '~/data/upcoming-topics';
import { getPostHogVoteCounts } from '~/utils/posthog';
import ThumbsUpButton from '~/components/ui/ThumbsUpButton.astro';

const topicIds = upcomingTopics.map(topic => topic.id);
const voteCounts = await getPostHogVoteCounts(topicIds);
---

<Layout metadata={{ title: "Coming Up - What Should I Build Next?" }}>
  <section class="px-6 py-12 mx-auto max-w-4xl">
    <h1 class="text-4xl font-bold mb-8">Coming Up</h1>
    <p class="text-xl text-gray-300 mb-12">
      Help me rank what to build and write about next. Your votes directly influence my content roadmap.
    </p>
    
    <div class="grid gap-6 md:grid-cols-2">
      {upcomingTopics.map((topic) => (
        <div class="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-cyan-400 transition-colors">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-white pr-4">{topic.title}</h3>
            <ThumbsUpButton
              topicId={topic.id}
              topicTitle={topic.title}
              initialVoteCount={voteCounts[topic.id] || 0}
            />
          </div>
          <p class="text-gray-300 mb-4">{topic.summary}</p>
          {topic.category && (
            <span class="inline-block px-2 py-1 bg-gray-800 text-cyan-400 text-sm rounded">
              {topic.category}
            </span>
          )}
        </div>
      ))}
    </div>
  </section>
</Layout>
```

## Issues I Hit (And How to Fix Them)

### 1. String Interpolation Bug

**Problem:** PostHog events weren't being captured. Network showed "request missing data payload" errors.

**Root Cause:** I tried to use Astro props directly in JavaScript like this:
```javascript
const topicIdValue = "{topicId}";  // ❌ This is literal string "{topicId}"
```

**Fix:** Read values from data attributes in the click handler:
```javascript
const button = e.target.closest('.thumbs-up-btn');
const topicId = button.dataset.topicId;  // ✅ Gets real value
```

### 2. Multiple Component Conflicts

**Problem:** With multiple voting buttons on a page, `document.querySelector()` always targeted the first button.

**Fix:** Use event delegation with `e.target.closest()`:
```javascript
document.addEventListener('click', (e) => {
  if (e.target.closest('.thumbs-up-btn')) {
    const button = e.target.closest('.thumbs-up-btn');
    // Now we have the actual clicked button
  }
});
```

### 3. PostHog Ingestion Latency

**Problem:** Vote counts would show +1 optimistically, then revert to the previous count when fetching real data.

**Root Cause:** PostHog has ~2-5 second processing delay between event capture and API availability.

**Fix:** 
- Increase delay to 5 seconds
- Only update display if real count ≥ current display count
- Prevents reverting optimistic updates

### 4. Debug Mode Essential

Always enable PostHog debug mode during development:
```javascript
posthog.init('your-key', {
  api_host: 'https://us.i.posthog.com',
  debug: true,  // Shows what's being sent
  disable_compression: true,
  request_batching: false
});
```

**Testing Approach:**
- **CLI test**: Use PostHog CLI to verify events are captured
- **Browser console**: Check `window.posthog` object and debug output
- **Network tab**: Verify API calls are being made correctly
- **PostHog event definitions**: Go to Data Management → Event Definitions → search for 'topic_vote' to validate events are recorded

![Voting Test Results](~/assets/images/posthog-topic-votes.png)

## UX Best Practices for Engagement Elements

### Blog Post Layout Pattern

**Research Finding:** Following Medium/GitHub patterns, I put all engagement actions on the same horizontal line.

**Implementation:**
```astro
<!-- Inline engagement bar -->
<div class="flex justify-between items-start">
  <!-- Left: Content metadata -->
  <PostTags tags={post.tags} />
  
  <!-- Right: User actions -->
  <div class="flex items-center gap-4">
    <ThumbsUpButton topicId={voteKey} topicTitle={post.title} compact={true} />
    <SocialShare url={url} text={post.title} />
  </div>
</div>
```

**Benefits:**
- ✅ Single UX scan line for all engagement actions
- ✅ Reduced cognitive load
- ✅ Mobile-friendly grouped targets
- ✅ Industry-standard pattern users expect

### Responsive Design Considerations

```css
/* Mobile: Stack vertically with proper spacing */
.flex-col sm:flex-row gap-4 sm:gap-0

/* Desktop: Single horizontal line */
.justify-between items-start
```

## Performance Considerations

### 1. SSR for Initial Counts
Fetch vote counts server-side to avoid loading states:
```javascript
const voteCounts = await getPostHogVoteCounts(topicIds);
```

### 2. Optimistic Updates
Immediate UI feedback while background sync happens:
```javascript
// Show +1 immediately
countElement.textContent = currentCount + 1;

// Sync with real data after delay
setTimeout(() => fetchRealCount(), 5000);
```

### 3. Batch API Calls
The Netlify function accepts multiple topic IDs:
```
/.netlify/functions/get-vote-counts?topicIds=topic1,topic2,topic3
```

## Accessibility Implementation

I added proper accessibility features to the voting button:
- `aria-label` with topic title and current vote count
- `aria-describedby` linking to the vote count element
- `aria-live="polite"` on vote count for screen reader updates
- `role="button"` for explicit button semantics
- Dynamic `aria-label` updates when vote count changes
- Uses `polite` instead of `assertive` to avoid interrupting user workflow

## UX Design Choices

I focused on making voting frictionless and rewarding:

- **Clear triggers**: Inline engagement bar makes voting obvious
- **One-tap action**: Optimistic +1 feedback with real count sync
- **Visible progress**: Live vote counts via Netlify function
- **Closed loop**: Posts reference voter impact to show results

**Current Implementation:**
- Simple 👍 button with vote count
- ARIA labels for screen reader accessibility
- Optimistic +1 update with real count sync

## Measuring Success

**Analytics I Track:**
- Vote engagement rate per topic
- Vote patterns by user session
- Content completion rate for high-voted topics
- Time from vote to published content

**PostHog Insights I Use:**
- Create funnel: Page view → Vote click → Content engagement
- Segment by topic category performance
- A/B test different voting UX patterns

## Next Steps

**Future Enhancements I'll Consider:**
- Prevent duplicate votes per session/device
- Add vote animations and micro-interactions
- Email notifications when high-voted content is published
- Move topics into CMS for non-technical team members
- Add comment/suggestion functionality
- Content request form for audience-submitted topics

## Key Takeaways

1. **Start simple** - Basic voting provides 80% of the value
2. **Reusable components** - Build once, use everywhere (Coming Up page, blog posts)
3. **Event delegation** - Critical for multiple component instances
4. **Optimistic UI** - Handle API latency gracefully
5. **Follow UX patterns** - Users expect familiar engagement layouts
6. **Real-time data** - Static counts feel broken in 2025

**Your vote shapes what I ship next.**
Want to see this in action? Check out the [Coming Up page](/coming-up) and vote on what you'd like me to build next!

**Ready to build your own voting system?** Start with the [PostHog docs](https://posthog.com/docs) and [Astro components guide](https://docs.astro.build/en/core-concepts/astro-components/).

---
