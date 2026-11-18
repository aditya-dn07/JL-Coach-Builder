import { defineType, defineField } from 'sanity';
import { altValidation } from '../infer';
import { LocalImageInput } from '../components/local-image-input';
export const accessibleImage = defineType({
  name: 'accessibleImage', title: 'Image', type: 'image', options: { hotspot: true }, components: { input: LocalImageInput },
  fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the image for people who cannot see it. Leave empty only for decorative images.', validation: altValidation }),
    defineField({ name: 'decorative', type: 'boolean', initialValue: false }),
    ...['src', 'optimizedSrc', 'originalSrc', 'id', 'treatment'].map(name => defineField({ name, type: 'string', hidden: true, readOnly: true })),
    ...['width', 'height'].map(name => defineField({ name, type: 'number', hidden: true, readOnly: true })),
    defineField({ name: 'focalPoint', type: 'object', hidden: true, readOnly: true, fields: [{ name: 'x', type: 'number' }, { name: 'y', type: 'number' }] }),
    defineField({ name: 'caption', type: 'text' }), defineField({ name: 'credit', type: 'string' }),
  ],
});
export const objectTypes = [accessibleImage];
