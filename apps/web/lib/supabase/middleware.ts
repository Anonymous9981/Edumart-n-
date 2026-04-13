import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { getSupabasePublishableKey, getSupabaseUrl } from './env'

type CookieToSet = {
  name: string
  value: string
  options: any
}

export function createRequestClient(request: NextRequest, onSetCookies?: (cookies: CookieToSet[]) => void) {
  const cookiesToSet: CookieToSet[] = []

  const supabase = createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(nextCookies) {
        cookiesToSet.splice(0, cookiesToSet.length, ...nextCookies)
        onSetCookies?.(nextCookies)
        nextCookies.forEach(({ name, value }) => request.cookies.set(name, value))
      },
    },
  })

  function applyCookies(response: NextResponse) {
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    return response
  }

  return {
    supabase,
    applyCookies,
  }
}

export const createRouteClient = createRequestClient

export function applySupabaseCookies(response: NextResponse, cookiesToSet: CookieToSet[]) {
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create one new on each request.
  const { supabase, applyCookies } = createRequestClient(request)

  // Fetching the user refreshes auth cookies when needed.
  await supabase.auth.getUser()

  supabaseResponse = applyCookies(supabaseResponse)

  return supabaseResponse
}
