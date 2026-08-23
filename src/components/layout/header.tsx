"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/content/site";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { ChevronDown } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import ThemeToggle from "@/components/theme-toggle";
import { getServicesByPillar, pillars } from "@/content/services";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setServicesOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkCls = (href: string) =>
    `link-line rounded-sm py-1 text-sm transition-colors ${
      isActive(href)
        ? "text-foreground underline decoration-[2px] underline-offset-8"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-[background-color,border-color] duration-200 ${
        scrolled || servicesOpen
          ? "border-b border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg)]/[0.88] backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <LogoLink />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-sm py-1 text-sm transition-colors ${
                isActive("/services")
                  ? "text-foreground underline decoration-2 underline-offset-8"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Services
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-150 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-1/2 top-full mt-3 grid w-[720px] -translate-x-1/2 grid-cols-4 gap-6 rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface)] p-6 shadow-2xl"
              >
                {pillars.map((p, i) => (
                  <div key={p.slug}>
                    <p className="micro">{String(i + 1).padStart(2, "0")} · {p.title}</p>
                    <ul className="mt-3 space-y-2">
                      {getServicesByPillar(p.slug).map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services/${s.slug}` as Route}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href as Route} className={linkCls(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/contact">Start a project</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M2 5h16M2 10h16M2 15h10" strokeLinecap="round" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col px-6 pt-4">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className="border-b py-4 text-h4 font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="py-5">
                  <p className="micro mb-3">Practices</p>
                  <ul className="grid gap-2">
                    {pillars.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/services/${p.slug}` as Route}
                          className="text-sm text-muted-foreground"
                        >
                          {p.index} · {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
              <div className="mt-auto space-y-4 border-t p-6">
                <Button asChild className="h-11 w-full">
                  <Link href="/contact">Start a project</Link>
                </Button>
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}



