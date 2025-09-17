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

### DO / DO NOT (voice)
- DO: “I had dozens of ideas and no signal. I let readers vote.”
- DO: “Here’s the exact code and the error that blew up.”
- DO NOT: “One should consider letting users vote to prioritize content.”
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

## SEO checklist
- **Title (50–60 chars)**: Primary keyword near the start; brand optional at end.
  - DO: “Building Content Backlogs with PostHog + Astro Voting”
  - DO NOT: “The Complete Ultimate Definitive Guide to Content Management and Voting Systems”
- **URL slug**: short, hyphenated, descriptive. Avoid stop words.
  - DO: `/content-backlog-posthog-voting`
  - DO NOT: `/how-to-build-a-content-management-system-for-your-blog`
- **Meta description (150–155 chars)**: Clear benefit + detail + subtle CTA.
  - DO: “Built audience‑driven prioritization with PostHog + Astro. Full implementation with troubleshooting.”
  - DO NOT: “Learn how to build voting systems using modern technologies.”
- **Keywords**: Integrate naturally; no stuffing. Use synonyms.
- **Internal links**: Link relevant posts (e.g., Coming Up, related builds).
- **Images**: Descriptive `alt` text with purpose/context.

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
