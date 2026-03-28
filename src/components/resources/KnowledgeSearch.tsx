"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { KnowledgeResponse } from "@/lib/types";

export function KnowledgeSearch() {
  const [query, setQuery] = useState("Does Action Learning help healthcare teams?");
  const [data, setData] = useState<KnowledgeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error("Knowledge service unavailable");
      const json = (await response.json()) as KnowledgeResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="surface rounded-[2rem] p-6 md:p-8">
      <div className="mb-5 space-y-2">
        <p className="kicker">AI-4 knowledge engine</p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Search WIAL research and webinar content
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
          The seeded knowledge library is intentionally evidence-first. It keeps source links visible
          and avoids claiming findings that are not present in the seeded case study set.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-13 rounded-full border border-black/8 bg-[color:var(--background)] px-4 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-13 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Run knowledge search"}
        </button>
      </form>

      {data ? (
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="rounded-[1.5rem] border border-black/8 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
              Answer
            </p>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{data.answer}</p>
            <div className="mt-4 rounded-2xl border border-black/8 bg-[color:var(--background)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Promo draft
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground)]">{data.generatedPromo}</p>
            </div>
          </div>

          <div className="space-y-4">
            {data.matchedItems.map((item) => (
              <article key={item.id} className="rounded-[1.5rem] border border-black/8 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  {item.type}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                  {item.plainLanguageSummary}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-black/10 bg-[color:var(--background)] px-3 py-1 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-black underline"
                >
                  Open source
                </a>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
