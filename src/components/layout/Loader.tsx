"use client";

import { useEffect, useState } from "react";

export function Loader() {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const text = "WIAL Global Chapter Hub";

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = window.sessionStorage.getItem("wial-loader-seen") === "1";

    if (reducedMotion || alreadySeen) {
      return;
    }

    window.sessionStorage.setItem("wial-loader-seen", "1");
    setVisible(true);

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, 55);

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--background)]">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-black/10 bg-white text-2xl font-semibold shadow-md">
          W
        </div>
        <div className="space-y-2">
          <p className="typewriter text-sm uppercase tracking-[0.34em] text-[color:var(--muted-foreground)]">
            {typed}
            <span className="animate-pulse">|</span>
          </p>
          <p className="text-xs text-[color:var(--muted-foreground)]">Loading chapter platform</p>
        </div>
      </div>
    </div>
  );
}
