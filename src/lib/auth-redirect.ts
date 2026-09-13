// Only local destinations can be carried through email and OAuth redirects.
export function safeAuthRedirect(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\s]/.test(value)) return '/account';
  try {
    const url = new URL(value, 'https://solun.app');
    if (url.origin !== 'https://solun.app' || url.pathname === '/login') return '/account';
    return url.pathname + url.search + url.hash;
  } catch {
    return '/account';
  }
}

export function authCallbackUrl(redirect = '/account'): string {
  return `${window.location.origin}/login?redirect=${encodeURIComponent(safeAuthRedirect(redirect))}`;
}
