import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { QuoteSchema } from '@/lib/quote';
import content from '@/content/quote-form.json';

// Bounded per-instance guard. Forward the same key so a delivery provider can also
// deduplicate across serverless instances; configure durable storage for that guarantee.
const deliveries = new Map<string, { expires: number; result: Promise<boolean> }>();
const ttl = 10 * 60 * 1000;

export async function POST(request: Request) {
  const type = request.headers.get('content-type') ?? '';
  const fallback = /^(application\/x-www-form-urlencoded|multipart\/form-data)(?:;|$)/i.test(type);
  function reply(status: number, error?: string, duplicate = false) {
    if (fallback) {
      const destination = new URL('/quote-result/', request.url);
      destination.searchParams.set('state', status === 200 ? 'success' : 'error');
      return NextResponse.redirect(destination, 303);
    }
    return NextResponse.json(status === 200 ? { success: true, duplicate } : { error }, { status });
  }
  const origin = request.headers.get('origin');
  const host = request.headers.get('host') ?? new URL(request.url).host;
  let allowedOrigin = !origin;
  try { if (origin) allowedOrigin = new URL(origin).host === host; } catch { allowedOrigin = false; }
  if (!allowedOrigin) return reply(403, content.form.messages.error);
  if (Number(request.headers.get('content-length') ?? 0) > 16000)
    return reply(413, content.form.messages.invalid);
  try {
    // Enforce the byte limit while reading, including chunked requests.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, content.form.messages.invalid);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) { await reader.cancel(); return reply(413, content.form.messages.invalid); }
      chunks.push(value);
    }
    const raw = Buffer.concat(chunks);
    let payload: unknown;
    try {
      payload = fallback
        ? Object.fromEntries(await new Response(raw, { headers: { 'Content-Type': type } }).formData())
        : JSON.parse(raw.toString('utf8'));
    } catch { return reply(400, content.form.messages.invalid); }
    const result = QuoteSchema.safeParse(payload);
    if (!result.success) return reply(400, content.form.messages.invalid);
    const token = (payload as Record<string, unknown>).idempotencyToken;
    if (token !== undefined && (typeof token !== 'string' || !/^[a-zA-Z0-9-]{0,80}$/.test(token)))
      return reply(400, content.form.messages.invalid);
    const key = createHash('sha256').update(String(token ?? '') + JSON.stringify(result.data)).digest('hex');
    const now = Date.now();
    for (const [storedKey, entry] of deliveries) if (entry.expires < now) deliveries.delete(storedKey);
    const existing = deliveries.get(key);
    if (existing) return await existing.result ? reply(200, undefined, true) : reply(502, content.form.messages.error);
    const endpoint = process.env.QUOTE_WEBHOOK_URL;
    if (!endpoint) return reply(503, content.form.messages.unconfigured);
    if (deliveries.size >= 1000) return reply(429, content.form.messages.error);
    const target = new URL(endpoint);
    if (target.protocol !== 'https:') throw new Error('Delivery endpoint must use HTTPS');
    const delivery = (async () => {
      try {
        const response = await fetch(target, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': key,
            ...(process.env.QUOTE_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.QUOTE_WEBHOOK_SECRET}` } : {}),
          },
          body: JSON.stringify(result.data),
          signal: AbortSignal.timeout(10000),
          redirect: 'error',
        });
        return response.ok;
      } catch { return false; }
    })();
    deliveries.set(key, { expires: now + ttl, result: delivery });
    const success = await delivery;
    if (!success) deliveries.delete(key);
    return success ? reply(200) : reply(502, content.form.messages.error);
  } catch { return reply(502, content.form.messages.error); }
}
