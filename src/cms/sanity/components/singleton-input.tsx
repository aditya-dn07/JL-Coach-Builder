'use client';
import { Card, Stack, Text, Button, Heading } from '@sanity/ui';
import { setIfMissing, type ObjectInputProps } from 'sanity';
import { getSingletonDefaults, getSingletonTitle } from '../seed-values';
import { SeoOverrideNotice } from './seo-override-notice';
// No patches occur until an editor explicitly clicks the button.
export function SingletonInput(props: ObjectInputProps) {
  const defaults = getSingletonDefaults(String(props.value?._id ?? ''));
  const missing = Object.keys(defaults).filter(key => !key.startsWith('_') && props.value?.[key] === undefined);
  return <Stack space={4}>
    <Heading as="h1" size={3}>{getSingletonTitle(String(props.value?._id ?? '')) || props.schemaType.title || props.schemaType.name}</Heading>
    <SeoOverrideNotice documentId={String(props.value?._id ?? '')} />
    {missing.length > 0 && <Card padding={4} radius={2} border tone="primary">
      <Stack space={3}>
        <Text size={1}>This document has fields without saved content. You can fill them from the current website defaults without replacing existing values.</Text>
        <Button text="Fill missing fields from website defaults" disabled={props.readOnly}
          onClick={() => props.onChange(missing.map(key => setIfMissing(defaults[key], [key])))} />
      </Stack>
    </Card>}
    {props.renderDefault(props)}
  </Stack>;
}
