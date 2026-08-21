"use client"

export default function ErrorPage({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return <div className="flex min-h-[75vh] items-center justify-center px-6 text-center"><div><span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">Connection interrupted</span><h1 className="mt-3 text-4xl font-black text-text-primary">The lineup could not load</h1><p className="mt-3 text-text-secondary">Check your connection, then try loading the catalog again.</p><button type="button" onClick={reset} className="mt-7 h-11 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-bright">Try again</button></div></div>
}
