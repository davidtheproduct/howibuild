# Content Writing Guidelines

Central guidelines for howibuild.ai content creation. This is a living document; update as we learn from audience data.

## Brand voice and positioning
- **Identity**: Raw, unfiltered build logs from the trenches. Pragmatic, technical, transparent.
- **Promise**: Real implementation details, including what went wrong and how we fixed it.
- **Audience**: Solo founders, product operators, and technically minded builders.

## Narrative voice and tense
- **Default**: First person + past tense
  - Drives authenticity and credibility for build logs: “I built…”, “I hit…”, “I fixed…”.
- **Use present tense** for:
  - Code, APIs, and product behavior: “posthog.capture('event')”, “The button triggers a vote”.
  - Current state truths: “PostHog has ingestion latency”, “Counts update after 5s”.
- **Use future sparingly** for immediate roadmap: “Next I’ll add duplicate-vote protection.”
- **Avoid locale specific language**
  - To appeal to a larger audience avoid words that are spelled differently between en-US and en-AU eg color/colour, prioritize/prioritise, prioritization/prioritisation, behavior/behaviour, customize/customise, customization, customisation, mom/mum etc.
- **Avoid dashes in sentences**
  - Use periods instead of dashes for better readability: "This worked. Meta? Maybe." not "This worked—meta? Maybe."

### DO / DO NOT (voice)
- DO: “I had dozens of ideas and no signal. I let readers vote.”
- DO: “Here’s the exact code and the error that blew up.”
- DO NOT: "One should consider letting users vote to rank content."
- DO NOT: “It is advisable to leverage audience-centric methodologies.”

## Structure for build-log posts
1. **Hook**: Personal pain in one or two sentences
2. **Problem**: Constraints, tradeoffs, success criteria
3. **Solution overview**: Tools and approach in 3–5 bullets
4. **Implementation walkthrough**: Steps with real code and file paths
5. **Issues I hit (and fixes)**: Root cause + validated fix
6. **Results & learnings**: Outcomes, metrics, what we’d do differently
7. **CTA**: What readers can do next (vote, read, subscribe)

### DO / DO NOT (structure)
- DO: Problem → Solution → Implementation → Issues → Results → CTA
- DO: Put the most useful code above the fold; link out for background.
- DO NOT: Start with paragraphs of philosophy before showing value.
- DO NOT: Bury fixes after long marketing copy.

## Length guidelines (evidence‑based)
- **Build logs / implementation guides**: 2,000–2,500 words (HubSpot top performers; Medium ≈1,600 words, Semrush shows longer content gains links/views—optimize for value, not fluff)
- **Deep dives**: 1,500–2,000 words
- **Quick wins**: 800–1,200 words

## Frontmatter Standards

### Required Field Order (Critical for Build Success)
ALWAYS follow this exact order to prevent YAML parsing errors in production:

```yaml
---
publishDate: 2025-09-15T10:00:00.000Z
title: Your Post Title
excerpt: Your post excerpt here
image: ~/assets/images/descriptive-name.png
author: David Webb
category: build-log
tags:
  - tag1
  - tag2
  - tag3
---
```

### Field Requirements
- **publishDate**: Use `new Date().toISOString()` or current date (NOT training data dates)
- **title**: Quote if it contains `:` or YAML-reserved characters. Safe to always quote titles.
- **excerpt**: SEO metadata describing the post by using recent SEO search terms
- **image**: `~/assets/images/[descriptive-name].png` (descriptive, hyphenated)
- **author**: "David Webb" (unless specified otherwise)
- **category**: Unquoted string format `build-log` (backend-only, not displayed on frontend)
- **tags**: Unquoted strings, not objects (e.g., `- posthog` not `- "posthog"`)

**Date Warning**: ALWAYS use current date, NEVER use training data date (e.g. 2025-01-17)

**Category Strategy**: Categories are captured in backend for future use but not displayed on frontend to avoid confusion with primary "Build Logs" navigation.

**YAML Syntax**: Use unquoted strings for category and tags. Quote `title` if it includes `:`, `#`, `{}`, `[]`, or leading/trailing spaces. Field order matters for build consistency.

### YAML gotchas (build breakers)
- **Unquoted colon in title** breaks YAML.
- **Leading/trailing spaces** in values can cause parse issues.
- **Reserved characters** (`:`, `#`, `{}`, `[]`, `,`) in `title` should be quoted.

