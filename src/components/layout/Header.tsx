"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(() => NAV_LINKS, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[color:var(--background)]/90 backdrop-blur">
      <div className="container-shell flex h-18 items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-semibold shadow-sm">
            W
          </div>
          <div className="hidden sm:block">
            <div className="text-[0.74rem] uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
              World Institute for Action Learning
            </div>
            <div className="text-sm font-semibold tracking-tight">Global Chapter Hub</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]",
                  active && "text-[color:var(--foreground)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] shadow-sm transition hover:border-black/20 hover:bg-black hover:text-white"
          >
            Admin Demo
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white shadow-sm md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-black/6 bg-[color:var(--background)] md:hidden">
          <div className="container-shell flex flex-col gap-2 py-4">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium",
                    active ? "bg-white text-black" : "text-[color:var(--muted-foreground)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black"
            >
              Admin Demo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
