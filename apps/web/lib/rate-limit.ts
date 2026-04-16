const memoryStore = new Map<string, { count: number; expiresAt: number }>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  retryAfterMs: number
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = headers.get('x-real-ip')?.trim()
  return forwarded || realIp || 'unknown'
}

export function applyRateLimit(input: {
  key: string
  maxRequests: number
  windowMs: number
}): RateLimitResult {
  const now = Date.now()
  const existing = memoryStore.get(input.key)

  if (!existing || existing.expiresAt <= now) {
    memoryStore.set(input.key, {
      count: 1,
      expiresAt: now + input.windowMs,
    })

    return {
      ok: true,
      remaining: input.maxRequests - 1,
      retryAfterMs: input.windowMs,
    }
  }

  const nextCount = existing.count + 1
  existing.count = nextCount
  memoryStore.set(input.key, existing)

  if (nextCount > input.maxRequests) {
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: Math.max(existing.expiresAt - now, 0),
    }
  }

  return {
    ok: true,
    remaining: input.maxRequests - nextCount,
    retryAfterMs: Math.max(existing.expiresAt - now, 0),
  }
}
