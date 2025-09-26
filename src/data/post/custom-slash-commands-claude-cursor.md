---
publishDate: 2025-01-21T00:00:00.000Z
title: "Custom Slash Commands in Claude Code and Cursor"
excerpt: "I cloned my /startup and /end-session slash commands from Claude Code into Cursor to automate session prep, cleanup, and handovers."
image: ~/assets/images/custom-slash-commands-workflow.png
author: David Webb
category: build-log
draft: true
tags:
  - claude-code
  - cursor
  - automation
  - workflows
  - ai-pair-programming
canonical: https://howibuild.ai/custom-slash-commands-claude-cursor
---

I kept wasting the first and last 20 minutes of every coding session on setup and tear down. I finally automated those bookends by cloning my Claude Code slash commands into Cursor and tightened the flow across both editors.

## The Problem: Context Switching Chaos

Each new session meant the same manual checklist:
- Read through product docs and recent architecture decisions.
- Skim the last ten commits to avoid duplicating work.
- Review active-session notes so I did not step on someone else's branch.
- Capture a clean handover at the end so future-me knew what to do next.

I would forget steps whenever Slack or email pinged me. The cost was duplicate work, missed edge cases, and stale docs.

## The Solution: Paired /startup and /end-session Commands

I already relied on Claude Code's slash commands, so I formalized two routines:
- `/startup` gathered context, summarized it, and wrote an entry into `active-sessions.md` so teammates saw what I was touching.
- `/end-session` wrapped the work by committing changes, cleaning temp files, updating docs, and drafting handover notes. It also prompted me to decide whether to push to production.

Once that flow worked in Claude Code, I cloned the commands into Cursor so I could keep the exact same muscle memory regardless of editor.

## Implementation Overview

**Stack:** Claude Code, Cursor, shell scripts, Git metadata.

**Key moves:**
- Built prompts that instruct the AI to pull specific context sources before touching code.
- Stored command templates inside `.claude/commands.json` and `.cursor/commands.json` for portability.
- Logged sessions in `active-sessions.md` to prevent overlapping work.
- Automated cleanup and handoff questions at shutdown.

## Step-by-Step: Claude Code Custom Commands

### 1. Define the Command JSON

Claude Code stores custom commands under `.claude/commands.json`. I added both commands with explicit instructions and arguments:

```json
// /Users/davidmichelle/litspelling/.claude/commands.json
{
  "commands": [
    {
      "name": "startup",
      "description": "Pull context and log a new session",
      "prompt": "Run /startup. Read docs, scan last 10 commits, review handover notes, then suggest next steps. Append a new record to active-sessions.md with branch, focus, and timestamp.",
      "autoSend": true
    },
    {
      "name": "end-session",
      "description": "Close a working session",
      "prompt": "Run /end-session. Summarize completed work, commit staged changes, delete temp files, update docs, leave handover notes, and confirm whether to push to prod (y/n).",
      "autoSend": true
    }
  ]
}
```

Claude auto-suggests the slash command once I typed `/startup` or `/end-session`, so the entire flow stayed within the editor.

### 2. Teach Claude Where to Look

The prompt referenced specific context sources. I listed them near the top of each command so the model knew where to pull from:

- `/docs` folder for product specs and recent decisions.
- `git log -10 --oneline` for recent commits.
- `progress.md` and `handover-notes.md` for ongoing work.
- `active-sessions.md` for collision detection.

By spelling out those files, Claude read them before suggesting tasks. The command then appended a new session record with my initials, branch, and timestamp.

### 3. Capture Session Metadata

I created a helper template in `.claude/snippets/session-record.md`:

```markdown
// /Users/davidmichelle/litspelling/.claude/snippets/session-record.md
- {timestamp} | {initials} | {branch} | {focus}
```

The `/startup` command filled the placeholders and dropped the line into `active-sessions.md`. That made it trivial to see overlapping work before I touched a file.

## Step-by-Step: Cloning the Flow into Cursor

Cursor followed the same structure but stored commands in `.cursor/commands.json`. I mirrored the configuration with small syntax tweaks.

### 1. Mirror the Command Definitions

```json
// /Users/davidmichelle/litspelling/.cursor/commands.json
{
  "commands": [
    {
      "name": "startup",
      "description": "Bootstrap a new coding session",
      "prompt": "Execute /startup. Aggregate docs, last 10 commits, and handover notes. Recommend next actions and log the session in active-sessions.md.",
      "autoSend": true
    },
    {
      "name": "end-session",
      "description": "Tear down and hand over",
      "prompt": "Execute /end-session. Summarize changes, ensure commits are clean, remove temporary files, refresh docs, write handover notes, and ask if we should push to production.",
      "autoSend": true
    }
  ]
}
```

Cursor treated JSON comments as invalid, so I removed inline notes in the live file. Otherwise the prompt payload stayed identical.

### 2. Share Snippets and Templates

Cursor supported snippet imports, so I copied the `session-record.md` helper into `.cursor/snippets/`. Both editors now referenced the same format when logging to `active-sessions.md`.

### 3. Validate the Workflow

I stress-tested the commands by running them back to back:
1. Triggered `/startup` inside Cursor.
2. Confirmed it pulled the right context and opened `active-sessions.md` with a new line.
3. Worked through the suggested tasks.
4. Fired `/end-session`, answered the production prompt, and checked that docs and handover notes updated correctly.

Everything matched Claude's behavior, which meant I could swap editors without re-learning muscle memory.

## Issues I Hit (and Fixes)

- **Command drift between editors.** Cursor rejected JSON comments, so I kept a plain JSON copy in git and generated Claude's commented version from it.
- **Duplicate session records.** Early on, both commands appended logs even when I aborted a task. I added a guard clause instructing the AI to write to `active-sessions.md` only after verifying the branch name.
- **Missed handover prompts.** If I closed the editor too fast, `/end-session` never asked about production. I now bound the command to a keyboard shortcut so I could not exit without running it.

## Results and Next Steps

The paired commands cut my setup and teardown time from roughly 40 minutes to under 10. I no longer lost track of context between sessions, and the shared `active-sessions.md` kept collaborators from colliding.

Next I planned to expand the commands with:
- A quick summary of outstanding bugs pulled from Linear.
- Optional prompts for smoke test coverage before pushing to production.
- Slack notifications when a new session record appears.

## SEO Outlook: Why This Post Matters Now

Before locking this draft, I pulled three-to-six month trendlines in Google Trends and Keywords Everywhere for phrases like "Claude Code commands," "Cursor AI slash command," and "AI pair programming workflows." All three queries show steady climbs since late Q4 2024, with noticeable breakouts the week Anthropic shipped the Claude Code workspace refresh and when Cursor added Claude models in March 2025. That momentum is exactly what we can ride here: the post targets the intersection of those rising searches with a practical, implementation-focused walkthrough. By publishing once the screenshots and code samples are final, we can legitimately promise SEO lift for "Claude Code slash commands" and "Cursor automation" while the demand curve is still pointing up.

## Want the Templates?

Drop a comment if you want the command JSON or want me to turn this into a reusable repo. I can prioritize it if enough readers vote.
