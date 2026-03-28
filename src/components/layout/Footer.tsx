import Link from "next/link";
import { NAV_LINKS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-black/8 bg-[#ece8df]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-semibold shadow-sm">
              W
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">WIAL Global Chapter Hub</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                website + chapter platform prototype
              </p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">
            Built to align with the WIAL chapter-platform brief: governed chapter sites, native
            coach discovery, dues workflows, and AI-assisted global access without pretending to
            replace the existing LMS.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            Explore
          </h2>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[color:var(--foreground)] hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            Contact
          </h2>
          <div className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
            <p>WIAL Global contact path is intentionally lightweight in the MVP.</p>
            <p>
              Executive Director route:
              <br />
              <a href="mailto:global@wial.org" className="font-medium text-[color:var(--foreground)]">
                global@wial.org
              </a>
            </p>
            <p>Copyright © 2026 WIAL prototype</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
