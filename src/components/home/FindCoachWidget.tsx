"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { MatchResponse } from "@/lib/types";

export function FindCoachWidget() {
  const [query, setQuery] = useState(
    "We are a manufacturing company in Brazil looking to strengthen team leadership."
  );
  const [data, setData] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error("Unable to match coaches");
      const json = (await response.json()) as MatchResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface rounded-[2rem] p-6 md:p-8">
      <div className="mb-5 space-y-2">
        <p className="kicker">AI-3 smart coach matching</p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Describe the need in plain language
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)]">
          This widget intentionally stays structured and sober. It does not pretend to know the
          “best coach” with certainty. It ranks likely matches and falls back to chapter contact
          when the data is too sparse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          rows={4}
          className="min-h-32 rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-4 text-sm leading-7 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-13 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Find likely matches"}
        </button>
      </form>

      {data ? (
        <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-black/8 bg-white p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
              Why these results
            </p>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">{data.explanation}</p>

            {data.lowConfidence ? (
              <div className="mt-4 rounded-2xl border border-[color:var(--warning)]/25 bg-[color:var(--warning)]/10 p-4 text-sm text-[color:var(--warning)]">
                Imported coach metadata is sparse for this request. Use the ranked list as a
                starting point, then route the enquiry to the relevant chapter for verification.
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {data.criteria.countrySlugs.map((country) => (
                <span key={country} className="rounded-full border border-black/10 bg-[color:var(--background)] px-3 py-1 text-xs">
                  {country}
                </span>
              ))}
              {data.criteria.languages.map((language) => (
                <span key={language} className="rounded-full border border-black/10 bg-[color:var(--background)] px-3 py-1 text-xs">
                  {language}
                </span>
              ))}
              {data.criteria.topics.map((topic) => (
                <span key={topic} className="rounded-full border border-black/10 bg-[color:var(--background)] px-3 py-1 text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/8 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
              Top ranked records
            </p>
            <div className="space-y-3">
              {data.matches.slice(0, 3).map((result) => (
                <div key={result.coach.id} className="rounded-2xl border border-black/8 bg-[color:var(--background)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{result.coach.name}</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {result.coach.locationText}
                      </p>
                    </div>
                    <span className="text-xs text-[color:var(--muted-foreground)]">{Math.round(result.score)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.matchedFacets.slice(0, 3).map((facet) => (
                      <span key={facet} className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
                        {facet}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {data.fallbackChapter ? (
              <a
                href={`/chapters/${data.fallbackChapter.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black"
              >
                View fallback chapter route
                <ArrowRight size={14} />
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
