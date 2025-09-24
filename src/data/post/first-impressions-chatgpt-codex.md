---
publishDate: 2025-09-22T10:00:00.000Z
title: "First Impressions: ChatGPT Codex Opens New Possibilities"
excerpt: I tested ChatGPT's Codex AI coding agent for the first time. It found a typo I missed, added 1,300 lines of test code, and opened my mind to what's possible with AI-assisted development. Here's what happened and why it matters for solo developers.
image: ~/assets/images/ai-assistant-for-typos.png
author: David Webb
category: build-log
tags:
  - ai-assistants
  - development
  - deployment
  - productivity
  - tools
---

I've been curious about AI coding assistants but hadn't found one that felt genuinely useful. Most feel like overhyped autocomplete. But when ChatGPT's Codex launched, I decided to give it a go by connecting it to my howibuild.ai repo and see what it could do.

The results opened my mind to what's possible. It found an embarrassing typo I'd missed, added 1,300 lines of test code (then fixed it when I challenged it), and showed me new ways to think about development workflows. Here's exactly what happened and why it matters for solo developers.

## The Setup Confusion

Codex isn't immediately obvious in ChatGPT and it's not yet rolled out to all ChatGPT Plus and beyond users. I spent 20 minutes looking for it before discovering you need to manually enable it at [chatgpt.com/codex](https://chatgpt.com/codex). Once enabled, you get three options:

- **IDE Extension**: Works with VS Code, Cursor, Windsurf
- **Terminal**: CLI-based interface  
- **Cloud**: Web-based, accessible via ChatGPT

I went with Cloud since I wanted to test the standalone capabilities. The connection process was straightforward. Just connect your GitHub repo and you're ready to go.

## The Test: "Find Issues and Fix Them"

I ran Codex's default query on my howibuild repository:

> _"Go through the codebase, find issues and propose one task to fix a typo, one task to fix a bug, one task to fix a code comment or documentation discrepancy, and one task to improve a test."_

Within minutes, it returned four tasks. The first one made me cringe...

## The Typo That Got Away

Codex found that I'd misspelled "Beehiiv" as "Beehiv" throughout my newsletter post. I'd been writing about Beehiiv for a week and never caught this. The AI spotted it immediately and proposed a fix.

![Codex found the typo I missed](~/assets/images/codex-typo-fix.png)

This was both impressive and embarrassing. How had I missed this? The fix was simple—just a find-and-replace across the file—but it highlighted something important: use AI for what it's good at.

## The 1,500-Line Test Overkill

Codex also proposed adding tests for my vote counting functionality. Great idea, I thought. Then I saw the implementation: 1,300 lines of test code!

This felt excessive for a simple vote counter. I challenged it:

>_"Why have you added 1300 lines of code? That feels excessive..?"_

Codex responded by rewriting the tests using Node.js's built-in `node:test` module instead of pulling in external testing frameworks. The result was much cleaner and more appropriate for the scope.

This interaction serves as a timely reminder: Codex is powerful, but it needs human judgment. It will generate comprehensive solutions, but you need to guide it toward appropriate complexity and continually ask; Is this required? Have we over-engineered this? How can we make it simpler?

## The PR Workflow I Never Use

Once I was happy with the changes, Codex submitted a pull request (PR) through GitHub. This was foreign to me as a solo developer as I typically push directly to production. No PRs, no review process.

But Codex follows standard development practices. It created a PR, I reviewed it, approved it, and it merged to production. The whole process felt more "enterprise" than my usual workflow, but it was actually quite smooth.

## New Possibilities for Solo Developers

Here's where Codex gets interesting: you can delegate tasks via the ChatGPT mobile app. This opens up new ways to stay productive when you're not at your computer. It means that you can go from scrolling endless social feeds on the train or bus, to vibe coding in real-time, which is equal parts exciting and dangerous!

While I haven't fully tested the mobile workflow yet, the concept is intriguing. You could start tasks from your phone, let Codex handle the work, and review results later. It's not full mobile development, but it's a new way to think about productivity and task delegation.

## The Learning Curve and What's Next

Getting started with Codex had some friction—interface confusion, hidden activation, and adjusting to PR workflows as a solo developer. But once I understood the options, it became quite useful.

**Codex's sweet spot:**
- Simple, isolated tasks (typo fixes, test additions, documentation updates)
- Background work while you focus on bigger features
- Task delegation when you're away from your computer

**Not for:** Main feature development, complex architectural decisions, or critical production changes without review.

I haven't fully integrated Codex into my workflow yet, but I'm planning to use it for routine code quality improvements, test coverage, and documentation updates. The key is setting clear boundaries and using it for appropriate tasks, not trying to make it do everything.

## The Bottom Line

Codex surprised me. It found issues I missed, generated appropriate solutions when challenged, and opened my mind to new possibilities in development workflows. 

The real value isn't in the AI doing everything for you—it's in having a reliable assistant that can handle routine tasks while you focus on the work that requires human judgment. Think of it as a task handoff tool that runs in the background, not a replacement for your development workflow.

If you're curious about AI coding assistants, Codex is worth testing. Just remember: it's a tool, not a replacement for good development practices.

---

*Have you tried Codex or other AI coding assistants? What's your experience been? [Vote on what I should explore next](https://howibuild.ai/coming-up) or [subscribe to get notified](https://howibuild.ai) when I share more build logs.*
