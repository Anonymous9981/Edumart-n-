'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getDashboardPath } from '../../lib/auth';
import { resolvePostLoginPath } from '../../lib/rbac';
import { UserRole } from '@edumart/shared';
import { loginSchema } from '@edumart/validation';

interface AuthSuccessPayload {
  success: boolean;
  data?: {
    user: {
      role: UserRole;
    };
  };
  error?: {
    message?: string;
  };
}

function normalizeReturnPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/login') || value.startsWith('/signup')) {
    return '/dashboard/profile';
  }

  return value;
}

function normalizeAuthError(message: string | null) {
  if (!message) {
    return '';
  }

  if (message === 'google-auth-unavailable') {
    return 'Google sign-in is not configured for this environment yet.';
  }

  if (message === 'google-auth-invalid-state') {
    return 'Your Google sign-in session expired. Please try again.';
  }

  return message.replace(/-/g, ' ');
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/dashboard/profile');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setError(normalizeAuthError(params.get('error')));
    setRedirectPath(normalizeReturnPath(params.get('from')));
  }, []);

  function goToGoogle() {
    router.push(`/api/v1/auth/google?returnTo=${encodeURIComponent(redirectPath)}`);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    setFieldErrors({});

    const parsed = loginSchema.safeParse({
      email: email.trim(),
      password,
      rememberMe,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      const nextFieldErrors = {
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      };

      setFieldErrors(nextFieldErrors);
      setError(flattened.email?.[0] || flattened.password?.[0] || 'Please fix the highlighted fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json()) as AuthSuccessPayload;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'Unable to sign in');
      }

      const role = payload.data?.user.role;
      if (!role) {
        throw new Error('Unable to sign in');
      }

      const nextPath = resolvePostLoginPath(redirectPath, role)
      router.push(nextPath === '/dashboard/profile' ? '/dashboard/profile' : nextPath || getDashboardPath(role));
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="brand-page">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="brand-shell flex flex-col justify-center p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#0b3558] shadow-lg">
              E
            </div>
            <div>
              <p className="brand-kicker">EduMart</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Student and school marketplace</p>
            </div>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Welcome back</h1>
          <p className="brand-copy mt-4 max-w-xl text-base">
            Sign in to continue shopping, managing products, or overseeing the platform.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {['Secure login', 'Role-based access', 'Refresh token rotation'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/25 bg-white/10 p-4 text-sm text-white/90">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            className="brand-panel w-full p-8 text-slate-900"
          >
            <h2 className="brand-title text-2xl">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use the seeded development credentials or your own account.</p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  name="email"
                  type="email"
                  className="brand-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {fieldErrors.email ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.email}</span> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="brand-input pr-16"
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.18em] text-[#0b3558]"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {fieldErrors.password ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.password}</span> : null}
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#00a67e] focus:ring-[#00a67e]"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Keep me signed in
              </label>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={goToGoogle}
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0b3558] text-[10px] font-black text-white">G</span>
              Continue with Google
            </button>

            <button
              type="submit"
              disabled={loading}
              className="brand-btn-primary mt-6 inline-flex w-full items-center justify-center px-4 py-3 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <Link href="/forgot-password" className="hover:text-[#0b3558]">Forgot password?</Link>
              <Link href="/signup" className="hover:text-[#0b3558]">Create account</Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
