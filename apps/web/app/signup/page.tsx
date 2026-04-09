'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { UserRole } from '@edumart/shared';
import { signupSchema } from '@edumart/validation';

interface AuthSuccessPayload {
  success: boolean;
  error?: {
    message?: string;
  };
}

type SignupField = 'firstName' | 'lastName' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'storeName';

function flattenFieldErrors(error: { flatten: () => { fieldErrors: Partial<Record<SignupField, string[] | undefined>> } }) {
  const flattened = error.flatten().fieldErrors;

  return {
    firstName: flattened.firstName?.[0],
    lastName: flattened.lastName?.[0],
    email: flattened.email?.[0],
    phone: flattened.phone?.[0],
    password: flattened.password?.[0],
    confirmPassword: flattened.confirmPassword?.[0],
    storeName: flattened.storeName?.[0],
  } satisfies Partial<Record<SignupField, string>>;
}

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<SignupField, string>>>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requiresStore = useMemo(() => role === UserRole.VENDOR, [role]);

  function signInWithGoogle() {
    router.push(`/api/v1/auth/google?returnTo=${encodeURIComponent('/dashboard/customer')}`);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    setFieldErrors({});

    const parsed = signupSchema.safeParse({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      confirmPassword,
      storeName: storeName.trim(),
      role,
    });

    if (!parsed.success) {
      const nextFieldErrors = flattenFieldErrors(parsed.error);
      setFieldErrors(nextFieldErrors);
      setError(Object.values(nextFieldErrors).find(Boolean) || 'Please fix the highlighted fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json()) as AuthSuccessPayload;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message || 'Unable to create account');
      }

      router.push(role === UserRole.VENDOR ? '/dashboard/vendor' : '/dashboard/customer');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="brand-page">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="flex items-center">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            className="brand-panel w-full p-8 text-slate-900"
          >
            <h1 className="brand-title text-3xl">Create your EduMart account</h1>
            <p className="mt-2 text-sm text-slate-500">Customer and vendor signups share the same secure flow.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">First name</span>
                <input name="firstName" className="brand-input" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                {fieldErrors.firstName ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.firstName}</span> : null}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Last name</span>
                <input name="lastName" className="brand-input" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                {fieldErrors.lastName ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.lastName}</span> : null}
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input name="email" type="email" className="brand-input" value={email} onChange={(event) => setEmail(event.target.value)} />
                {fieldErrors.email ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.email}</span> : null}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Phone</span>
                <input name="phone" className="brand-input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" />
                {fieldErrors.phone ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.phone}</span> : null}
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="brand-input pr-16"
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
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Confirm password</span>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="brand-input pr-16"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.18em] text-[#0b3558]"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {fieldErrors.confirmPassword ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.confirmPassword}</span> : null}
              </label>
            </div>

            <div className="mt-4">
              <span className="mb-2 block text-sm font-medium text-slate-700">Account type</span>
              <div className="grid grid-cols-2 gap-3">
                {[UserRole.CUSTOMER, UserRole.VENDOR].map((option) => (
                  <button key={option} type="button" onClick={() => setRole(option)} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${role === option ? 'border-[#00a67e] bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {requiresStore ? (
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Store name</span>
                <input name="storeName" className="brand-input" value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="Your school store name" />
                {fieldErrors.storeName ? <span className="mt-2 block text-xs font-semibold text-red-600">{fieldErrors.storeName}</span> : null}
              </label>
            ) : null}

            <button
              type="button"
              onClick={signInWithGoogle}
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0b3558] text-[10px] font-black text-white">G</span>
              Continue with Google
            </button>
            <p className="mt-2 text-center text-xs text-slate-500">
              Google creates a verified customer profile first. Vendor stores can be added after sign-in.
            </p>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <button type="submit" disabled={loading} className="brand-btn-primary mt-6 inline-flex w-full items-center justify-center px-4 py-3 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account? <Link href="/login" className="font-semibold text-[#0b3558]">Sign in</Link>
            </p>
          </form>
        </section>

        <section className="brand-shell flex flex-col justify-center p-8">
          <p className="brand-kicker">Phase 2</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Secure onboarding for every role</h2>
          <p className="brand-copy mt-4 max-w-xl text-base">
            Customers, vendors, and admins all follow a protected authentication flow with refresh token rotation and server-side authorization.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {['Bcrypt password hashing', 'HttpOnly auth cookies', 'Role-aware dashboards', 'Password reset flow'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/25 bg-white/10 p-4 text-sm text-white/90">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
