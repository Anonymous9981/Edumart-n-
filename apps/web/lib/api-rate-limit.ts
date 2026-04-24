import { NextRequest, NextResponse } from 'next/server'

import { applyRateLimit, getClientIp } from './rate-limit'

function readPositiveInt(raw: string | undefined, fallback: number) {
  const parsed = Number.parseInt(String(raw ?? ''), 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }
  return parsed
}

export function enforceApiRateLimit(
  request: NextRequest,
  input: {
    scope: string
    maxRequests?: number
    windowMs?: number
  },
) {
  const ip = getClientIp(request.headers)
  const maxRequests = input.maxRequests ?? readPositiveInt(process.env.RATE_LIMIT_API_MAX_REQUESTS, 100)
  const windowMs = input.windowMs ?? readPositiveInt(process.env.RATE_LIMIT_API_WINDOW_MS, 60_000)

  const result = applyRateLimit({
    key: `api:${input.scope}:${ip}`,
    maxRequests,
    windowMs,
  })

  if (result.ok) {
    return null
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again shortly.',
      },
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(result.retryAfterMs / 1000)),
      },
    },
  )
}
