import { describe, expect, it } from 'vitest';

import { safeAuthRedirect, authCallbackUrl } from '../auth-redirect';

describe('authentication destinations', () => {
  it('preserves the page and billing selection through email callbacks', () => {
    const destination = '/pricing?billing=yearly#plans';
    expect(safeAuthRedirect(destination)).toBe(destination);
    expect(new URL(authCallbackUrl(destination)).searchParams.get('redirect')).toBe(destination);
  });
  it.each([null, '', 'https://evil.test', '//evil.test', '/\\evil.test', '/login', '/login?redirect=/login', '/\n/evil.test'])('rejects an unsafe destination: %s', value => {
    expect(safeAuthRedirect(value)).toBe('/account');
  });
});
