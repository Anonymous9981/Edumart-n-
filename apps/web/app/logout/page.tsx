'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Signing you out...');

  useEffect(() => {
    const runLogout = async () => {
      try {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        router.replace('/login');
      } catch {
        setMessage('Unable to sign out. Please try again.');
      }
    };

    void runLogout();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">EduMart</p>
        <h1 className="mt-3 text-2xl font-semibold">{message}</h1>
      </div>
    </main>
  );
}