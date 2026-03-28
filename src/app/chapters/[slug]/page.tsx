import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterBySlug, getCoachesByChapter, getEventsByChapter } from "@/lib/data";

export default async function ChapterPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) notFound();

  const coaches = getCoachesByChapter(slug).slice(0, 6);
  const events = getEventsByChapter(slug);

  return (
    <div className="pb-16">
      <section className="border-b border-black/8 bg-[#efebe4]">
        <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <p className="kicker">{chapter.name}</p>
            <h1 className="section-title">{chapter.heroTitle}</h1>
            <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
              {chapter.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              {chapter.focusAreas.map((focus) => (
                <span key={focus} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
                  {focus}
                </span>
              ))}
            </div>
          </div>

          <div className="surface rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              Chapter snapshot
            </p>
            <dl className="mt-5 grid gap-4 text-sm">
              <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
                <dt className="text-[color:var(--muted-foreground)]">Primary language</dt>
                <dd className="mt-1 font-semibold">{chapter.primaryLanguage}</dd>
              </div>
              <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
                <dt className="text-[color:var(--muted-foreground)]">Imported coach count</dt>
                <dd className="mt-1 font-semibold">{chapter.coachCount}</dd>
              </div>
              <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
                <dt className="text-[color:var(--muted-foreground)]">Contact path</dt>
                <dd className="mt-1 font-semibold">{chapter.contactEmail}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-10 py-16 lg:grid-cols-[1fr_0.92fr]">
        <div className="space-y-5">
          <div className="card-subtle p-6">
            <h2 className="text-2xl font-semibold tracking-tight">About this chapter</h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">{chapter.about}</p>
          </div>

          <div className="card-subtle p-6">
            <h2 className="text-2xl font-semibold tracking-tight">Featured event</h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
              {chapter.featuredEventTitle} — {chapter.featuredEventDate}
            </p>
          </div>

          <div className="card-subtle p-6">
            <h2 className="text-2xl font-semibold tracking-tight">What local leaders say</h2>
            <blockquote className="mt-4 text-base leading-8 text-[color:var(--foreground)]">
              “{chapter.testimonialQuote}”
            </blockquote>
            <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{chapter.testimonialAuthor}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card-subtle p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">Local coach roster</h2>
              <Link href="/coaches" className="text-sm font-semibold text-black underline">
                Open directory
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {coaches.length > 0 ? (
                coaches.map((coach) => (
                  <div key={coach.id} className="rounded-[1.25rem] border border-black/8 bg-white p-4">
                    <p className="font-semibold">{coach.name}</p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">{coach.locationText}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-black/10 bg-[color:var(--background)] p-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
                  No imported coach rows were available for this chapter in the provided CSV. The template still shows how a chapter page would behave once the roster is synced.
                </div>
              )}
            </div>
          </div>

          <div className="card-subtle p-6">
            <h2 className="text-2xl font-semibold tracking-tight">Events in the shared calendar</h2>
            <div className="mt-5 space-y-4">
              {events.map((event) => (
                <div key={event.id} className="rounded-[1.25rem] border border-black/8 bg-white p-4">
                  <p className="font-semibold">{event.title}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                    {event.date} • {event.format} • {event.location}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    {event.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
