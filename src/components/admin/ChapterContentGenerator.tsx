"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import type { ChapterDraftOutput, CoachRecord } from "@/lib/types";

export function ChapterContentGenerator({
  chapterOptions,
  coachOptions
}: {
  chapterOptions: { slug: string; name: string; region: string; primaryLanguage: string }[];
  coachOptions: CoachRecord[];
}) {
  const [chapterSlug, setChapterSlug] = useState(chapterOptions[0]?.slug ?? "brazil");
  const [chapterName, setChapterName] = useState("WIAL Brazil");
  const [region, setRegion] = useState("South America");
  const [language, setLanguage] = useState("Portuguese");
  const [valueProposition, setValueProposition] = useState(
    "A chapter page that helps local leaders understand Action Learning and discover relevant coaches."
  );
  const [localContext, setLocalContext] = useState(
    "Reference local business realities and keep the tone credible, practical, and globally aligned."
  );
  const [eventTitle, setEventTitle] = useState("Action Learning for leadership teams");
  const [testimonial, setTestimonial] = useState(
    "The chapter site now feels local without drifting away from the global WIAL standard."
  );
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);
  const [draft, setDraft] = useState<ChapterDraftOutput | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleCoach(id: string) {
    setSelectedCoaches((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id].slice(-3)
    );
  }

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/chapter-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterSlug,
          chapterName,
          region,
          language,
          valueProposition,
          localContext,
          selectedCoaches,
          eventTitle,
          testimonial
        })
      });

      if (!response.ok) throw new Error("Generation failed");
      const data = (await response.json()) as ChapterDraftOutput;
      setDraft(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="surface rounded-[2rem] p-6 md:p-8">
      <div className="mb-6 space-y-2">
        <p className="kicker">AI-2 chapter-in-a-box</p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Generate chapter homepage copy with review gates
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
          This flow is deliberately review-first. Generated public copy is never assumed to be
          publication-ready. The admin user gets a draft with warnings and tone notes.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Chapter</span>
              <select
                value={chapterSlug}
                onChange={(event) => {
                  const next = chapterOptions.find((chapter) => chapter.slug === event.target.value);
                  setChapterSlug(event.target.value);
                  if (next) {
                    setChapterName(next.name);
                    setRegion(next.region);
                    setLanguage(next.primaryLanguage);
                  }
                }}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              >
                {chapterOptions.map((chapter) => (
                  <option key={chapter.slug} value={chapter.slug}>
                    {chapter.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium">Language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              >
                {["English", "Portuguese", "French", "Spanish"].map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Value proposition</span>
            <textarea
              value={valueProposition}
              onChange={(event) => setValueProposition(event.target.value)}
              rows={3}
              className="w-full rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-4"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Local context</span>
            <textarea
              value={localContext}
              onChange={(event) => setLocalContext(event.target.value)}
              rows={4}
              className="w-full rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-4"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Featured event</span>
              <input
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium">Region</span>
              <input
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Testimonial</span>
            <textarea
              value={testimonial}
              onChange={(event) => setTestimonial(event.target.value)}
              rows={3}
              className="w-full rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-4"
            />
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium">Coach roster input (choose up to 3)</p>
            <div className="grid gap-2 md:grid-cols-2">
              {coachOptions.slice(0, 12).map((coach) => {
                const active = selectedCoaches.includes(coach.name);
                return (
                  <button
                    key={coach.id}
                    type="button"
                    onClick={() => toggleCoach(coach.name)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                      active
                        ? "border-black/20 bg-white"
                        : "border-black/8 bg-[color:var(--background)]"
                    }`}
                  >
                    <span className="block font-medium">{coach.name}</span>
                    <span className="block text-[color:var(--muted-foreground)]">
                      {coach.locationText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={16} />}
            Generate draft
          </button>
        </div>

        <div className="rounded-[1.75rem] border border-black/8 bg-white p-5">
          {draft ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  Hero title
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{draft.heroTitle}</h3>
              </div>
              <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                {draft.heroSubtitle}
              </p>

              <div className="rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  Overview
                </p>
                <p className="mt-2 text-sm leading-7">{draft.overview}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    Event teaser
                  </p>
                  <p className="mt-2 text-sm leading-7">{draft.eventTeaser}</p>
                </div>
                <div className="rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    Coach spotlight
                  </p>
                  <p className="mt-2 text-sm leading-7">{draft.coachSpotlight}</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[color:var(--warning)]/25 bg-[color:var(--warning)]/10 p-4 text-sm text-[color:var(--warning)]">
                <p className="font-medium">Review required before publish</p>
                <ul className="mt-2 space-y-1">
                  {draft.warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {draft.toneNotes.map((note) => (
                  <span key={note} className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-96 items-center justify-center rounded-[1.5rem] border border-dashed border-black/10 bg-[color:var(--background)] p-8 text-center text-sm leading-7 text-[color:var(--muted-foreground)]">
              Generate a chapter draft to preview the AI-2 experience. The right panel is built to
              show a draft, not an auto-published page.
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
