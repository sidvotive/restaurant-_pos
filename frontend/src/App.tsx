export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <main className="max-w-lg w-full rounded-2xl border border-amber-500/20 bg-slate-900/60 p-8 shadow-xl backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
          Restaurant POS
        </p>
        <h1 className="mt-2 text-3xl font-bold">Point of Sale</h1>
        <p className="mt-4 text-slate-300">
          Frontend skeleton — React + TypeScript + Tailwind CSS. This is the
          starting point for the tablet-first, offline-capable POS surface.
        </p>
        <p className="mt-6 text-sm text-slate-400">
          See <code className="text-amber-300">docs/roadmap.md</code> for what
          comes next.
        </p>
      </main>
    </div>
  )
}
