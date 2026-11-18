// Deployment configuration only. Never infer search visibility from request Host.
export function productionIndexingEnabled(): boolean {
  return process.env.VERCEL_ENV === 'production' && process.env.SITE_ENVIRONMENT === 'production';
}
