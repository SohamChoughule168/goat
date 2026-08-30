"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const LINKS = [
  { href: "/services/build", label: "Craft" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/insights", label: "Notes" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let last = window.scrollY;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const down = y > last + 4;
        const up = y < last - 4;
        if (down && y > 140) ref.current?.classList.add("is-hidden");
        else if (up || y <= 140) ref.current?.classList.remove("is-hidden");
        if (up || down) last = y;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav ref={ref} className="v6-nav" aria-label="Primary">
      <div className="v6-nav-pill">
        <Link href="/" className="!px-4 gap-2 flex items-center" aria-label="ImaginarsClub home" data-cursor="Home">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ color: "var(--blue)" }}>
            <rect x="6" y="6" width="20" height="20" rx="2.5" transform="rotate(45 16 16)" stroke="currentColor" strokeWidth="2" />
            <path d="M11 20.5 16 11l5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-semibold text-sm hidden sm:inline" style={{ color: "var(--text-hi)" }}>Imaginars</span>
        </Link>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>{l.label}</Link>
        ))}
        <Link href="/contact" className="v6-nav-cta" data-cursor="Talk">Start a project</Link>
      </div>
    </nav>
  );
}
