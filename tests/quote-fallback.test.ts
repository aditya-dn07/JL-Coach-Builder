import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../src/app/api/quote/route';
import { quoteConversionTracker } from '../src/lib/quote-conversion';
import { readFileSync } from 'node:fs';

const details = { name: 'Fallback Test', phone: '0271234567', email: 'fallback@example.test', message: 'Please assess our caravan window.', website: '' };

test('URL-encoded and multipart POST fallbacks redirect safely; invalid and bot requests never deliver', async () => {
  const priorUrl = process.env.QUOTE_WEBHOOK_URL;
  const priorFetch = globalThis.fetch;
  let delivered = 0;
  process.env.QUOTE_WEBHOOK_URL = 'https://delivery.example.test/quotes';
  globalThis.fetch = async () => { delivered++; return new Response('', { status: 202 }); };
  const formRequest = (patch: Record<string, string> = {}, multipart = false) => {
    const values = { ...details, idempotencyToken: crypto.randomUUID(), ...patch };
    const form = multipart ? new FormData() : new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => form.append(key, value));
    return new Request('http://localhost:3011/api/quote', { method: 'POST', headers: { Origin: 'http://localhost:3011' }, body: form });
  };
  const assertRedirect = async (request: Request, state: string) => {
    const response = await POST(request);
    assert.equal(response.status, 303);
    const location = new URL(response.headers.get('location')!);
    assert.equal(location.pathname, '/quote-result/');
    assert.deepEqual([...location.searchParams], [['state', state]]);
    assert.ok(!location.href.includes(details.email));
  };
  try {
    await assertRedirect(formRequest(), 'success');
    await assertRedirect(formRequest({}, true), 'success');
    assert.equal(delivered, 2);
    const invalid: Record<string, string>[] = [{ website: 'bot.example' }, { email: 'invalid' }, { phone: '----' }, { name: '' }, { message: 'short' }];
    for (const patch of invalid) {
      await assertRedirect(formRequest(patch), 'error');
    }
    await assertRedirect(formRequest({ website: 'bot.example' }, true), 'error');
    assert.equal(delivered, 2);
    globalThis.fetch = async () => new Response('', { status: 500 });
    await assertRedirect(formRequest(), 'error');
    delete process.env.QUOTE_WEBHOOK_URL;
    await assertRedirect(formRequest(), 'error');
    await assertRedirect(new Request('http://localhost:3011/api/quote', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'https://attacker.example' }, body: new URLSearchParams(details),
    }), 'error');
  } finally {
    globalThis.fetch = priorFetch;
    if (priorUrl === undefined) delete process.env.QUOTE_WEBHOOK_URL; else process.env.QUOTE_WEBHOOK_URL = priorUrl;
  }
});

test('concurrent and repeated JSON submissions deliver once with a provider idempotency key', async () => {
  const priorUrl = process.env.QUOTE_WEBHOOK_URL;
  const priorFetch = globalThis.fetch;
  process.env.QUOTE_WEBHOOK_URL = 'https://delivery.example.test/quotes';
  let delivered = 0;
  let finish!: () => void;
  const hold = new Promise<void>(resolve => { finish = resolve; });
  globalThis.fetch = async (_input, init) => {
    delivered++;
    assert.match(new Headers(init?.headers).get('Idempotency-Key')!, /^[a-f0-9]{64}$/);
    await hold;
    return new Response('', { status: 202 });
  };
  const payload = { ...details, idempotencyToken: crypto.randomUUID() };
  const request = () => new Request('http://localhost/api/quote', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  try {
    const first = POST(request());
    const second = POST(request());
    finish();
    const responses = await Promise.all([first, second]);
    assert.equal(delivered, 1);
    assert.deepEqual(responses.map(response => response.status), [200, 200]);
    assert.equal((await (await POST(request())).json()).duplicate, true);
    assert.equal(delivered, 1);
  } finally {
    globalThis.fetch = priorFetch;
    if (priorUrl === undefined) delete process.env.QUOTE_WEBHOOK_URL; else process.env.QUOTE_WEBHOOK_URL = priorUrl;
  }
});

test('conversion event is emitted once with no personal fields', () => {
  const events: unknown[] = [];
  const track = quoteConversionTracker(event => events.push(event));
  track('confirmed-response-token');
  track('confirmed-response-token');
  assert.deepEqual(events, [{ event: 'generate_lead', form: 'quote' }]);
});

test('form fallback and off-screen honeypot remain keyboard and screen-reader safe', () => {
  const form = readFileSync('src/components/contact/quote-form.tsx', 'utf8');
  assert.match(form, /method="post" action="\/api\/quote"/);
  assert.match(form, /<div className="honeypot" aria-hidden="true">\s*<input name="website" tabIndex=\{-1\} autoComplete="off"/);
  assert.ok(!form.includes('Leave this field empty'));
  const css = readFileSync('src/components/shared/sections.css', 'utf8');
  assert.match(css, /\.honeypot\s*\{[^}]*position: absolute;[^}]*left: -9999px;/);
});
