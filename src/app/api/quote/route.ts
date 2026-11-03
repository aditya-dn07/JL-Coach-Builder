import { NextResponse } from 'next/server';
import { QuoteSchema } from '@/lib/quote';
import content from '@/content/quote-form.json';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  // Next's internal request URL can use localhost behind a proxy or 127.0.0.1 binding.
  // Compare the browser origin with the actual Host header, preserving cross-origin rejection.
  const host = request.headers.get('host') ?? new URL(request.url).host;
  let allowedOrigin = !origin;
  try {
    if (origin) allowedOrigin = new URL(origin).host === host;
  } catch {
    allowedOrigin = false;
  }
  if (!allowedOrigin)
    return NextResponse.json({ error: content.form.messages.error }, { status: 403 });
  if (Number(request.headers.get('content-length') ?? 0) > 16000)
    return NextResponse.json({ error: content.form.messages.invalid }, { status: 413 });
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json({ error: content.form.messages.invalid }, { status: 413 });
    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: content.form.messages.invalid }, { status: 400 });
    }
    const result = QuoteSchema.safeParse(payload);
    if (!result.success)
      return NextResponse.json({ error: content.form.messages.invalid }, { status: 400 });
    // No pretend delivery: this route returns 503 until a trusted webhook is configured.
    const endpoint = process.env.QUOTE_WEBHOOK_URL;
    if (!endpoint)
      return NextResponse.json({ error: content.form.messages.unconfigured }, { status: 503 });
    const target = new URL(endpoint);
    if (target.protocol !== 'https:') throw new Error('Delivery endpoint must use HTTPS');
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.QUOTE_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.QUOTE_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify(result.data),
      signal: AbortSignal.timeout(10000),
      redirect: 'error',
    });
    if (!response.ok) throw new Error('Delivery failed');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: content.form.messages.error }, { status: 502 });
  }
}
