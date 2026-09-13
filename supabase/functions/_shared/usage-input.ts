const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function usageInput(value: unknown, settlement = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Invalid request');
  const body = value as Record<string, unknown>;
  const id = body.reservation_id ?? body.request_id;
  const tokens = settlement ? body.tokens_total : body.estimated_tokens;
  const cost = settlement ? body.cost_usd : body.estimated_cost_usd;
  if (typeof body.user_id !== 'string' || !uuid.test(body.user_id) || typeof id !== 'string' || !uuid.test(id)) throw new TypeError('Valid user and request IDs required');
  if (typeof tokens !== 'number' || !Number.isSafeInteger(tokens) || tokens < (settlement ? 0 : 1) || tokens > 2_000_000) throw new TypeError('Invalid token count');
  if (typeof cost !== 'number' || !Number.isFinite(cost) || cost < 0 || (!settlement && cost === 0) || cost > 1000) throw new TypeError('Invalid cost');
  const status = body.status ?? 'settled';
  if (settlement && !['settled', 'failed', 'cancelled'].includes(status as string)) throw new TypeError('Invalid status');
  if (settlement && status !== 'settled' && (tokens !== 0 || cost !== 0)) throw new TypeError('Consumed usage must be settled');
  if (body.model !== undefined && (typeof body.model !== 'string' || body.model.length > 100)) throw new TypeError('Invalid model');
  return { userId: body.user_id, requestId: id, tokens, cost, status, model: body.model ?? 'unknown' };
}
