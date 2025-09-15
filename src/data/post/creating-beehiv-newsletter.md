---
title: Creating a Beehiv Newsletter for howibuild
excerpt: How I set up a complete newsletter system using Beehiv, from domain configuration to automated content generation. A step-by-step guide for founders who want to start building an audience.
pubDate: 2025-09-15
image: ~/assets/images/newsletter-creation.png
tags:
- newsletter
- beehiv
- email-marketing
- automation
- audience-building
- tools
---

# Creating a Beehiv Newsletter for howibuild

After launching howibuild.ai, I knew I needed a way to build an audience and share regular updates. Today I set up a complete newsletter system using Beehiv - here's the step-by-step process and lessons learned.

## The Challenge

I'm not a Marketer by trade and have not been hands on with modern email marketing platforms, so it was a reasonably steep learning curve.

I wanted a newsletter system that could:
- Grow with my audience (start free, scale up)
- Integrate seamlessly with my existing site
- Semi-automate content generation from my blog posts
- Look professional and match my brand

After researching options via Claude and ChatGPT, I landed on **Beehiv** for its simplicity and growth potential.

## Step 1: Research & Signup (30 mins)

**Research Process:**
- Asked Claude and ChatGPT to compare newsletter platforms
- Focused on: ease of setup, pricing, templates, automation
- **Winner**: Beehiv for its free tier and clean interface

**Signup:**
- Created account on Beehiv free plan
- Verified email and completed onboarding
- **Key insight**: Free plan is generous enough to start building an audience

## Step 2: Domain Configuration (30 mins)

**Critical Step**: Linking Beehiv to howibuild.ai domain without overriding my existing site.

**What I did:**
1. Added `newsletter.howibuild.ai` as subdomain in Beehiv
2. Used Beehiv's domain automation to configure DNS rules in Cloudflare
3. **Watchout**: Beehiv has website creation capability - don't accidentally override your main site!

This creates a dedicated newsletter site at `newsletter.howibuild.ai` while keeping your main site untouched.

## Step 3: Brand Customization (30 mins)

**Template Selection:**
- Selected newsletter and email templates
- Changed font to **'Inter'** (matches main site)
- Set primary color to **#22D3EE** (consistent cyan accent)

**Pro tip**: Spend time on branding consistency. Your newsletter should feel like part of your main site, not a separate entity.

## Step 4: Newsletter Site Setup (30 mins)

**Created newsletter.howibuild.ai in Beehiv**

**Critical decision**: Stripped back to essentials only:
- ✅ Newsletter page (shows all weekly newsletter publications)
- ✅ Subscribe page
- ❌ Tags page (removed)
- ❌ Recommendations page (removed)
- ❌ Other default pages (removed)

**Why this matters**: Beehiv tries to add lots of default pages. For a simple newsletter, you only need the core functionality. You can always add more pages later when you have an audience.

