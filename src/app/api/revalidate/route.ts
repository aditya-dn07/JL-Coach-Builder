import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import defaults from '../../../cms/sanity/defaults.json';
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!secret || !signature) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (Number(request.headers.get('content-length') || 0) > 16000) return NextResponse.json({ error: 'Invalid request' }, { status: 413 });
  let raw = '';
  const reader = request.body?.getReader(); if (!reader) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) { const { value, done } = await reader.read(); if (done) break; length += value.byteLength; if (length > 16000) { await reader.cancel(); return NextResponse.json({ error: 'Invalid request' }, { status: 413 }); } chunks.push(value); }
  raw = Buffer.concat(chunks).toString('utf8');
  try {
    if (!await isValidSignature(raw, signature, secret)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = JSON.parse(raw) as { _type?: string; _id?: string; slug?: { current?: string }; beforeSlug?: string };
    const allowed = new Set(Object.values(defaults.seeds).map(doc => doc._type));
    if (!body._type || !allowed.has(body._type) && !['blogPost', 'blogCategory', 'blogAuthor', 'blogTag'].includes(body._type)) return NextResponse.json({ error: 'Invalid document' }, { status: 400 });
    revalidateTag('sanity:content'); revalidateTag('sanity:blog');
    revalidatePath('/', 'layout'); revalidatePath('/sitemap.xml'); revalidatePath('/robots.txt');
    revalidatePath('/blog');
    for (const slug of [body.slug?.current, body.beforeSlug]) if (slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) revalidatePath('/blog/' + slug);
    return NextResponse.json({ revalidated: true });
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
}
