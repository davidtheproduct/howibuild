---
publishDate: 2025-09-12T00:00:00Z
title: Monorepo Mayhem & Database Drama
excerpt: Midway through merging three repos into a monorepo, my build broke due to exposed security keys. Here's how I fixed my deployment and secured my database.
image: ~/assets/images/database-dramas.png
author: David Webb
category: build-log
tags:
  - monorepo
  - database
  - security
  - supabase
  - deployment
---

## The Merge That Broke Everything

I'm midway through merging three separate repos—core app, marketing CMS, and admin backend—into a single "monorepo". Yesterday, my build broke thanks to exposed security keys...WHOOPS!!

Today's goal is to fix my broken deployment, secure my database and get things working again...

## When AI Tools Make Stuff Up

AI tools are great, but sometimes they just make stuff up! Claude Code kept giving advice without checking my actual database! So, I had to tell it to stop guessing and look at the facts!!

## The Power of Transparency

Sometimes, the best tool is the one with the greatest transparency, closest to the source. Using Supabase's SQL Editor to copy and paste from Cursor meant I didn't have to worry about database permissions, and could double-check everything with Supabase's AI assistant.

## Securing the Database

I was able to connect my database to my new spelling app and locked it down with the right permissions—row level security for both admin and anonymous users. Now, only the right people can access the data, keeping everything safe!

## What's Next?

It's late, so I'm not sure what's next...I'll check my migration plan and pick one of three things:

1. **Uplift the UX** to match my old site
2. **Implement a design system** to improve the UI  
3. **Figure out if the service worker** is still needed, and why

Stay tuned!

---

*Building in the trenches, one database drama at a time.*