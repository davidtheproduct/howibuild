// data/upcoming-topics.ts
export interface UpcomingTopic {
  id: string;
  title: string;
  summary: string;
  category?: string;
}

export const upcomingTopics: UpcomingTopic[] = [
  {
    id: 'custom-slash-commands',
    title: 'Custom Slash Commands in Claude Code',
    summary: 'Learn how to create and implement custom slash commands to streamline your AI coding workflow',
    category: 'ai-assistants'
  },
  {
    id: 'cc-sub-agents',
    title: 'Creating Claude Code Sub-Agents',
    summary: 'How to build tailored AI agents in Claude Code that work together to handle complex tasks',
    category: 'ai-assistants'
  },
  {
    id: 'custom-gpt-vs-ai-assistant',
    title: 'Custom GPT vs ChatGPT AI Assistant',
    summary: 'The key differences and when to use each approach for your projects',
    category: 'ai-assistants'
  },
  {
    id: 'supabase-storage-bloat',
    title: 'Save a Bucket Load of Supabase Storage',
    summary: 'Proven strategies to reduce your Supabase storage costs and usage',
    category: 'database'
  },
  {
    id: 'r2-caching-api-costs',
    title: 'Cache Strategies to Reduce API Costs',
    summary: 'How I used Cloudflare R2 for intelligent caching to drastically reduce API costs',
    category: 'architecture'
  },
  {
    id: 'working-concurrently',
    title: 'Working Concurrently',
    summary: 'Moving from working sequentially to working concurrently, safely without breaking things',
    category: 'process'
  },
  {
    id: 'tools-tools-tools',
    title: 'Tools, Tools, Tools',
    summary: 'My daily tech stack, what tools I use and how I employ them to build my products',
    category: 'tools'
  },
  {
    id: 'llm-battles',
    title: 'LLM Battles',
    summary: 'How I use multiple LLMs concurrently and pitch them against each other to get the best results',
    category: 'ai-assistants'
  },
  {
    id: 'community-inspo',
    title: 'The Communities I Learn From',
    summary: 'Backstage preview of the communities I learn from and how they have helped me',
    category: 'community'
  },
  {
    id: 'blog-creation-backstage',
    title: 'Blog creation process and tools',
    summary: 'Backstage reveal of the blog creation process and tools I use',
    category: 'process'
  }
];
