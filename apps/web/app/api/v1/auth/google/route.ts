import { NextRequest, NextResponse } from 'next/server';

import { createRouteClient } from '../../../../../lib/supabase/middleware';

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard/customer';
  }

  return value;
}

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const returnTo = normalizeReturnTo(request.nextUrl.searchParams.get('returnTo'));
  const { supabase, applyCookies } = createRouteClient(request);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: new URL(`/api/v1/auth/google/callback?returnTo=${encodeURIComponent(returnTo)}`, request.url).toString(),
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL('/login?error=google-auth-unavailable', request.url));
  }

  const response = NextResponse.redirect(data.url);
  return applyCookies(response);
}
