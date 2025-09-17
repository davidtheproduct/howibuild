# ThumbsUpButton Component Usage

## Overview
The `ThumbsUpButton` component is now reusable across your entire site. You can add voting to any page, blog post, or section.

## Basic Usage

```astro
---
import ThumbsUpButton from '~/components/ui/ThumbsUpButton.astro';
---

<ThumbsUpButton 
  topicId="my-topic-id"
  topicTitle="My Topic Title"
  initialVoteCount={0}
/>
```

## Props

- **`topicId`** (required): Unique identifier for the topic
- **`topicTitle`** (required): Display title for the topic  
- **`initialVoteCount`** (optional): Starting vote count (defaults to 0)
- **`className`** (optional): Additional CSS classes

## Examples

### On Blog Posts
```astro
---
import ThumbsUpButton from '~/components/ui/ThumbsUpButton.astro';
---

<article>
  <h1>My Blog Post Title</h1>
  <p>Content here...</p>
  
  <div class="mt-8 text-center">
    <p class="text-sm text-gray-400 mb-2">Found this helpful?</p>
    <ThumbsUpButton 
      topicId={`blog-post-${Astro.url.pathname}`}
      topicTitle="My Blog Post Title"
      initialVoteCount={0}
    />
  </div>
</article>
```

### On Individual Topics
```astro
<ThumbsUpButton 
  topicId="custom-slash-commands"
  topicTitle="Custom Slash Commands in Claude Code"
  initialVoteCount={5}
  className="text-lg"
/>
```

### With Custom Styling
```astro
<ThumbsUpButton 
  topicId="my-topic"
  topicTitle="My Topic"
  initialVoteCount={0}
  className="text-2xl border-red-400 text-red-400 hover:bg-red-400"
/>
```

## PostHog Integration

All votes are automatically tracked in PostHog with:
- Event: `topic_vote`
- Properties: `topic_id`, `topic_title`, `timestamp`

## Features

- ✅ **Optimistic Updates**: Votes appear immediately
- ✅ **PostHog Tracking**: Automatic analytics
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Accessible**: Proper button semantics
- ✅ **Customizable**: CSS classes and styling options

## Future Enhancements

Potential additions:
- Vote persistence (prevent duplicate votes)
- Different vote types (👍 👎)
- Vote animations
- Vote limits per user
- Comments on votes
