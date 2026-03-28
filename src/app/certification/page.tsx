import { CERTIFICATION_TRACKS } from "@/lib/data";

export default function CertificationPage() {
  return (
    <div className="container-shell py-16">
      <div className="max-w-4xl space-y-4">
        <p className="kicker">Certification information</p>
        <h1 className="section-title">Informational certification pathways, not a fake LMS storefront</h1>
        <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
          This page was intentionally reframed. It explains the visible pathway and directs users to
          chapters or WIAL Global rather than pretending to replace the external LMS or course
          delivery workflows.
        </p>
      </div>

      <div className="mt-10 grid gap-5 xl:grid-cols-2">
        {CERTIFICATION_TRACKS.map((track) => (
          <article key={track.level} className="card-subtle p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              {track.level}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{track.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{track.summary}</p>
            <div className="mt-4 rounded-[1.25rem] border border-black/8 bg-white p-4">
              <p className="text-sm text-[color:var(--muted-foreground)]">Typical scope</p>
              <p className="mt-1 font-semibold">{track.hours}</p>
              <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{track.audience}</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
              {track.requirements.map((requirement) => (
                <li key={requirement}>• {requirement}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm font-semibold text-black">{track.cta}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
