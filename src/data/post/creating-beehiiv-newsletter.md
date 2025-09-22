---
title: Building Newsletter System with beehiiv + Astro Integration
excerpt: Complete guide to setting up a professional newsletter system using beehiiv, from domain configuration to automated content generation. Includes real code examples and troubleshooting fixes.
publishDate: 2025-09-15T00:00:00Z
image: ~/assets/images/newsletter-creation.png
author: David Webb
category: build-log
tags:
  - newsletter
  - beehiiv
  - email-marketing
  - automation
  - audience-building
  - astro
metadata:
  canonical: https://howibuild.ai/creating-beehiiv-newsletter
---

# Building Newsletter System with beehiiv + Astro Integration

I launched howibuild.ai without a newsletter system to start small. Today I built a complete newsletter infrastructure using beehiiv, integrated it with my Astro site, and automated content generation. Here's the exact process and the issues that nearly broke everything.

## The Problem

I've worked with some great Marketers but have minimal hands-on email marketing experience. I needed a newsletter system that could:
- Start free and scale with my audience
- Integrate seamlessly with my existing Astro site
- Automate content generation from my blog posts
- Maintain brand consistency across platforms

After researching Substack, MailChimp, and beehiiv, I chose **beehiiv** for its generous free tier and clean developer-friendly interface.

## Solution Overview

- **Platform**: beehiiv free plan with custom domain
- **Integration**: Astro component for site-wide signup forms
- **Semi-automation**: Custom Node.js script for RSS-to-newsletter generation with human oversight
- **Branding**: Consistent fonts and colors across platforms
- **Legal**: Updated privacy policy and terms of service

## Implementation Walkthrough

### Step 1: Domain Configuration

**Critical**: Link beehiiv to your domain without overriding your main site.

```bash
# beehiiv domain setup
newsletter.howibuild.ai → beehiiv newsletter site
hello@howibuild.ai → Contact email
# Avoid: mail.howibuild.ai (not needed initially)
```

**What I did:**
1. Added `newsletter.howibuild.ai` subdomain in beehiiv dashboard
2. Used beehiiv's automated DNS configuration with Cloudflare, powered by Entri
3. **Watch out**: beehiiv has website creation features - don't accidentally override your main site!

This creates a dedicated newsletter site while keeping your main site untouched.

### Step 2: Brand Tailoring

**Template Configuration:**
- Font: **Inter** (matches main site)
- Primary color: **#22D3EE** (consistent cyan accent)
- Stripped back to essentials: newsletter page + subscribe page only

**Pro tip**: Remove default pages (tags, recommendations) initially. You can add them later when you have an audience.

### Step 3: Subscriber Form Integration

**Found the embed form:**
- Navigate to **Audience → Subscriber Forms**
- Create form with custom styling
- Copy embed code

**Astro Component Implementation:**

```astro
<!-- src/components/common/NewsletterSignup.astro -->
<script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
<iframe 
  src="https://subscribe-forms.beehiiv.com/YOUR-FORM-ID" 
  class="beehiiv-embed" 
  data-test-id="beehiiv-embed" 
  frameborder="0" 
  scrolling="no" 
  style="width: 100%; height: 452px; margin: 0; border-radius: 0px 0px 0px 0px !important; background-color: transparent; box-shadow: 0 0 #0000; max-width: 100%;"
></iframe>
```

**Integration in PageLayout.astro:**
```astro
<!-- src/layouts/PageLayout.astro -->
<NewsletterSignup />
<Footer />
```

### Step 4: Content Automation Script

**The RSS Challenge:**
beehiiv free plan doesn't support RSS integration (requires $99/month Enterprise plan). I built a semi-automated workaround.

**Semi-Automated Newsletter Generation:**

```bash
# Generate newsletter for last 7 days ending today
node newsletter/generate-newsletter.cjs

# Or specify end date and summary
node newsletter/generate-newsletter.cjs 2025-09-22 "This week was wild..."
```

