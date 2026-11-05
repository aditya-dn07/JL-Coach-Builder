import { contentRepository } from '@/content/repository';
const settings = contentRepository.getSiteSettings();
export const mainNavigation = settings.navigation.main;
export const footerNavigation = [{ label: settings.ui.headerHome, href: '/' }, ...mainNavigation, ...settings.navigation.footerExtra];
