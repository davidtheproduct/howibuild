---
title: Go slow to go fast!
excerpt: "Why planning with AI matters more than ever, and how to stop stumbling when you're building with LLMs."
publishDate: 2025-01-01T00:00:00.000Z
author: Tabish Bidiwale
category: build-log
tags:
  - AI
  - prompting
  - developer-tools
image: ~/assets/images/your-cover-image.png
<!-- 
FRONTMATTER FIXES NEEDED:
1. Title: Make it more specific and SEO-friendly
   Example: "How I Cut AI Development Time 50% with Spec-First Planning"
   
2. Excerpt: Add specific outcome and character count (150-155)
   Example: "Tired of AI generating the wrong code? I discovered a Research → Plan → Implement workflow that cut my dev time from 3 days to 6 hours. With real examples."
   
3. Image: Create actual diagram showing the workflow
   Example: ~/assets/images/go-slow-go-fast-workflow.png
   
4. publishDate: Use actual current date (not 2025-01-01)
-->
---


Here's the thing: there's never been a better time to be building, whether it's tinder for dogs or something that actually matters.  
Yet with all this power in the palm of our hands, we're still stumbling.  

AI has let us build faster than ever before, and still we hear the same complaints:

* “That’s not what I asked for…”
* “Why did you add that?”
* “This is way too complex…”
* "You forgot to…"

We blame the tool: *AI slop, context rot, prompt hell.*  
But the truth is this is less about the tool, and more about how we are using it.


## Who am I?

Wait, you're probably wondering who's this guy?  

I'm Tabish. I've been a dev for 6+ years. I like Formula 1, Seinfeld and Arrested Development quotes, and I build tools for myself and other devs.  

I've been deep into AI since Sonnet 3.5 came out, which was the first model that (in my opinion) gave us a real glimpse of what AI-assisted programming could become.

More recently I've released an open-source project called OpenSpec, that helps devs everywhere get better alignment and results from their coding assistants through specs. It's had it's mini-viral moment going to the top of of r/cursor subreddit and amassing almost 400 stars in a week.

I'll be talking more about it later in the post talking about how I dogfooded the product heavily, using OpenSpec to make OpenSpec. 

## Why we keep tripping up

Software engineering has always been about working within constraints. Building with LLMs is no different. It is a game of squeezing out the best performance so we can ship to production, not just prototypes.  

