import test from 'node:test';
import assert from 'node:assert/strict';
import defaultHandler, { handler as namedHandler } from '../netlify/functions/get-vote-counts.js';

const handler = typeof namedHandler === 'function' ? namedHandler : defaultHandler;
const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

const restoreEnvironment = () => {
  process.env = { ...originalEnv };
  if (originalFetch) {
    globalThis.fetch = originalFetch;
  } else {
    Reflect.deleteProperty(globalThis, 'fetch');
  }
};

test.beforeEach(() => {
  restoreEnvironment();
});

test.afterEach(() => {
  restoreEnvironment();
});

test('returns 405 when HTTP method is not GET', async () => {
  const response = await handler({ httpMethod: 'POST' });

  assert.strictEqual(response.statusCode, 405);
  assert.deepStrictEqual(JSON.parse(response.body), { error: 'Method not allowed' });
});

test('returns 400 when topicIds are missing', async () => {
  const response = await handler({ httpMethod: 'GET', queryStringParameters: {} });

  assert.strictEqual(response.statusCode, 400);
  assert.deepStrictEqual(JSON.parse(response.body), { error: 'topicIds parameter required' });
});

test('returns 500 when PostHog credentials are not configured', async () => {
  const response = await handler({
    httpMethod: 'GET',
    queryStringParameters: { topicIds: 'topic-1' }
  });

  assert.strictEqual(response.statusCode, 500);
  assert.deepStrictEqual(JSON.parse(response.body), { error: 'Server configuration error' });
});

test('aggregates vote counts from PostHog responses', async () => {
  process.env.POSTHOG_PROJECT_ID = 'project-id';
  process.env.POSTHOG_API_KEY = 'api-key';
  process.env.POSTHOG_HOST = 'https://example.com';

  const calls = [];
  const responses = [
    { ok: true, status: 200, json: async () => ({ results: [{}, {}, {}] }) },
    { ok: true, status: 200, json: async () => ({ results: [{}] }) }
  ];

  globalThis.fetch = async (...args) => {
    calls.push(args);
    const next = responses.shift();
    if (!next) throw new Error('unexpected fetch call');
    return next;
  };

  const response = await handler({
    httpMethod: 'GET',
    queryStringParameters: { topicIds: 'topic-1,topic-2' }
  });

  assert.strictEqual(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.deepStrictEqual(body.voteCounts, { 'topic-1': 3, 'topic-2': 1 });
  assert.strictEqual(calls.length, 2);
  assert.ok(calls[0][0].startsWith('https://example.com'));
  assert.ok(calls[0][0].includes('topic-1'));
  const fetchOptions = calls[0][1] ?? {};
  assert.deepStrictEqual(fetchOptions.headers, {
    Authorization: 'Bearer api-key',
    'Content-Type': 'application/json'
  });
});

test('falls back to zero when PostHog returns errors', async () => {
  process.env.POSTHOG_PROJECT_ID = 'project-id';
  process.env.POSTHOG_API_KEY = 'api-key';

  let callCount = 0;
  globalThis.fetch = async () => {
    callCount += 1;
    if (callCount === 1) {
      return { ok: false, status: 500, json: async () => ({}) };
    }
    throw new Error('boom');
  };

  const response = await handler({
    httpMethod: 'GET',
    queryStringParameters: { topicIds: 'topic-1,topic-2' }
  });

  assert.strictEqual(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.deepStrictEqual(body.voteCounts, { 'topic-1': 0, 'topic-2': 0 });
});

test('includes JSON, cache, and CORS headers on success', async () => {
  process.env.POSTHOG_PROJECT_ID = 'project-id';
  process.env.POSTHOG_API_KEY = 'api-key';

  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ results: [] }) });

  const response = await handler({
    httpMethod: 'GET',
    queryStringParameters: { topicIds: 'topic-1' }
  });

  assert.strictEqual(response.statusCode, 200);
  assert.deepStrictEqual(response.headers, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  });
});

