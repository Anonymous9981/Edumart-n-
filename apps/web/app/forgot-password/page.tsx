export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">EduMart</p>
        <h1 className="mt-4 text-3xl font-semibold">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This flow is ready on the API. Hook it to your email provider next.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-slate-900/70 p-5 text-sm text-slate-300">
          POST /api/v1/auth/forgot-password
        </div>
      </div>
    </main>
  );
}
