import { NextResponse } from 'next/server';
import { getPublicContent } from '../../lib/sanity/public-content';
export const revalidate = 60;
export async function GET() {
  const { editorial } = await getPublicContent();
  return NextResponse.json(editorial.webManifest, { headers: { 'Content-Type': 'application/manifest+json' } });
}
