'use client';
import Image from 'next/image';
import { Card, Stack, Text } from '@sanity/ui';
import { useFormValue, type ObjectInputProps, type ImageValue } from 'sanity';
import { getSingletonDefaults } from '../seed-values';
export function LocalImageInput(props: ObjectInputProps<ImageValue>) {
  const documentId = useFormValue(['_id']);
  let fallback: unknown = getSingletonDefaults(String(documentId ?? ''));
  for (const segment of props.path) {
    if (Array.isArray(fallback) && typeof segment === 'object' && '_key' in segment) {
      fallback = fallback.find(item => item?._key === segment._key);
    } else if (fallback && typeof fallback === 'object' && typeof segment !== 'object') {
      fallback = (fallback as Record<string | number, unknown>)[segment];
    } else { fallback = undefined; break; }
  }
  const value = props.value as (ImageValue & { src?: string }) | undefined;
  const local = (value?.src ? value : fallback) as { src?: string; optimizedSrc?: string; alt?: string } | undefined;
  const src = local?.optimizedSrc || local?.src;
  return <Stack space={3}>
    {!props.value?.asset && src?.startsWith('/') && !src.startsWith('//') && <Card padding={3} border radius={2}>
      <Stack space={3}>
        <Image src={src} alt={local?.alt ?? ''} width={900} height={500} unoptimized style={{ width: '100%', height: 'auto', maxHeight: 280, objectFit: 'contain' }} />
        <Text size={1} muted>Current website image (local fallback). Upload an image below to replace it in Sanity.</Text>
      </Stack>
    </Card>}
    {props.renderDefault(props)}
  </Stack>;
}
