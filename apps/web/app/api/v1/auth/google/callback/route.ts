import { NextRequest, NextResponse } from 'next/server';

import { UserRole } from '@edumart/shared';

import { buildAuthError, signInOAuthUser } from '../../../../../../lib/auth-service';
import { getDashboardPath, setAuthCookies } from '../../../../../../lib/auth';

const OAUTH_STATE_COOKIE = 'edumart_google_oauth_state';
const OAUTH_RETURN_TO_COOKIE = 'edumart_google_oauth_return_to';

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return getDashboardPath(UserRole.CUSTOMER);
  }

  return value;
}

function redirectWithError(request: NextRequest, message: string) {
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, request.url));
}

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const stateCookie = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
    const returnToCookie = normalizeReturnTo(request.cookies.get(OAUTH_RETURN_TO_COOKIE)?.value ?? null);

    if (!code || !state || !stateCookie || state !== stateCookie) {
      return redirectWithError(request, 'google-auth-invalid-state');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? new URL('/api/v1/auth/google/callback', request.url).toString();

    if (!clientId || !clientSecret) {
      return redirectWithError(request, 'google-auth-unavailable');
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Unable to exchange Google sign-in code');
    }

    const tokenPayload = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenPayload.access_token) {
      throw new Error('Google did not return an access token');
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Unable to load Google profile');
    }

    const profile = (await profileResponse.json()) as {
      email?: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
    };

    if (!profile.email) {
      throw new Error('Google account email is missing');
    }

    const result = await signInOAuthUser(
      {
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        avatar: profile.picture,
        role: UserRole.CUSTOMER,
      },
      {
        ipAddress:
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          request.headers.get('x-real-ip') ??
          null,
        userAgent: request.headers.get('user-agent'),
      },
    );

    const response = NextResponse.redirect(new URL(returnToCookie, request.url));
    setAuthCookies(response, result.tokenPair);
    response.cookies.set(OAUTH_STATE_COOKIE, '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });
    response.cookies.set(OAUTH_RETURN_TO_COOKIE, '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    const authError = buildAuthError(error);
    return redirectWithError(request, authError.message);
  }
}
