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
    id: 'monorepo-case-study',
    title: 'What is a Monorepo and is it worth it?',
    summary: 'Weighing up the pros and cons of a monorepo vs a traditional multi-repo setup',
    category: 'architecture'
  },
  {
    id: 'community-inspo',
    title: 'The Communities I Learn From',
    summary: 'Backstage preview of the communities I learn from and how they have helped me',
    category: 'community'
  }
];
