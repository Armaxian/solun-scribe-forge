export function billingReturnUrl(value: unknown, siteUrl: string, fallback: string): string {
  const site = new URL(siteUrl);
  if (site.protocol !== 'https:' && !(site.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(site.hostname))) throw new TypeError('Invalid site URL');
  if (value === undefined || value === null) return `${site.origin}${fallback}`;
  if (typeof value !== 'string') throw new TypeError('Invalid return URL');
  const url = new URL(value);
  if (url.origin !== site.origin || url.username || url.password) throw new TypeError('Invalid return URL');
  return value;
}
