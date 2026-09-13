import { describe, expect, it } from 'vitest'

import { billingReturnUrl } from './billing-url'
import { usageInput } from './usage-input'

const id = '6ba7b810-9dad-41d1-80b4-00c04fd430c8'

describe('billing and usage input boundaries', () => {
  it('accepts same-origin billing returns and rejects redirects elsewhere', () => {
    expect(billingReturnUrl('https://solun.app/account', 'https://solun.app', '/account')).toBe('https://solun.app/account')
    expect(() => billingReturnUrl('https://example.com/account', 'https://solun.app', '/account')).toThrow('Invalid return URL')
  })

  it('validates reservations before they reach privileged database functions', () => {
    expect(usageInput({ user_id: id, request_id: id, estimated_tokens: 500, estimated_cost_usd: 0.01 })).toMatchObject({
      userId: id,
      requestId: id,
      tokens: 500,
      cost: 0.01,
    })
    expect(() => usageInput({ user_id: id, request_id: id, estimated_tokens: -1, estimated_cost_usd: 0.01 })).toThrow('Invalid token count')
  })
})
