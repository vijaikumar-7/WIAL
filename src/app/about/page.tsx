import { Globe2, LayoutTemplate, ShieldCheck, Wallet } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container-shell py-16">
      <div className="max-w-4xl space-y-5">
        <p className="kicker">About the platform direction</p>
        <h1 className="section-title">Why this build now looks like a WIAL platform instead of a generic site</h1>
        <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
          The WIAL opportunity is not just “make a prettier website.” It is a governance problem:
          chapters need local independence, WIAL Global needs consistent branding, and the public
          needs a cleaner way to find coaches, events, and evidence.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {[
          {
            icon: LayoutTemplate,
            title: "Template inheritance",
            body: "Shared navigation, structure, and styling are protected. Chapters get editable local content areas without being able to break the parent brand."
          },
          {
            icon: Wallet,
            title: "Dues collection that fits the SRD",
            body: "The payment story has been reframed around chapter / affiliate dues and invoice reporting, not a fake course commerce flow."
          },
          {
            icon: Globe2,
            title: "Global chapter discovery",
            body: "Events, coach discovery, and chapter pages now live in one platform story instead of scattering users across separate domains and tools."
          },
          {
            icon: ShieldCheck,
            title: "Honest certification handling",
            body: "The imported public directory does not contain reliable certification fields, so the interface flags those records for sync instead of inventing them."
          }
        ].map((item) => (
          <div key={item.title} className="card-subtle p-6">
            <item.icon size={18} className="text-[color:var(--accent)]" />
            <h2 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