Like most skills, this takes practice. Geoff Huntley, a fellow Aussie, describes it like learning to play an instrument. You get better over time, but it takes deliberate, intentional practice.  
[Source](https://ghuntley.com/play/)

The good news is many of the habits that make coding agents work better are the same ones we have known in traditional software engineering for years. We just forget them because when you are handed a rocket ship, who stops to plan the flight path?


## What doesn't work


Before we talk about what works, let's call out the traps:

* Trying to build an entire app in a single chat
* Not breaking work into smaller, testable units
* Skipping research
* Not understanding what you are trying to build

The common thread is bad alignment and bad context.

<!-- Show the cost of bad alignment
Example visualization:
"The Alignment Tax:
- No spec: 3 rewrites = 12 hours wasted = $600 in API costs
- With spec: 0 rewrites = 2 hours total = $40 in API costs

[Create simple bar chart showing time/cost comparison]"
-->  

Think about how you would mentor a junior engineer. What background, requirements, and scaffolding would they need to succeed? LLMs are no different. The bigger the task, the more structure they need.

---

## The simplest loop

Forget the frameworks and prompt templates for a second. Let's go back to basics.  

For small fixes like a bug or a function, just prompt the agent directly. Most modern models can handle that.  

But for bigger tasks, here is the simplest loop that works:

**Research → Plan → Implement**

1. **Research**  
   Get the model to gather docs, confirm library versions, collect examples. Output it all to a file like `research.md`.

2. **Plan**  
   Break things down into phases and steps. Write clear success criteria. Make the implicit explicit.

3. **Implement**  
   Use the plan as scaffolding. Implement one testable phase at a time. Keep sessions small. Reset often.

That is it. That minimal scaffolding turns your chat toy into a real partner.


## The next level up: Specs

Planning is good, but it only explains the *how*. To actually get what you want, you need to clarify the *what* .  

That is where **specs** come in. Specs define:

* What is in scope and what is out
* What matters and what does not
* Acceptance criteria and non-goals
* Constraints, interfaces, edge cases

Specs are the highest leverage part of the pipeline:  

- Get the spec right and research gets easier  
- Get research right and plans get sharper  
- Get plans right and implementation becomes simple execution  

Start at the top and you cascade success. Get it wrong and you cascade failure.

<!-- Add cascade failure example
Example:
"How one bad spec line cascaded into 2 days of waste:

Spec line: 'Support real-time updates'
↓
AI interpreted as: Need WebSocket server
↓  
Added: Socket.io, Redis, pub/sub architecture
↓
Result: 3,000 lines of unnecessary complexity

The fix: Changed to 'Poll for updates every 30 seconds'
Result: 50 lines of simple code"
-->  

And here is the kicker: do not just ask AI to generate specs or plans and walk away. This is where your brain matters most.  
It is way easier to debate a **500-line spec** than review **5000 lines of code**. If you spend effort anywhere, spend it here.

<!-- Add leverage visualization
Create a diagram showing:
- 1 line of spec error → 10 lines of plan errors → 100 lines of code errors
- Time to fix: 1 minute vs 10 minutes vs 2 hours

Include real example:
"I once had 'support multiple users' in my spec. The AI added:
- User authentication system
- PostgreSQL instead of SQLite  
- JWT tokens
- Password reset flows
- 2,000 lines of unnecessary code

Removing those 3 words from the spec saved a day of work."
-->

---

## Other patterns that help

**Fail fast, learn fast**  
Do not get precious with code. Try three small versions of an idea. Note what worked and what failed. Feed that back in. I often start big projects with scrappy prototypes, and after that the spec and plan practically write themselves.

<!-- Show actual prototype iterations
Example:
"Building a markdown parser - 3 attempts in 90 minutes:

Attempt 1 (20 min): Regex-based
- ✅ Fast
- ❌ Broke on nested elements
- Lesson: Need proper tokenization

Attempt 2 (35 min): Hand-rolled parser
- ✅ Handled nesting  
- ❌ 500+ lines of code
- Lesson: Too complex to maintain

Attempt 3 (35 min): Marked.js + custom renderer
- ✅ 50 lines of code
- ✅ Battle-tested parser
- ✅ Easy to extend

Final spec incorporated all these learnings."
-->

**Version control hygiene**  
When you ship faster, hygiene matters more. Branch often. Commit often. Use worktrees. Make it easy to throw code away and roll back.

**Pick the right model for the job**  
High reasoning models for planning and design. Fast models for boilerplate and refactors. Match tool to task.

**Manage session context like your life depends on it**  
Ever notice how LLMs are sharpest at the start of a session? That is context rot. Ignore the marketing, your "1M token context window" is rarely all usable. Reset often.

<!-- Add context management metrics
Example:
"Real numbers from my last project:

Context Usage | Code Quality | Success Rate
0-40%        | Excellent    | 95%
40-60%       | Good         | 80%
60-80%       | Degraded     | 60%
80%+         | Poor         | 30%

When I hit 60%, I compact:
- Save progress to progress.md
- Start fresh session
- Include only essential context

This graph shows why: [Add visual showing response quality vs context usage]"
-->

**Be careful with MCP tools**  
They are powerful, but every tool definition eats into your usable context. Do not bloat your sessions.

<!-- Add tool management example
Example:
"Context usage with different tool configurations:

All MCP tools enabled: 45% context used before writing code
Core tools only: 15% context used
Custom minimal set: 8% context used

My rule: Start with no tools, add only when needed."
-->

---

## Enough theory, let's put it into practice

<!-- TABISH: This is where you make the post shine! Turn it from advice into a real build log -->

Now let me show you how I actually use this approach every day. I'm building [OpenSpec](https://github.com/Fission-AI/OpenSpec/), a spec-driven development toolkit that helps AI coding assistants understand exactly what to build before writing any code.

Yes, I'm using spec-driven development to build a spec-driven development tool. It's meta, but it's also the perfect proof that this methodology works.

### Building OpenSpec Feature by Feature

<!-- POINTER 1: Show 2-3 real features you built with this methodology
Example structure for each feature:

#### Feature: Adding the /openspec:proposal Slash Command

**The Problem**: [What specific challenge were you solving?]

**Research Phase** (15 minutes):
- Show snippets from your actual research.md
- What existing code/patterns did you discover?
- What constraints did you identify?

**Spec Creation** (30 minutes):
- Show your actual proposal.md from openspec/changes/
- Include the key requirements you defined
- Show any acceptance criteria

**Implementation** (X hours):
- Show your tasks.md with checkboxes
- Include 1-2 key code snippets
- Mention any surprises or pivots

**Results**:
- Time taken vs estimate
- Quality of first implementation
- Number of revisions needed
-->

#### Feature 1: [Your first OpenSpec feature]

[Fill in following the pattern above]

#### Feature 2: [Your second OpenSpec feature]

[Fill in following the pattern above]

### The Meta Experience: Dogfooding Our Own Tool

<!-- POINTER 2: Share insights about using your own methodology
- What worked better than expected?
- What patterns emerged across features?
- How did the specs evolve as you learned?
- Show a screenshot of your openspec/changes/ directory
-->

[Your insights here]

### Metrics That Matter

<!-- POINTER 3: Quantify your results
- Average time from idea to working code
- Percentage of features that needed major revisions
- Time saved compared to your old workflow
- Lines of specs vs lines of code generated
- API token costs per feature
-->

Since I started building OpenSpec this way:
- [Add your metrics]

### What This Means for You

<!-- POINTER 4: Connect back to the reader
- How can they start using this approach?
- Should they try OpenSpec? When is it ready?
- What's the minimum viable version of this methodology?
-->

[Your recommendations]

---

## Closing

<!-- Add concrete results and CTA
Example:
"My results after 30 days using this approach:
- Average feature time: 8 hours → 3 hours
- Code rewrites: 3-4 per feature → 0.5
- First-PR approval rate: 60% → 95%
- Monthly velocity: 5 features → 12 features

Total time invested in learning: 10 hours
Time saved in first month: 40+ hours

Want to try this yourself? Here are my templates:
- [Download my spec template](link)
- [Get the research prompt](link)  
- [Watch me build a feature live](link)

Questions? Find me on Twitter @tabishbidiwale"
-->

"Go slow to go fast" is not about slowing your pace. It is about deliberate scaffolding.  
Specs, research, plans, alignment.  

Build those in and you stop stumbling. You turn AI from an intern who "doesn't get it" into a true collaborator.  
And that is how you actually go fast.

<!-- Add final image
Create a before/after workflow diagram:

BEFORE:
Idea → Chat for 3 hours → Wrong solution → Start over → Frustration

AFTER:  
Idea → Spec (30min) → Research (15min) → Plan (30min) → Build (2hr) → Ship ✓
-->

<!-- MISSING SECTIONS TO ADD:

## The Tools and Setup (optional - could be brief)
- VS Code + Continue/Cursor
- Claude 3.5 Sonnet 
- Git worktrees setup
- Actual costs ($X per feature)

## Download My Templates (optional - or link to OpenSpec)
- Link to GitHub repo with templates
- Video walkthrough
- Example completed project

## Common Pitfalls and How to Avoid Them (optional)
[List specific problems with solutions]

TARGET LENGTH: With the OpenSpec section filled in, you should easily hit 2,000-2,500 words.
-->
