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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(214,248,236,0.95)_0%,_rgba(248,251,255,1)_40%,_rgba(255,247,237,1)_100%)] px-6 text-slate-900 dark:bg-[radial-gradient(circle_at_0%_0%,_#121212_0%,_#1e1e1e_56%,_#212121_100%)] dark:text-white">
      <div className="rounded-[2rem] border border-slate-200 bg-white/80 px-8 py-6 shadow-2xl shadow-slate-300/30 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/20">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-700 dark:text-cyan-300">EduMart</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{message}</h1>
      </div>
    </main>
  );
}