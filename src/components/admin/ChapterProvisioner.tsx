"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Globe2, LockKeyhole, PlusSquare } from "lucide-react";
import { titleCase } from "@/lib/utils";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ChapterProvisioner() {
  const [chapterName, setChapterName] = useState("WIAL Kenya");
  const [region, setRegion] = useState("Africa");
  const [language, setLanguage] = useState("English");
  const [pathMode, setPathMode] = useState<"subdirectory" | "subdomain">("subdirectory");
  const [contactEmail, setContactEmail] = useState("kenya@wial.org");
  const [provisioned, setProvisioned] = useState(false);

  const slug = useMemo(() => slugify(chapterName.replace(/^WIAL\s+/i, "")) || "new-chapter", [chapterName]);
  const previewUrl = pathMode === "subdirectory" ? `wial.org/${slug}` : `${slug}.wial.org`;

  return (
    <section className="surface rounded-[2rem] p-6 md:p-8">
      <div className="mb-6 space-y-2">
        <p className="kicker">Chapter provisioning</p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          One-click chapter setup with governed template inheritance
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
          This is a demo-safe provisioning flow that turns a chapter brief into a governed site
          path preview. Shared navigation, footer, styling, and page structure stay locked.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Chapter name</span>
              <input
                value={chapterName}
                onChange={(event) => setChapterName(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Primary language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              >
                {[
                  "English",
                  "Portuguese",
                  "French",
                  "Spanish"
                ].map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Region</span>
              <input
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Contact email</span>
              <input
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/8 bg-[color:var(--background)] px-4"
              />
            </label>
          </div>

          <fieldset className="space-y-2 text-sm">
            <legend className="font-medium">URL mode</legend>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "subdirectory", label: "Subdirectory (wial.org/kenya)" },
                { value: "subdomain", label: "Subdomain (kenya.wial.org)" }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`rounded-full border px-4 py-2 ${
                    pathMode === option.value ? "border-black/20 bg-white" : "border-black/8 bg-[color:var(--background)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="pathMode"
                    value={option.value}
                    checked={pathMode === option.value}
                    onChange={() => setPathMode(option.value as "subdirectory" | "subdomain")}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => setProvisioned(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white"
          >
            <PlusSquare size={16} />
            Provision chapter preview
          </button>
        </div>

        <div className="rounded-[1.75rem] border border-black/8 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Provisioning preview
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{chapterName}</h3>
            </div>
            <span className="rounded-full border border-black/10 bg-[color:var(--background)] px-3 py-1 text-xs">
              {language}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                URL preview
              </p>
              <p className="mt-2 font-semibold">{previewUrl}</p>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">Slug: {slug}</p>
            </div>
            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Chapter lead handoff
              </p>
              <p className="mt-2 font-semibold">{contactEmail}</p>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{titleCase(region)}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
              <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <LockKeyhole size={14} />
                Locked globally
              </p>
              <ul className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
                <li>• header and footer</li>
                <li>• navigation and layout</li>
                <li>• visual system and spacing</li>
                <li>• core page structure</li>
              </ul>
            </div>
            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
              <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <Globe2 size={14} />
                Editable locally
              </p>
              <ul className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
                <li>• hero copy and chapter intro</li>
                <li>• coaches and contact info</li>
                <li>• events and testimonials</li>
                <li>• client logos and local resources</li>
              </ul>
            </div>
          </div>

          {provisioned ? (
            <div className="mt-5 rounded-[1.25rem] border border-[color:var(--success)]/20 bg-[color:var(--success)]/10 p-4 text-sm text-[color:var(--success)]">
              <p className="inline-flex items-center gap-2 font-medium">
                <CheckCircle2 size={15} />
                Chapter preview provisioned
              </p>
              <p className="mt-2 leading-7">
                The platform would now create the chapter shell, assign the path, inherit the WIAL
                template, and hand off local content zones to the chapter lead.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