Under the hood, the script fetches `https://howibuild.ai/rss.xml`, filters posts in a 7‑day window ending on the given date (inclusive), and writes `newsletter/weekly-wrap-YYYY-MM-DD.md`. It’s implemented in CommonJS (`.cjs`) for compatibility with the repo’s ESM setting in `package.json`.

**Process:**
1. Script fetches RSS feed from howibuild.ai
2. Filters posts from specified week
3. Generates markdown using post excerpts
4. Creates newsletter template with build logs section
5. Takes manual input for opening paragraph

**Human oversight required:**
- Add personal commentary and insights
- Include tools roundup section
- Polish tone and flow
- Add CTAs and context

### Step 5: Welcome Email Automation

**beehiiv Automation Setup:**
- Rewrote default welcome email
- Added inbox placement suggestion
- **Critical**: Set both trigger AND email to "active" (automations are inactive by default)

**Testing Process:**
- Subscribed with test email
- Verified welcome flow works
- Checked spam folder (first few sends often land there)

## Issues I Hit (and Fixes)

### 1. Domain Confusion (20 minutes lost)
**Problem**: Got confused by mail.howibuild.ai vs newsletter.howibuild.ai vs hello@howibuild.ai
**Root cause**: beehiiv suggests multiple domain options during setup
**Fix**: Use newsletter.howibuild.ai for site, hello@howibuild.ai for contact, ignore mail.howibuild.ai

### 2. beehiiv Page Overload (60 minutes burned)
**Problem**: Default setup adds tags, recommendations, and other pages
**Root cause**: beehiiv tries to create a full content platform, not just newsletter
**Fix**: Strip back to essentials. You can always add more pages later when you have an audience.

### 3. RSS Integration Limitations (10 minutes lost)
**Problem**: beehiiv free plan doesn't support RSS integration
**Root cause**: RSS automation requires Enterprise plan ($99/month)
**Fix**: Created custom Node.js script to generate newsletters from RSS feed

### 4. Image Resizing Issues
**Problem**: beehiiv required specific image dimensions for logos
**Root cause**: SVG files needed exact pixel dimensions
**Fix**: Used `sips` command in terminal to resize SVGs:
```bash
sips -z 64 64 logo.svg --out logo-64.png
```

### 5. Embed Form Location (20 minutes wasted)
**Problem**: Couldn't find subscriber form creation in beehiiv dashboard
**Root cause**: Searched for "embed subscriber" instead of navigating to correct section
**Fix**: Navigate to **Audience → Subscriber Forms** (not obvious location)

## Results & Learnings

**What I shipped:**
- ✅ Professional newsletter site at newsletter.howibuild.ai
- ✅ Integrated signup forms across main site
- ✅ Automated content generation from blog posts
- ✅ Welcome email flow for new subscribers
- ✅ Brand consistency with main site
- ✅ Legal compliance with updated privacy/terms

**Key metrics:**
- Setup time: 6 hours total (including troubleshooting, 3-4 hours should be achievable)
- Cost: $0/month (free tier)
- Semi-automation: 80% of newsletter content generated automatically, 20% human curation

**What I'd do differently:**
1. Start with minimal pages in beehiiv (newsletter + subscribe only)
2. Set up welcome automation immediately after signup
3. Build newsletter automation script before manual newsletter creation

**Tools that saved me:**
- **Claude Desktop**: Step-by-step guidance and troubleshooting
- **Custom semi-automation script**: RSS to newsletter generation with human oversight
- **Cloudflare DNS**: Automated domain configuration with Entri

## Your Turn

The newsletter system is live and ready to grow. If you're building something and want to start building an audience, this approach gives you:

- ✅ Professional newsletter without upfront monthly costs
- ✅ Semi-automated content generation from your blog
- ✅ Seamless integration with your existing site
- ✅ Room to scale as your audience grows

**Next steps**: Start writing, start sharing, start building that audience. The tools are ready.

**Want to see it in action?** Check out [newsletter.howibuild.ai](https://newsletter.howibuild.ai) and [subscribe to get the latest build logs](https://newsletter.howibuild.ai/subscribe).

**Vote on what I should build next:** [Coming Up](https://howibuild.ai/coming-up)
