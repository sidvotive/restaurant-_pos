interface PlaceholderPageProps {
  title: string
  issue: string
}

/** Generic "coming soon" page for surfaces not yet built, linked to their issue. */
export default function PlaceholderPage({ title, issue }: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <p className="text-slate-300">This surface is on the roadmap.</p>
          <p className="mt-2 text-sm text-slate-500">Tracked in {issue}.</p>
        </div>
      </div>
    </div>
  )
}
