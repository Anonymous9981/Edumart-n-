import crypto from 'crypto';

import { NextRequest, NextResponse } from 'next/server';

const OAUTH_STATE_COOKIE = 'edumart_google_oauth_state';
const OAUTH_RETURN_TO_COOKIE = 'edumart_google_oauth_return_to';

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard/customer';
  }

  return value;
}

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=google-auth-unavailable', request.url));
  }

  const state = crypto.randomUUID();
  const returnTo = normalizeReturnTo(request.nextUrl.searchParams.get('returnTo'));
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? new URL('/api/v1/auth/google/callback', request.url).toString();
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('prompt', 'select_account');
  authorizationUrl.searchParams.set('access_type', 'offline');
  authorizationUrl.searchParams.set('include_granted_scopes', 'true');

  const response = NextResponse.redirect(authorizationUrl);
  const secure = process.env.NODE_ENV === 'production';

  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60,
  });
  response.cookies.set(OAUTH_RETURN_TO_COOKIE, returnTo, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60,
  });

  return response;
}
