import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../src/app/api/quote/route';

test('quote route handles validation, unavailable delivery, success and upstream failure', async () => {
  const priorUrl = process.env.QUOTE_WEBHOOK_URL;
  const priorFetch = globalThis.fetch;
  const body = {
    name: 'Local Test',
    phone: '0271234567',
    email: 'test@example.com',
    vehicle: 'Caravans',
    message: 'Please assess this window.',
    website: '',
  };
  const request = (payload: unknown = body, origin = 'http://localhost:3000') =>
    new Request('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify(payload),
    });
  try {
    delete process.env.QUOTE_WEBHOOK_URL;
    assert.equal((await POST(request())).status, 503);
    const boundHostRequest = new Request('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://127.0.0.1:3000',
        Host: '127.0.0.1:3000',
      },
      body: JSON.stringify(body),
    });
    assert.equal((await POST(boundHostRequest)).status, 503);
    assert.equal((await POST(request({ ...body, website: 'spam' }))).status, 400);
    assert.equal(
      (
        await POST(
          new Request('http://localhost:3000/api/quote', { method: 'POST', body: '{invalid' })
        )
      ).status,
      400
    );
    assert.equal(
      (
        await POST(
          new Request('http://localhost:3000/api/quote', {
            method: 'POST',
            body: 'x'.repeat(16001),
          })
        )
      ).status,
      413
    );
    assert.equal((await POST(request(body, 'https://untrusted.example'))).status, 403);
    process.env.QUOTE_WEBHOOK_URL = 'https://delivery.example/quotes';
    let sent: unknown;
    globalThis.fetch = async (_input, init) => {
      sent = JSON.parse(String(init?.body));
      return new Response('', { status: 202 });
    };
    assert.equal((await POST(request())).status, 200);
    assert.deepEqual(sent, body);
    globalThis.fetch = async () => new Response('', { status: 500 });
    assert.equal((await POST(request({ ...body, message: 'A different quote requiring delivery.' }))).status, 502);
  } finally {
    globalThis.fetch = priorFetch;
    if (priorUrl === undefined) delete process.env.QUOTE_WEBHOOK_URL;
    else process.env.QUOTE_WEBHOOK_URL = priorUrl;
  }
});
