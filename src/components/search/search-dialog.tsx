"use client"

import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { MediaCard } from "@/components/media/media-card"
import { Icon } from "@/components/shared/icon"
import type { MediaItem } from "@/lib/tmdb/types"

export function SearchDialog({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MediaItem[]>([])
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setState("loading")
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Search failed")
        setResults(await response.json() as MediaItem[])
        setState("ready")
      } catch (error) {
        if ((error as Error).name !== "AbortError") setState("error")
      }
    }, 300)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-center px-3 pt-3 sm:px-8 sm:pt-8" role="dialog" aria-modal="true" aria-label="Search Anuflix" onKeyDown={(event) => event.key === "Escape" && onClose()}>
      <button type="button" className="absolute inset-0 cursor-default bg-background/82 backdrop-blur-xl" aria-label="Close search" onClick={onClose} />
      <div className="relative flex h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden border border-border bg-background-secondary shadow-[0_30px_100px_rgba(0,0,0,.7)] sm:h-[calc(100vh-4rem)] sm:rounded-2xl">
        <div className={clsx(
          "m-4 flex h-14 shrink-0 items-center gap-3 rounded-xl border border-border bg-surface px-4 sm:m-6",
          "focus-within:border-brand-bright focus-within:shadow-[0_0_0_3px_rgba(59,130,246,.15)]",
          state === "loading" && "after:h-0.5 after:w-10 after:animate-pulse after:bg-brand-electric",
        )}>
          <Icon name="search" className="size-5 shrink-0 text-text-muted" />
          <input
            ref={input}
            value={query}
            onChange={(event) => {
              const value = event.target.value
              setQuery(value)
              if (value.trim().length < 2) {
                setResults([])
                setState("idle")
              }
            }}
            placeholder="Search movies and TV shows..."
            aria-label="Search movies and TV shows"
            className="h-full min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-subtle"
          />
          {query && <button type="button" className="grid size-9 place-items-center rounded-full text-text-muted hover:bg-surface-hover hover:text-white" aria-label="Clear search" onClick={() => { setQuery(""); setResults([]); setState("idle") }}><Icon name="close" className="size-4" /></button>}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 sm:px-6" aria-live="polite">
          {state === "idle" && (
            <div className="grid min-h-72 place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full border border-border-strong bg-surface text-xl font-semibold text-brand-light">/</span><p className="mt-4 text-sm text-text-secondary">Type at least two characters to explore movies and series.</p></div></div>
          )}
          {state === "loading" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6" aria-label="Searching">
              {Array.from({ length: 8 }, (_, index) => <span key={index} className="aspect-[2/3] animate-pulse rounded-lg bg-surface" />)}
            </div>
          )}
          {state === "error" && <div className="py-24 text-center"><h2 className="text-2xl font-bold text-text-primary">Search is unavailable</h2><p className="mt-2 text-sm text-text-secondary">Check your connection and try again.</p></div>}
          {state === "ready" && !results.length && <div className="py-24 text-center"><h2 className="text-2xl font-bold text-text-primary">No titles found</h2><p className="mt-2 text-sm text-text-secondary">Try another title, actor, or keyword.</p></div>}
          {state === "ready" && results.length > 0 && (
            <>
              <div className="mb-5 flex items-end justify-between gap-3"><h2 className="text-xl font-bold text-text-primary">Results for “{query.trim()}”</h2><span className="text-xs text-text-muted">{results.length} titles</span></div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">{results.map((media) => <MediaCard key={`${media.mediaType}-${media.id}`} media={media} />)}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