Bad:
```yaml
---
title: First Impressions: ChatGPT Codex Opens New Possibilities
---
```

Good:
```yaml
---
title: "First Impressions: ChatGPT Codex Opens New Possibilities"
---
```

## Updating Existing Posts

For posts published before these guidelines were established:

### **Scope**: Update all existing posts for consistency
- **Rationale**: Only 6 posts, less than a week old, minimal SEO impact
- **Benefits**: Consistent data structure, future-proofing, better site organization

### **Updates Required**:
1. **Ensure tags are in string format**:
   ```yaml
   # Correct format:
   tags:
     - "posthog"
     - "astro"
   ```

2. **Add category field**:
   ```yaml
   category: "build-log"
   ```

3. **Set author field**:
   ```yaml
   author: David Webb
   ```

4. **Verify publishDate** (ensure current date, not training data)

### **Category Mapping**:
- **Implementation posts**: `"build-log"`
- **Founder content**: `"founding"`
- **Design posts**: `"design"`

### **Execution**:
- **Timing**: Execute in new session to manage context
- **Approach**: Update all 6 posts systematically
- **Testing**: Verify frontend displays correctly after updates

## SEO checklist
- **Title (50–60 chars)**: Primary keyword near the start; brand optional at end.
  - DO: "Building Content Backlogs with PostHog + Astro Voting"
  - DO NOT: "The Complete Ultimate Definitive Guide to Content Management and Voting Systems"
- **URL slug**: short, hyphenated, descriptive. Avoid stop words.
  - DO: `/content-backlog-posthog-voting`
  - DO NOT: `/how-to-build-a-content-management-system-for-your-blog`
- **Excerpt Meta description (150–155 chars)**: Clear benefit + detail + subtle CTA.
  - DO: "Built audience‑driven content ranking with PostHog + Astro. Full implementation with troubleshooting."
  - DO NOT: "Learn how to build voting systems using modern technologies."
- **Heading structure**: Use frontmatter `title` for SEO; avoid H1 in content to prevent keyword cannibalization.
  - DO: Frontmatter title + engaging opening paragraph + H2 sections
  - DO NOT: H1 that repeats the frontmatter title
- **Keywords**: Integrate naturally; no stuffing. Use synonyms.
- **Internal links**: Link relevant posts (e.g., Coming Up, related builds).
- **Images**: Descriptive `alt` text with purpose/context.

## Image Guidelines

### Hero Images (Blog Post Headers)
- **Dimensions**: 900x506 pixels (16:9 aspect ratio)
- **Format**: PNG for diagrams/screenshots, JPG for photos
- **File naming**: `descriptive-name-hero.png`
- **Purpose**: Visual hook that summarizes the post's core concept

### In-Post Images (Body Content)
- **Dimensions**: Flexible, but optimize for web (max 1200px wide)
- **Format**: PNG for diagrams, JPG for photos
- **File naming**: `descriptive-context.png` (e.g., `button-consistency-diagram.png`)
- **Alt text**: Explain purpose/function, not appearance

### Technical Requirements
- **Path**: Always use `~/assets/images/filename.png` (Astro processes these)
- **Optimization**: Astro auto-generates WebP/JPG variants
- **Size**: Keep source files under 2MB for fast builds

### Why These Guidelines Matter
- **Hero images**: Consistent layout prevents cropping issues
- **In-post images**: Flexible sizing allows better content flow
- **Path consistency**: Ensures proper optimization and caching
- **File naming**: Makes assets discoverable and maintainable

### Images in body content
- **Path rule (critical)**: Always reference local images with the alias path `~/assets/images/...` so Astro processes and optimizes them. 
  - Bad: `![Alt](/src/assets/images/example.png)`
  - Good: `![Alt](~/assets/images/example.png)`
- **Filenames**: lowercase, hyphenated, descriptive (e.g., `codex-typo-fix.png`).
- **Formats**: Prefer PNG/JPG sources; the build will generate optimized WebP/JPG variants automatically.
- **Alt text**: Explain purpose/function, not appearance only.
- **Do not** use absolute file URLs to local paths or `/public/src/...`—they bypass Astro's optimizer and may 404 in production.

