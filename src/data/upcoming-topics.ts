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
    id: 'sub-agents',
    title: 'Creating Sub-Agents',
    summary: 'How to build specialized AI agents that work together to handle complex tasks',
    category: 'ai-assistants'
  },
  {
    id: 'custom-gpt-vs-assistant',
    title: 'Custom GPT vs ChatGPT Assistant',
    summary: 'The key differences and when to use each approach for your projects',
    category: 'ai-assistants'
  },
  {
    id: 'supabase-storage-optimization',
    title: 'Save a Bucket Load of Supabase Storage',
    summary: 'Proven strategies to optimize your Supabase storage costs and usage',
    category: 'database'
  },
  {
    id: 'r2-caching-api-costs',
    title: 'R2 Caching to Cut Down on API Costs',
    summary: 'How I used Cloudflare R2 for intelligent caching to reduce API expenses',
    category: 'tools'
  },
  {
    id: 'monorepo-design-system',
    title: 'Monorepo Design System Chaos',
    summary: 'Lessons learned from managing design systems across multiple repos',
    category: 'design-system'
  }
];
