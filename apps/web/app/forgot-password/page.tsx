export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,248,236,0.95)_0%,_rgba(248,251,255,1)_40%,_rgba(255,247,237,1)_100%)] px-6 py-16 text-slate-900 dark:bg-[radial-gradient(circle_at_0%_0%,_#121212_0%,_#1e1e1e_56%,_#212121_100%)] dark:text-white">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-300/30 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 dark:text-cyan-300">EduMart</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This flow is ready on the API. Hook it to your email provider next.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-700 dark:border-white/15 dark:bg-slate-900/70 dark:text-slate-300">
          POST /api/v1/auth/forgot-password
        </div>
      </div>
    </main>
  );
}