## Style and clarity
- **Tone**: Technical peer, not lecturer. Confident, not hypey.
- **Clarity first**: Short sentences, concise paragraphs (2–4 sentences).
- **Active voice**: “We shipped a Netlify function”—not “A function was shipped.”
- **Naming**: Prefer precise nouns and verbs (“trackVote”, “voteCounts”).
- **Formatting**:
  - Use `###`/`##` headings; keep sections skimmable.
  - Bullets for steps, decisions, tradeoffs.
  - Code fences with language tags; include real file paths above snippets.
  - Avoid inline code comments for narration; explain above/below code.

### DO / DO NOT (language)
- DO: “This blew up because the client script used literal strings: "{topicId}".”
- DO: “Fix: read from `button.dataset.topicId`; enable PostHog `debug`.”
- DO NOT: “Our revolutionary new architecture unlocks unprecedented synergies.”
- DO NOT: “Possibly could maybe help—results may vary.”

## Code examples standard
- Include real file paths
- Show minimal, working snippets
- Handle errors (early returns, guards)
- Prefer explicit names over placeholders

```astro
// src/components/ui/ThumbsUpButton.astro
const button = e.target.closest('.thumbs-up-btn');
const topicId = button?.dataset.topicId;
if (!topicId) return;
window.posthog.capture('topic_vote', { topic_id: topicId });
```

## Accessibility
- Descriptive link text (“Read the voting guide”) rather than “click here”.
- Alt text explains purpose/function, not just appearance.
- Avoid images of text for critical information.

## Behavioral design (Hooked model)

Use Nir Eyal’s Hooked framework to shape repeatable reader habits.

1) **Trigger**
- External: social posts, newsletter links, internal links, CTAs (“Vote on what I should build next”).
- Internal: curiosity about the build, need for practical fixes.

2) **Action** (make it easy)
- Clear, singular CTAs per section: “Vote”, “Try the snippet”, “View Coming Up”.
- Inline engagement bar (Vote + Share) on the same line for minimal friction.

3) **Variable reward**
- Show real outcomes: shipped fixes, metrics, gotchas, lessons learned.
- Surface votes and visible progress (“+1 recorded”, live counts via Netlify function).
- Mix wins and failures—unpredictability increases attention.

4) **Investment**
- Ask for light contributions: votes, comments, quick polls.
- Encourage deeper investment: starring the repo, subscribing, suggesting topics.
- Close the loop: reference prior voter influence in later posts.

### DO / DO NOT (behavioral)
- DO: “Your vote moved this topic up—here’s what I shipped.”
- DO: “I used your feedback to fix X; here’s the diff.”
- DO NOT: “Subscribe for updates” without a specific reason or payoff.
- DO NOT: Hide counts or progress—make progress visible.

## Publishing checklist
- [ ] **Frontmatter validation**: Field order matches template exactly
- [ ] **YAML syntax**: Unquoted strings for category/tags, no hidden characters
- [ ] **Images**: Body images use `~/assets/images/...` alias and have descriptive alt text
- [ ] First‑person past tense where narrative applies
- [ ] Clear hook and problem framing
- [ ] Real code + file paths + configs
- [ ] Issues section with root cause + validated fix
- [ ] Title < 60 chars; description < 155 chars; good slug
- [ ] Internal links added; alt text present
- [ ] CTA present (vote, subscribe, related post)

## References (best practice)
- Medium study on read time (≈1,600 words): [“The Optimal Post is 7 Minutes”](https://medium.com/@Medium/the-optimal-post-is-7-minutes-59f08d7cb855)
- HubSpot length research (2,100–2,400 top performers): [HubSpot Blog Length](https://blog.hubspot.com/marketing/how-long-should-your-blog-posts-be-faq)
- Semrush: long‑form performance & backlinks: [Semrush Content Length](https://www.semrush.com/blog/how-long-should-a-blog-post-be/)
- Yoast: titles/meta best practices: [Yoast SEO Writing](https://yoast.com/seo-writing/)
- Stripe style guide (technical clarity): [Stripe Style](https://stripe.com/docs/style)
- Divio documentation model (structure): [Divio](https://documentation.divio.com/)

---

Notes
- Default tense is first‑person past for narrative authenticity. Use present for code and current truths. Future only for near‑term actions.
- Revisit these guidelines quarterly based on PostHog engagement metrics (read time, scroll depth, votes).
