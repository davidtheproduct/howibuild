---
publishDate: 2025-09-24T00:00:00.000Z
title: "Monorepo 101: What It Is, Why It Matters, and Things To Consider"
excerpt: A simple guide to monorepos for founders and non‑technical teammates. What a monorepo is, when it helps, when it hurts, and how to wrap your head around it conceptually.
image: ~/assets/images/monorepo-hero.png
author: David Webb
category: build-log
tags:
  - architecture
  - monorepo
  - productivity
  - design-system
  - deployment
---

I stumbled across the term “monorepo” recently when I was researching best practice architecture for more complex products. I'm still upskilling when it comes to Git, deployments and repositories (aka “repos” or your product's source code).

## What is a monorepo?

A monorepo is a single repository that contains multiple apps and shared building blocks (like login, UI, and payments). The alternative is a “many repos” setup where each app lives in its own repo and does not share code.

For solo founders and small teams (≤4 people), the real question isn’t _“what do big tech companies use?”_, it’s _"will this help you ship faster with fewer surprises?"_ Sometimes yes. Sometimes no...

## The picture (two views)

Here’s the high‑level idea and how it maps to domains in the real world.

![Simplified monorepo](~/assets/images/simplified-monorepo.svg)

```text
repo/
  apps/         → Each app has it's on sub directory and source code
    marketing/  → yourdomain.com
      src/
    web/        → app.yourdomain.com
      src/
    admin/      → admin.yourdomain.com
      src/
  packages/     → Shared building blocks used by all apps
    auth/
    ui/
    payments/
    utilities/
    entitlements/
  docs/         → Requirements, plans, notes, and decisions
```

**By contrast two standalone repos might look like this:**
```text
repo-1/          → yourdomain-1.com
  src/
  packages/     → building blocks used by app 1 (not shared)
    auth/
    ui/
    payments/
    utilities/
    entitlements/
  docs/         → Requirements, plans, notes, and decisions

repo-2/          → yourdomain-2.com
  src/
  packages/     → building blocks used by app 2 (not shared)
    auth/
    ui/
    payments/
    utilities/
    entitlements/
  docs/         → Requirements, plans, notes, and decisions
```

### Subdomains vs Proxies
- **Subdomains e.g. admin.yourdomain.com** are operationally simpler and map cleanly to separate deployments.
- **Proxies e.g. yourdomain.com/admin** can feel nice for users, but routing, redirects, and auth callbacks get trickier. If you’re early, prefer subdomains unless you have a strong reason not to. I burned a lot of time on this!

## Top Level Business Benefits

- Faster shipping: change a shared thing once (e.g., brand from green to blue) and all apps benefit.
- Consistent brand: the same button styles and UI patterns show up everywhere.
- Independence: one app can go down without taking the others with it; deploy fixes to just the app that needs them.

![Business value](~/assets/images/monorepo-business-value.svg)

### Benefits (solo founder lens)
- One source of truth for shared components (auth, UI, payments, utilities)
- Less duplication, easier updates, clearer ownership
- Fewer version mismatches across apps
- Shared tooling, linting, and CI improve quality

(These themes show up repeatedly in guides and case studies: collaboration and consistency are the most cited wins [mindfulchase.com](https://www.mindfulchase.com/deep-dives/monorepo-fundamentals-deep-dives-into-unified-codebases/getting-started-with-monorepo-architecture-best-practices-and-principles.html), [howik.com](https://howik.com/best-practices-for-javascript-monorepos).)

## Drawbacks / pitfalls (what actually hurt)
- Up‑front investment: getting structure, scripts, and CI right takes longer upfront but it's likely to save time later.
- Bigger repo can slow builds/CI if you don’t enable caching or incremental builds.
- Tooling complexity rises (workspaces, task runners) and needs deliberate setup.
- Access control can get tricky without clear folder ownership.
- Lockfile/dependency drift in workspaces: when versions or peer dependencies fall out of sync across `apps/*` and `packages/*`, installs break. Use the same Node version everywhere and avoid changing the lockfile during CI installs.

Most gotchas are performance, ownership boundaries, and dependency hygiene related. Counter with incremental builds, caching, explicit ownership, and CI that only runs checks for the parts you changed.

## Visual guide to what’s actually “shared”

Think of a package as a reusable feature that each app can import and leverage without doing the heavy lifting of building from scratch.

Left column = package names. Columns = apps within the monorepo. Filled cells = app uses the package.

- P1 Auth, P2 UI, P3 Payments, P4 Utilities, P5 Entitlements

![Shared packages matrix](~/assets/images/packages-matrix.svg)

## Consistent UI in practice

Whether you import a React button or apply a CSS class on a static page, the result looks and feels the same across all apps. This means that should your brand change in the future, you'll have a 'control tower' of sorts ready to go. Make the change once and it automatically cascades across all apps in the monorepo that consume that element. This is the power and 'magic' of a monorepo.

![Button consistency](~/assets/images/button-consistency.svg)

## Should you consider a monorepo?

Choose a monorepo if:
- ✅ You have multiple apps that should share clearly defined building blocks
- ✅ You want one design system and one login that work everywhere
- ✅ Your team collaborates closely and prefers shared tooling and conventions
- ✅ You have the time, patience, and technical skills to spend additional time upfront on architecture

Stick with multiple repos if:
- ❌ Projects are unrelated and won't share code
- ❌ You need strict, separate governance or vendor boundaries per app
- ❌ You want to keep each app's lifecycle completely independent
- ❌ You don't want to invest upfront time getting it right

## Top tips if you're considering a monorepo

### Planning & Migration
- **Invest time upfront in planning** - Consider something like [ChatPRD](https://chatprd.ai) to build out your requirements
- **Document what works** - If moving from multiple repos, capture what works well so that you are not starting from scratch
- **Create a migration folder** - Copy useful files from old repos for reuse in your monorepo
- **Question complexity** - Continually ask _"is this the simplest way we can do this?"_ and seek evidence-based research when considering recommendations

### Technical Setup
- **Prefer proven components** - Use out-of-the-box solutions like shadcn/ui to avoid unnecessary complexity
- **Add ENV tracking early** - Configure `turbo.json` properly, or production can silently use wrong environment variables
- **Prevent dependency bloat** - Add `pnpm` overrides in root `package.json` to avoid duplicate Tailwind/PostCSS versions

### Deployment & Ownership
- **Independent deployments** - Keep deployments separate per app from day one
- **Clear ownership boundaries** - Document ownership for `apps/*` and `packages/*` to avoid accidental cross-coupling

## Getting started

If you want to try this quickly in JavaScript/TypeScript, start by reading the official Turborepo docs: [turbo.build](https://turbo.build/)

Tips:
- Extract one shared package first (UI or Auth).
- Add caching and incremental builds before CI slows down.
- Use the same Node version everywhere and avoid changing the lockfile during CI installs.

## Wrap‑up

If this helped demystify monorepos, consider subscribing for more founder‑focused build logs and vote on what I should tackle next.

- Subscribe: [newsletter.howibuild.ai/subscribe](https://newsletter.howibuild.ai/subscribe)
- Coming Up: [howibuild.ai/coming-up](https://howibuild.ai/coming-up)