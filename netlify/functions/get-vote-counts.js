exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { topicIds } = event.queryStringParameters || {};
  
  if (!topicIds) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'topicIds parameter required' })
    };
  }

  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!projectId || !apiKey) {
    console.error('PostHog environment variables not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    const topicIdArray = topicIds.split(',');
    const voteCounts = {};

    // Fetch vote counts for each topic
    for (const topicId of topicIdArray) {
      try {
        const response = await fetch(
          `${host}/api/projects/${projectId}/events/?event=topic_vote&properties=${encodeURIComponent(JSON.stringify({ topic_id: topicId }))}`,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          console.error(`PostHog API error for ${topicId}:`, response.status);
          voteCounts[topicId] = 0;
          continue;
        }

        const data = await response.json();
        voteCounts[topicId] = data.results?.length || 0;
      } catch (error) {
        console.error(`Error fetching votes for ${topicId}:`, error);
        voteCounts[topicId] = 0;
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ voteCounts })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
