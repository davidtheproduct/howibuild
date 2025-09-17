// utils/posthog.ts
export async function getPostHogVoteCounts(topicIds: string[]): Promise<Record<string, number>> {
  const projectId = import.meta.env.POSTHOG_PROJECT_ID;
  const apiKey = import.meta.env.POSTHOG_API_KEY;
  const host = import.meta.env.POSTHOG_HOST || 'https://us.i.posthog.com';
  
  if (!projectId || !apiKey) {
    console.error('PostHog environment variables not configured');
    return {};
  }
  
  const voteCounts: Record<string, number> = {};
  
  for (const topicId of topicIds) {
    try {
      const response = await fetch(
        `${host}/api/projects/${projectId}/events/?event=topic_vote&properties={"topic_id":"${topicId}"}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      voteCounts[topicId] = data.results?.length || 0;
    } catch (error) {
      console.error(`Error fetching votes for ${topicId}:`, error);
      voteCounts[topicId] = 0;
    }
  }
  
  return voteCounts;
}

export function trackVote(topicId: string, topicTitle: string): void {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture('topic_vote', { 
      topic_id: topicId,
      topic_title: topicTitle,
      timestamp: new Date().toISOString()
    });
  }
}
