import { Fragment } from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
export type InlineValue = { _type: string; _key?: string; [key: string]: unknown }[];
const components: Partial<PortableTextComponents> = {
  block: { normal: ({ children }) => <Fragment>{children}</Fragment> },
  marks: {
    link: ({ value, children }) => <a className="interior-inline-link" href={typeof value?.href === 'string' && /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(value.href) ? value.href : '#'}>{children}</a>,
    internalLink: ({ value, children }) => typeof value?.href === 'string' && /^\/(?!\/)/.test(value.href) ? <a className="interior-inline-link" href={value.href}>{children}</a> : <>{children}</>,
  },
  unknownType: () => null,
};
export function InlineContent({ value }: { value: InlineValue }) { return <PortableText value={value} components={components} />; }
