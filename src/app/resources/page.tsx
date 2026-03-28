import { KnowledgeSearch } from "@/components/resources/KnowledgeSearch";
import { getKnowledgeItems } from "@/lib/data";

export default function ResourcesPage() {
  const items = getKnowledgeItems();

  return (
    <div className="container-shell py-16">
      <div className="max-w-4xl space-y-4">
        <p className="kicker">Resources & library</p>
        <h1 className="section-title">Research, webinars, and knowledge discovery</h1>
        <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
          The seeded library turns long-form research into plain-language summaries without hiding
          source links or claiming more than the evidence supports.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="card-subtle p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              {item.type}
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              {item.plainLanguageSummary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <KnowledgeSearch />
      </div>
    </div>
  );
}
