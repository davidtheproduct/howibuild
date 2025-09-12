---
publishDate: 2024-12-12T18:00:00Z
title: How I Built This Site in 3 Hours
excerpt: From idea to live site in one afternoon. Here's the exact process, tools, and AI assistants I used to launch howibuild.ai.
tags:
  - launch
  - build-log
  - tools
  - ai-assistants
  - deployment
---

## The 3-Hour Challenge

I wanted to launch howibuild.ai today. Not next week, not after endless tweaking—today. Here's exactly how I went from idea to live site in about 3 hours.

## Step 1: Planning with ChatPRD (30 mins)

First stop: [ChatPRD](https://chatprd.ai/) to create a proper requirements document. I needed clarity on:
- What the site would be (build logs for founders)
- Core features (Markdown posts, dark mode, no CMS)
- Technical stack (Astro + Tailwind)
- Launch requirements (2 posts minimum)

ChatPRD helped structure my scattered thoughts into an actionable plan. The output: a clean markdown file with everything specified.

**Pro tip**: Spend time here. A clear plan saves hours of refactoring later!

## Step 2: Project Setup in Cursor (5 mins)

I created a new folder on my laptop named 'howibuild' and dropped in the markdown plan from ChatPRD.

Opened [Cursor](https://cursor.sh/), open project, and selected the 'howibuild' folder.

Having the requirements doc in the project meant Claude Code could reference it throughout the build.

## Step 3: Claude Code Does the Heavy Lifting (45 mins)

This is where the magic happened. With Claude Code in Cursor.

```bash
### Open Claude Code
claude
### Spoke to Claude Code and asked it review the requirements doc @howibuild-launch-plan.md, identify any gaps and ask follow up questions before executing the plan
```

1. **Bootstrap**: Cloned <a href="https://github.com/arthelokyo/astrowind"> AstroWind template</a>, installed dependencies
2. **Branding**: Dark mode by default, custom aqua accents
3. **Content**: Created two initial posts from my notes
4. **Customization**: Simplified navigation, removed demo content

The key? I didn't try to be perfect. Just functional and branded.

**What broke**: Astro compiler error with PageLayout. Claude Code fixed it by recreating the file from scratch.

## Step 4: Git Setup (5 mins)

```bash
git init
git remote add origin https://github.com/davidtheproduct/howibuild.git
git add -A
git commit -m "Initial launch"
git push -u origin main
```

Nothing fancy. Just get it into version control.

## Step 5: PostHog AI Assistant (10 mins)

While Claude Code was working, I opened another terminal and used PostHog's AI assistant to set up analytics:

```bash
# PostHog AI handled the entire integration I just followed the prompts
npx -y @posthog/wizard@latest
```

The AI assistant created `/src/components/posthog.astro` and integrated it automatically.

## Step 6: Netlify Deploy (5 mins)

1. Connected GitHub repo to Netlify
2. Auto-deploy triggered immediately
3. Build failed initially (that Astro compiler issue)
4. Fixed, pushed, auto-deployed successfully

Netlify's git-based deployment meant every push went live automatically.

## Step 7: Content Refinement (45 mins)

With the site live at the Netlify subdomain, I could see what needed fixing:

- Homepage was full of AstroWind placeholder content
- About page needed personality
- Primary CTA button had poor contrast (failed WCAG AA)

Claude Code helped clean all this up while I tested on the live site.

## Step 8: Custom Domain (10 mins)

In Netlify:
1. Added custom domain: howibuild.ai
2. Configured DNS in Cloudflare
3. Enabled HTTPS (automatic)
4. Verified propagation

The site was live at howibuild.ai within minutes.

## Step 9: Share with the World (10 mins)

Posted on Twitter/X, shared in founder communities, and started collecting feedback.

First bug report came in 10 minutes later (the contrast issue). Fixed and deployed in under 2 minutes.

## The Stack That Made It Possible

- **Planning**: ChatPRD for requirements
- **IDE**: Cursor with Claude Code
- **Framework**: Astro + Tailwind (via AstroWind template)
- **Analytics**: PostHog with AI assistant
- **Deployment**: Netlify (git-based)
- **Domain**: Cloudflare

## Lessons Learned

### What Worked
- Having a clear plan before coding
- Using a solid template (AstroWind)
- Letting AI handle boilerplate
- Shipping imperfect but functional

### What I'd Do Differently
- Launch this sooner vs days of procrastination
- Test the build locally before first deploy
- Check accessibility from the start

## The Real Secret

The tools are amazing, but the real secret is **decision velocity**. Every decision was "good enough for now" not "perfect forever."

- Color scheme? Aqua. Done.
- Font? Keep the default. Done.
- Features? Just blog posts. Done.

You can always iterate after launch. But you can't iterate on something that doesn't exist!

## Your Turn

The tools are all there. The AI assistants are ready. What's stopping you from launching your thing today?

If you build something using this approach, [submit your story](/get-involved). I'd love to feature more "built in X hours" posts here.

---

*Remember: Your first version just needs to exist. Perfect comes later (maybe).*