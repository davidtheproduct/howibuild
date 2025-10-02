---
title: Go slow to go fast!
excerpt: "Why planning with AI matters more than ever, and how to stop stumbling when you’re building with LLMs."
publishDate: 2025-01-01T00:00:00.000Z
author: Tabish Bidiwale
category: build-log
tags:
  - AI
  - prompting
  - developer-tools
image: ~/assets/images/your-cover-image.png
---

Here’s the thing: there’s never been a better time to be building, whether it’s tinder for dogs or something that actually matters.  
Yet with all this power in the palm of our hands, we’re still stumbling.  

AI has let us build faster than ever before, and still we hear the same complaints:

* “That’s not what I asked for…”
* “Why did you add that?”
* “This is way too complex…”
* “You forgot to…”

We blame the tool: *AI slop, context rot, prompt hell.*  
But the truth is this is less about the tool, and more about how we are using it.

---

## Who am I?

Wait, you’re probably wondering who’s this guy?  

I’m Tabish. I’ve been a dev for 6+ years. I like Formula 1, Seinfeld and Arrested Development quotes, and I build tools for myself and other devs.  

I’ve been deep into AI since Sonnet 3.5 came out, which was the first model that (in my opinion) gave us a real glimpse of what AI-assisted programming could become.

---

## Why we keep tripping up

Software engineering has always been about working within constraints. Building with LLMs is no different. It is a game of squeezing out the best performance so we can ship to production, not just prototypes.  

Like most skills, this takes practice. Geoff Huntley, a fellow Aussie, describes it like learning to play an instrument. You get better over time, but it takes deliberate, intentional practice.  
[Source](https://ghuntley.com/play/)

The good news is many of the habits that make coding agents work better are the same ones we have known in traditional software engineering for years. We just forget them because when you are handed a rocket ship, who stops to plan the flight path?

---

## What doesn’t work

Before we talk about what works, let’s call out the traps:

* Trying to build an entire app in a single chat
* Not breaking work into smaller, testable units
* Skipping research
* Not understanding what you are trying to build

The common thread is bad alignment and bad context.  

Think about how you would mentor a junior engineer. What background, requirements, and scaffolding would they need to succeed? LLMs are no different. The bigger the task, the more structure they need.

---

## The simplest loop

Forget the frameworks and prompt templates for a second. Let’s go back to basics.  

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

---

## The next level up: Specs

Planning is good, but it only explains how you will do something. To actually get what you want, you need to clarify what you are building.  

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

And here is the kicker: do not just ask AI to generate specs or plans and walk away. This is where your brain matters most.  
It is way easier to debate a **500-line spec** than review **5000 lines of code**. If you spend effort anywhere, spend it here.

---

## Other patterns that help

**Fail fast, learn fast**  
Do not get precious with code. Try three small versions of an idea. Note what worked and what failed. Feed that back in. I often start big projects with scrappy prototypes, and after that the spec and plan practically write themselves.

**Version control hygiene**  
When you ship faster, hygiene matters more. Branch often. Commit often. Use worktrees. Make it easy to throw code away and roll back.

**Pick the right model for the job**  
High reasoning models for planning and design. Fast models for boilerplate and refactors. Match tool to task.

**Manage session context like your life depends on it**  
Ever notice how LLMs are sharpest at the start of a session? That is context rot. Ignore the marketing, your “1M token context window” is rarely all usable. Reset often.

**Be careful with MCP tools**  
They are powerful, but every tool definition eats into your usable context. Do not bloat your sessions.

---

## Closing

“Go slow to go fast” is not about slowing your pace. It is about deliberate scaffolding.  
Specs, research, plans, alignment.  

Build those in and you stop stumbling. You turn AI from an intern who “doesn’t get it” into a true collaborator.  
And that is how you actually go fast.