![Beehiv default pages that aren't needed for a simple newsletter](~/assets/images/additional-pages-not-required.png)

## Step 5: Subscriber Form Creation (30 mins)

**Found the embed form:**
- Navigated to **Audience → Subscriber Forms**
- Created new form with custom styling
- Copied embed code

**Implementation in Cursor:**
```astro
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

**Pro tip**: Save this as a reusable component in your website builder. Beehiv won't let you reuse embedded forms on their platform until you upgrade to a paid plan.

## Step 6: Site Integration (30 mins)

**Updated legal pages:**
- Rewrote Privacy Policy with simple, clear language
- Updated Terms of Service with liability disclaimers
- Added footer links to both pages

**Added subscriber form across site:**
- Created `NewsletterSignup.astro` component
- Added to `PageLayout.astro` above footer
- Included Beehiv attribution tracking script

**Result**: Newsletter signup appears consistently above footer on all pages.

## Step 7: Content Automation (60 mins)

**The RSS Challenge:**
Beehiv doesn't allow RSS integration until Enterprise plan ($99/month). I needed a workaround.

**Solution**: Created automated newsletter generation script:

```bash
# Generate newsletter from RSS feed
node generate-newsletter.js 2025-09-09 "This week was wild..."
```

**Process:**
1. Script fetches [RSS feed](https://howibuild.ai/rss.xml)
2. Filters posts from specified week
3. Generates markdown using post excerpts
4. Creates newsletter template with build logs section
5. Takes manual input to auto-populate opening e.g. _"This week was wild..."_

**Manual steps after automation:**
- Copy generated content into Beehiv
- Add tools roundup section
- Tweak, polish and send

## Step 8: Welcome Flow Setup (30 mins)

**Created welcome automation in Beehiv:**
- Slight rewrite of default welcome email
- Added suggestion to move email to inbox
- **Critical**: Set both trigger AND email to "active" - automations are inactive by default

**Testing**: Subscribed with test email to verify flow works. Don't forget to search your spam folder for the first few sends.

## Step 9: First Newsletter Creation (90 mins)

**Used automation script** to generate draft from recent posts:
- Analyzed RSS feed for latest content
- Used post excerpts for newsletter content
- Generated structured newsletter with build logs section

**Human editing:**
- Added personal commentary
- Included tools roundup
- Added CTAs for forwarding and getting involved
- Polished tone and flow

**Result**: [Weekly Wrap: Issue 01](https://newsletter.howibuild.ai/p/weekly-wrap-issue-01) - professional newsletter showcasing the week's build logs.

Note: subsequent newsletters will be much faster to create and send.

## Key Challenges & Solutions

### 1. Domain Confusion (lost 20mins)
**Problem**: Got confused by mail.howibuild.ai vs newsletter.howibuild.ai vs hello@howibuild.ai
**Solution**: Use newsletter.howibuild.ai for the site, hello@howibuild.ai for contact, do not need mail.howibuild.ai for now.

### 2. Beehiv Page Overload (burned 60mins)
**Problem**: Default setup tries to add tags, recommendations, and other pages
**Solution**: Strip back to essentials. You can always add more later when you have an audience.

### 3. RSS Limitations (lost 10mins)
**Problem**: Beehiv free plan doesn't support RSS integration
**Solution**: Created custom automation script to generate newsletters from RSS feed

### 4. Image Resizing 
**Problem**: Beehiv wanted specific image dimensions
**Solution**: Used `sips` command in Cursor terminal to resize SVGs to exact dimensions

### 5. Finding Embed Forms (wasted 20mins)
**Problem**: Took a while to locate subscriber form creation
**Solution**: Navigate to **Audience → Subscriber Forms** (not obvious location as I was searching for 'embed subscriber')

## Tools & Resources Used

- **Beehiv** - Newsletter platform (NEW)
- **Claude Desktop** - Step-by-step guidance and troubleshooting
- **Cursor** - Code editing and automation
- **Cloudflare** - DNS management
- **Custom automation script** - RSS to newsletter generation (NEW)

## The Result

- ✅ **Professional newsletter site** at newsletter.howibuild.ai
- ✅ **Integrated signup forms** across main site
- ✅ **Automated content generation** from blog posts
- ✅ **Welcome email flow** for new subscribers
- ✅ **Brand consistency** with main site
- ✅ **Legal compliance** with updated privacy/terms

## Key Learnings

### 1. Start Simple, Scale Later
Don't get caught up in all the features Beehiv offers. Start with newsletter + subscribe pages, add more as you grow.

### 2. Automation Saves Time
Even without RSS integration, a simple script can automate newsletter content generation from your blog posts.

### 3. Brand Consistency Matters
Matching fonts, colors, and tone between your main site and newsletter creates a cohesive experience.

### 4. AI Assistance is Invaluable
Used Claude Desktop throughout the process for guidance, troubleshooting, and automation. Screenshots + questions = instant help.

### 5. Test Everything
Subscribe with test emails, check automation flows, verify DNS propagation.

## Your Turn

The newsletter system is now live and ready to grow. If you're building something and want to start building an audience, this approach gives you:

- Professional newsletter without monthly costs
- Automated content generation
- Seamless integration with your existing site
- Room to grow as your audience grows

**Next steps**: Start writing, start sharing, start building that audience. The tools are ready. Oh and while you're here don't forget to subscribe below!

---

*Want to see the newsletter in action? Check out [newsletter.howibuild.ai](https://newsletter.howibuild.ai) and [subscribe to get the latest build logs](https://newsletter.howibuild.ai/subscribe).*
