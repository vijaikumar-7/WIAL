"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import type { CoachRecord, RankedCoachMatch, SearchResponse } from "@/lib/types";
import { CoachCard } from "@/components/directory/CoachCard";
import { cn } from "@/lib/utils";

function makeFallbackResults(coaches: CoachRecord[]): RankedCoachMatch[] {
  return coaches.map((coach) => ({
    coach,
    score: 0,
    matchedFacets: [],
    caution: coach.sourceGapFlags.includes("missing_certification_sync")
      ? ["Certification data still needs external sync."]
      : []
  }));
}

export function DirectoryClient({
  coaches,
  chapterSlug,
  languageOptions,
  countryOptions
}: {
  coaches: CoachRecord[];
  chapterSlug?: string | null;
  languageOptions: string[];
  countryOptions: string[];
}) {
  const [query, setQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [results, setResults] = useState<RankedCoachMatch[]>(makeFallbackResults(coaches));
  const [explanation, setExplanation] = useState(
    "Imported public coach records are shown below. Search becomes more precise as verified profile metadata is added."
  );
  const [loading, setLoading] = useState(false);
  const [lowConfidence, setLowConfidence] = useState(false);

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesLanguage =
        languageFilter === "all" || result.coach.languages.includes(languageFilter);
      const matchesCountry =
        countryFilter === "all" || result.coach.countryName === countryFilter;
      return matchesLanguage && matchesCountry;
    });
  }, [countryFilter, languageFilter, results]);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setResults(makeFallbackResults(coaches));
      setExplanation(
        "Showing the imported WIAL public directory export. Filters below help narrow by country and inferred chapter language."
      );
      setLowConfidence(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, chapterSlug })
      });

      if (!response.ok) {
        throw new Error("Search service unavailable.");
      }

      const data = (await response.json()) as SearchResponse;
      setResults(data.matches);
      setExplanation(data.explanation);
      setLowConfidence(data.lowConfidence);
    } catch {
      setResults(makeFallbackResults(coaches));
      setExplanation(
        "AI search is unavailable right now. Showing the imported directory with existing public metadata."
      );
      setLowConfidence(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSearch}
        className="grid gap-4 rounded-[1.75rem] border border-black/8 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_160px_180px_auto]"
      >
        <label className="relative block">
          <span className="sr-only">Search coaches</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-13 w-full rounded-full border border-black/8 bg-[color:var(--background)] pl-11 pr-4 text-sm outline-none ring-0 transition focus:border-black/20"
            placeholder="Search in English, Portuguese, French, or by country, chapter, or need"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
          Language
          <select
            value={languageFilter}
            onChange={(event) => setLanguageFilter(event.target.value)}
            className="h-13 rounded-full border border-black/8 bg-[color:var(--background)] px-4 text-sm font-normal text-[color:var(--foreground)]"
          >
            <option value="all">All</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
          Country
          <select
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
            className="h-13 rounded-full border border-black/8 bg-[color:var(--background)] px-4 text-sm font-normal text-[color:var(--foreground)]"
          >
            <option value="all">All</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex h-13 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white",
            loading && "opacity-70"
          )}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Search"}
        </button>
      </form>

      <div
        className={cn(
          "rounded-[1.5rem] border p-5 text-sm leading-7",
          lowConfidence
            ? "border-[color:var(--warning)]/25 bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
            : "border-black/8 bg-white text-[color:var(--muted-foreground)]"
        )}
      >
        <p className="font-medium text-[color:var(--foreground)]">Search notes</p>
        <p>{explanation}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-[color:var(--muted-foreground)]">
        <p>{filteredResults.length} coach records shown</p>
        <p>Certification + specialization details remain source-dependent and are not guessed.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredResults.map((result) => (
          <CoachCard key={result.coach.id} result={result} />
        ))}
      </div>
    </div>
  );
}
