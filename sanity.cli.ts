import { defineCliConfig } from 'sanity/cli';
import { getSanityIdentifiers } from './src/lib/sanity/config';
export default defineCliConfig({ api: getSanityIdentifiers() });
