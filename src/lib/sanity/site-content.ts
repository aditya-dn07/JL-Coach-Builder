import 'server-only';
import { getPublicContent } from './public-content';
import { createContentView } from '../../content/view';
export const getSiteContent = async () => createContentView(await getPublicContent());
