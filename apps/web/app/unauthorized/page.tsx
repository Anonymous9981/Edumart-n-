import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">403</p>
        <h1 className="mt-4 text-3xl font-semibold">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Your account does not have permission to view this area.
        </p>
        <Link className="mt-6 inline-flex rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white" href="/login">
          Go to login
        </Link>
      </div>
    </main>
  );
}
