import Link from "next/link";
import { ArrowRight, Globe2, Landmark, Languages, ShieldCheck } from "lucide-react";
import { FindCoachWidget } from "@/components/home/FindCoachWidget";
import { CHAPTERS, getGlobalStats } from "@/lib/data";

export default function HomePage() {
  const stats = getGlobalStats();
  const featuredChapters = CHAPTERS.filter((chapter) =>
    ["nigeria", "brazil", "united-states", "malaysia"].includes(chapter.slug)
  );

  return (
    <div className="pb-20">
      <section className="border-b border-black/8 bg-[#efebe4]">
        <div className="container-shell grid gap-12 py-18 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="space-y-6">
            <p className="kicker">WIAL website + chapter platform</p>
            <h1 className="section-title max-w-4xl text-balance">
              One governed platform for WIAL Global, local chapters, coach discovery, and
              multilingual access.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              This upgraded build shifts the project from a brochure-style prototype into a
              chapter-platform story: governed chapter pages, native directory flows, WIAL-style
              dues handling, and AI features that make global discovery and chapter publishing
              meaningfully better.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/coaches"
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
              >
                Explore coach directory
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black"
              >
                Open admin demo
              </Link>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              <div className="card-subtle p-5">
                <p className="text-sm text-[color:var(--muted-foreground)]">Imported coach records</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{stats.coachCount}</p>
              </div>
              <div className="card-subtle p-5">
                <p className="text-sm text-[color:var(--muted-foreground)]">Chapter templates</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{stats.chapterCount}</p>
              </div>
              <div className="card-subtle p-5">
                <p className="text-sm text-[color:var(--muted-foreground)]">Language-ready surface</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{stats.languageCount}</p>
              </div>
            </div>
          </div>

          <div className="surface rounded-[2rem] p-6 md:p-8">
            <div className="grid gap-4">
              {[
                {
                  icon: Globe2,
                  title: "Global + chapter consistency",
                  body: "Parent branding is preserved while chapters still get editable local zones."
                },
                {
                  icon: Languages,
                  title: "AI-1 and AI-2 focus",
                  body: "Cross-lingual search and chapter content generation sit directly inside the public platform story."
                },
                {
                  icon: Landmark,
                  title: "Dues portal, not fake LMS",
                  body: "Payments are framed as affiliate / chapter invoices, not course checkout pretending to be the LMS."
                },
                {
                  icon: ShieldCheck,
                  title: "Honest source gaps",
                  body: "Imported coach rows are shown with verification flags instead of made-up certification data."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-black/8 bg-[color:var(--background)] p-5">
                  <item.icon size={18} className="text-[color:var(--accent)]" />
                  <h2 className="mt-3 text-lg font-semibold tracking-tight">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="kicker">Chapter preview</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Same template, different local context
            </h2>
          </div>
          <Link href="/chapters" className="text-sm font-semibold text-black underline">
            View all chapters
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {featuredChapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/chapters/${chapter.slug}`}
              className="card-subtle block p-5 transition hover:-translate-y-0.5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                {chapter.region}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{chapter.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                {chapter.heroSubtitle}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[color:var(--muted-foreground)]">{chapter.coachCount} coach records</span>
                <span className="font-semibold text-black">Open chapter</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell pb-16">
        <FindCoachWidget />
      </section>

      <section className="container-shell grid gap-5 pb-16 lg:grid-cols-3">
        <div className="card-subtle p-6">
          <p className="kicker">AI-1</p>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">Cross-lingual search</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            Search the directory in Portuguese, English, or French and still retrieve country and
            language-relevant coaches, even when imported metadata is incomplete.
          </p>
        </div>
        <div className="card-subtle p-6">
          <p className="kicker">AI-2</p>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">Chapter-in-a-box generation</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            Chapter leads can generate culturally adapted homepage drafts, but everything remains
            behind review gates before publication.
          </p>
        </div>
        <div className="card-subtle p-6">
          <p className="kicker">AI-4</p>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">Research as discovery</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            WIAL knowledge items become searchable, plain-language, and useful for both chapter
            marketing and prospective client education.
          </p>
        </div>
      </section>
    </div>
  );
}
