/** First-10 free Just Ask ($0) promo for /amina — stored in Cloudflare KV. */

export const AMINA_PROMO_LIMIT = 10;
const CLAIMED_KEY = "claimed_count";
const CLIENT_PREFIX = "client:";

export type AminaPromoState = {
  limit: number;
  claimed: number;
  remaining: number;
  active: boolean;
};

export type AminaPromoEnv = {
  AMINA_PROMO?: KVNamespace;
};

function toState(claimed: number): AminaPromoState {
  const safe = Math.max(0, Math.min(AMINA_PROMO_LIMIT, claimed));
  const remaining = Math.max(0, AMINA_PROMO_LIMIT - safe);
  return {
    limit: AMINA_PROMO_LIMIT,
    claimed: safe,
    remaining,
    active: remaining > 0,
  };
}

export async function readAminaPromo(env: AminaPromoEnv): Promise<AminaPromoState> {
  const kv = env.AMINA_PROMO;
  if (!kv) return toState(AMINA_PROMO_LIMIT); // no KV → treat as sold out (show $79)
  const raw = await kv.get(CLAIMED_KEY);
  const claimed = raw ? Number.parseInt(raw, 10) : 0;
  return toState(Number.isFinite(claimed) ? claimed : 0);
}

/**
 * Atomically claim one promo seat for a browser clientId.
 * Same clientId does not burn a second seat.
 */
export async function claimAminaPromo(
  env: AminaPromoEnv,
  clientId: string,
): Promise<AminaPromoState & { newlyClaimed: boolean }> {
  const kv = env.AMINA_PROMO;
  if (!kv || !clientId || clientId.length > 80) {
    const state = await readAminaPromo(env);
    return { ...state, newlyClaimed: false };
  }

  const clientKey = `${CLIENT_PREFIX}${clientId}`;
  const already = await kv.get(clientKey);
  if (already) {
    return { ...(await readAminaPromo(env)), newlyClaimed: false };
  }

  const current = await readAminaPromo(env);
  if (!current.active) {
    return { ...current, newlyClaimed: false };
  }

  const next = current.claimed + 1;
  await kv.put(CLAIMED_KEY, String(next));
  await kv.put(clientKey, String(Date.now()), { expirationTtl: 60 * 60 * 24 * 180 });
  return { ...toState(next), newlyClaimed: true };
}
