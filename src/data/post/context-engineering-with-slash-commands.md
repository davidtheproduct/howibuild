---
publishDate: 2025-09-26T00:00:00.000Z
title: "Context Engineering with Custom Slash Commands: How to Onboard AI Assistants Fast"
excerpt: "Every AI chat starts from zero. Learn how to use custom slash commands in Claude Code and Cursor for systematic context engineering, the new frontier beyond prompt engineering that's driving onboarding efficiencies."
image: ~/assets/images/zero-to-maximum-context.png
author: David Webb
category: build-log
tags:
  - claude-code
  - cursor
  - automation
  - workflows
  - ai-pair-programming
canonical: https://howibuild.ai/context-engineering-with-slash-commands
---

Every new AI chat is like hiring a builder midway through construction—they arrive with **zero context** about your project, preferences, or what's already been completed. Without the right context, you won't get what you want.

I was losing 40+ minutes every session bringing my AI "builder" up to speed. Each new chat started from zero. The AI had no memory of our project, recent decisions, or current state. It felt like constantly hiring a new contractor who forgot everything between conversations.

The breakthrough was acknowledging this wasn't about automation, it was about **context engineering**. While everyone talks about prompt engineering, the real gains come from systematically managing what context you feed your AI. **Custom slash commands** became my solution for quickly onboarding new AI "team members."

## The Problem: New Builders Need Orientation

![Building with no context](~/assets/images/building-in-the-dark.png)

Every AI chat starts from zero. Unlike human teammates who build institutional knowledge over time, each new conversation begins with a blank slate.

This isn't just a productivity issue, it's a **context engineering** challenge.

When you hire a new builder midway through construction, you don't just point them towards the bathroom and say "finish this." You orient them to the broader project. Show them the floor plan, explain what's completed, introduce them to other workers, and clarify their responsibilities.

The same is true with AI. Every new chat is like hiring a new builder midway through your project. They need to understand:
- ✅ **Project scope**: What are we building and why?
- ✅ **Current state**: What's been completed and what's in progress?
- ✅ **Their role**: What specific tasks are they responsible for?
- ✅ **Available tools**: What resources and systems can they use?
- ✅ **Team context**: What are others working on and how does it connect?

Without systematically providing this context, you're essentially asking them to build with a blindfold on, and one hand tied behind their back!

## The Solution: Giving Your AI Builder the Right Blueprints

**Custom slash commands** aren't just shortcuts, they're context engineering tools that give your AI builder all the information they need from day one.

I rely on two context engineering routines daily:
- `/startup` acts like a comprehensive project briefing, gathering docs, commits, and handover notes before sharing the current state and logging the session
- `/end-session` performs context cleanup and handoff, committing changes, updating docs, and drafting handover notes for the next "new builder"

