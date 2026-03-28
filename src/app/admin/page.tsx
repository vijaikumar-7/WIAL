import { ChapterContentGenerator } from "@/components/admin/ChapterContentGenerator";
import { ChapterProvisioner } from "@/components/admin/ChapterProvisioner";
import { InvoicePortal } from "@/components/admin/InvoicePortal";
import { getChapters, getCoaches, getInvoices } from "@/lib/data";

export default function AdminPage() {
  const chapterOptions = getChapters().map((chapter) => ({
    slug: chapter.slug,
    name: chapter.name,
    region: chapter.region,
    primaryLanguage: chapter.primaryLanguage
  }));
  const coachOptions = getCoaches();
  const invoices = getInvoices();

  return (
    <div className="container-shell py-16">
      <div className="max-w-4xl space-y-4">
        <p className="kicker">Admin demo</p>
        <h1 className="section-title">Governance, dues, and chapter publishing</h1>
        <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
          This page is the “credible operations” side of the story. The public site matters, but
          judges also want to see how WIAL Global and chapter leads would actually run the network.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <div className="card-subtle p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
            Chapter provisioning
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">One-click chapter setup</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            The back-end still needs persistence, but the admin flow is now modeled around:
            create chapter → assign path → inherit template → add local content.
          </p>
        </div>
        <div className="card-subtle p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
            Template inheritance
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">Global rules stay locked</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            Chapters can change local narrative, roster, and events, but shared header, footer,
            navigation, and core styling remain governed by the parent template.
          </p>
        </div>
        <div className="card-subtle p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
            Data truth
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">Certification sync still external</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
            The imported CSV is intentionally not treated as certification truth. Those badges should
            sync from verified systems like Credly or executive approval later.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <ChapterProvisioner />
        <InvoicePortal invoices={invoices} />
        <ChapterContentGenerator chapterOptions={chapterOptions} coachOptions={coachOptions} />
      </div>
    </div>
  );
}
