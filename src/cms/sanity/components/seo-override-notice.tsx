'use client';
import { Card, Stack, Text } from '@sanity/ui';
import defaults from '../defaults.json';
import { fromSanityDocumentId } from '../document-ids.mjs';
import { getSeoTarget } from '../../../lib/seo-targets';

export function SeoOverrideNotice({ documentId }: { documentId: string }) {
  const id = fromSanityDocumentId(documentId);
  const page = defaults.registry.find(page => page.items.some(item => item.id === id && ['pageSeo', 'pageSettings', 'blogSettings'].includes(item.type)));
  if (!page) return null;
  const route = page.id === 'page.home' ? '/' : page.id === 'page.blog' ? '/blogs/' : '/' + page.id.slice(5) + '/';
  const target = getSeoTarget(route);
  if (!target) return null;
  const values = [
    ['Meta title', target.title], ['Meta description', target.description], ['Canonical URL', target.canonical],
    ['Open Graph title', target.og_title], ['Open Graph description', target.og_description], ['Open Graph URL', target.og_url],
    ['Twitter title', target.twitter_title], ['Twitter description', target.twitter_description],
  ];
  return <Card padding={4} radius={2} border tone="caution">
    <Stack space={3}>
      <Text weight="semibold" size={1}>Approved SEO code overrides active for {target.target_path}</Text>
      <Text size={1}>The current public title, description, canonical and Open Graph/Twitter text and URL are controlled by approved values in src/content/seo-targets.json. Editing the underlying CMS SEO fields will not replace those values while the code override remains active. Existing SEO fields remain accessible; image and noindex controls still apply.</Text>
      <details><summary>View effective SEO values (read-only)</summary>
        <dl>{values.map(([label, value]) => <div key={label} style={{ marginTop: 16 }}>
          <dt><Text size={1} weight="semibold">{label}</Text></dt>
          <dd style={{ margin: '8px 0 0', overflowWrap: 'anywhere' }}><Text size={1}>{value}</Text></dd>
        </div>)}</dl>
      </details>
    </Stack>
  </Card>;
}