This approach addresses key context engineering principles:
- **Structured context provision** instead of ad-hoc prompting (like giving blueprints instead of vague _it's probably over there somewhere_ instructions)
- **Systematic information retrieval** from multiple sources (gathering all relevant project files)
- **Context persistence** through session logging and handover notes (maintaining project continuity)
- **Context cleanup** to prevent information decay and tech debt (keeping the workplace tidy)

I've been using this flow successfully in Claude Code for months. I've recently cloned the commands into Cursor to maintain consistent context engineering practices across AI agents. This ensures that all my AI builders always have the right context regardless of which tool I'm using.

## Implementation Overview

**Stack:** Claude Code, Cursor, shell scripts, Git metadata.

**Key moves:**
- Built context engineering prompts that systematically retrieve information from multiple sources
- Stored command templates in `.claude/commands.json` and `.cursor/commands.json` for portability
- Implemented session logging in `active-sessions.md` to prevent overlapping work and maintain context continuity
- Automated context cleanup and handoff questions at shutdown to preserve institutional knowledge

## Step-by-Step: Building Context Engineering Commands

To create your first [custom slash command in Claude Code](https://docs.claude.com/en/docs/claude-code/slash-commands#custom-slash-commands), add a Markdown file to `.claude/commands`. The filename becomes the command name (e.g. `.claude/commands/startup.md` → `/startup`).

### Step 1 - Create `/startup`

```markdown
# ~/.claude/commands/startup.md
---
description: Startup brief to inject targeted project context
---

## Inputs
- Docs: @docs/README.md @docs/decisions.md
- Recent commits (last 10): !`git log --oneline -10`
- Current branch: !`git branch --show-current`
- WIP notes: @progress.md @handover-notes.md

## Task
Recap current state and propose next 3–5 actions:
- Branch and last commits
- Current focus/WIP and owners
- Risks/dependencies
- Recommended tools/agents

## Output
Provide a concise "Startup Brief" with the above sections.
```

Tips:
- Keep files small and focused to avoid token bloat.
- Ask your Agent to critique and refine the command prompt.
- Create simple JavaScript helper files to improve consistency with automation.

### Step 2 - Create `/end-session`

Create `.claude/commands/end-session.md` to recap work, update docs, commit changes, and write handover notes. I like to get it to ask me whether or not I want to push to production y/n. After running `/end-session`, run `/exit` to close MCP connections and avoid token burn (especially with multiple terminals).

### Step 3 - Optional: Log sessions

Use a simple table in `active-sessions.md` to persist context across sessions and teammates.

```markdown
| Started             | Session ID                   | Branch | Focus        | Tool        |
| ------------------- | ---------------------------- | ------ | ------------ | ----------- |
| 2025-09-26 12:00:00 | claude-1727377200-startup    | main   | {focus area} | claude-code |
```

### Step 4 - Test and iterate

- When you first add a command you'll need to close the session `/exit` and restart Claude for it to appear
- Use `/help` to confirm new commands are detected after restart
- Trigger `/startup` and refine the prompt until the brief is immediately useful.
- Add arguments later using `$ARGUMENTS` if you need dynamic parameters.

## Step-by-Step: Cloning the Flow into Cursor

1) Once the Claude Code flow was working, I worked with a Cursor Agent to clone it into Cursor using the same structure `/startup` and `/end-session`. Cursor picks up commands immediately, so no restart required.

2) This included adapting my Claude Code JavaScript helper files to work with Cursor's command system. The key was adapting the file paths and ensuring compatibility with Cursor's execution environment.

3) I tested the commands by running them back to back in Cursor, confirming they pulled the right context and maintained the same workflow as Claude Code. This meant I could swap editors without re-learning muscle memory.

## Issues I Hit (and Fixes)

- **Duplicate session records.** Early on, both commands appended logs even when I aborted a task. I added a guard clause instructing the AI to write to `active-sessions.md` only after verifying the branch name.
- **Missed handover prompts.** If I closed the editor too fast, `/end-session` never asked about production. I now bound the command to a keyboard shortcut so I could not exit without running it.
- **Avoid MCP token burn.** After running `/end-session`, I've learned to run `/exit` to properly close Model Context Protocol connections and prevent token waste in the next session, especially when using multiple terminals.

## Results: No More Building in the Dark
![Building with the right context](~/assets/images/building-with-context.png)
The context engineering approach cut my setup and teardown time from 40+ minutes to under 10 minutes. More importantly, I eliminated the "starting from zero" problem. Each new AI conversation now begins with targeted project context instead of a blank slate.

This highlights the broader shift toward context engineering. Instead of spending time crafting perfect prompts, I now focus on systematically providing the right context to my AI assistants. Like giving a new builder all the blueprints, specs, and project history they need to succeed from day one. The results speak for themselves: faster task completion, fewer errors from a lack of context, and preserved institutional knowledge.

## Why This Matters Now

The industry is shifting from basic prompt engineering to systematic context management as a formal discipline. Companies know that feeding AI assistants structured, relevant context is more important than crafting perfect prompts.

This post tackles a real problem developers face daily: bringing AI assistants up to speed quickly and efficiently. The demand for practical context engineering solutions is only going to increase so I'd love to hear your tips and tricks too.

## Over to You: Build Your First Custom Command

Are you sick of building in the dark? Inject context and build confidence with a simple `/startup` command that pulls your recent commits and project docs. The key is systematically providing context instead of hoping your AI assistant figures it out. Don't get me wrong, they're smart, but they're not magicians.

**Want the templates?** Drop me a line if you want the markdown files and helper scripts.

If this helped shed some light on building in the dark, context engineering and why custom slash commands are useful, consider subscribing and voting on what I should publish next.

- **Subscribe:** [newsletter.howibuild.ai/subscribe](https://newsletter.howibuild.ai/subscribe)
- **Coming Up:** [howibuild.ai/coming-up](https://howibuild.ai/coming-up)
