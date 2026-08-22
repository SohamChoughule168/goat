"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/content/site";
import { pillars } from "@/content/services";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
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
    `link-line rounded-sm py-1 text-sm font-medium transition-colors ${
      isActive(href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-[4.25rem] items-center justify-between gap-6">
        <LogoLink />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-sm py-1 text-sm font-medium transition-colors ${
                isActive("/services")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Services
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-[34rem] -translate-x-1/2 rounded-xl border border-border bg-popover p-2 shadow-2xl shadow-black/40">
                <div className="grid grid-cols-2 gap-1">
                  {pillars.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/services/${p.slug}` as Route}
                      className="group rounded-lg p-4 transition-colors hover:bg-accent"
                    >
                      <span className="font-mono text-[10px] tracking-[0.3em] text-primary">
                        {p.index}
                      </span>
                      <span className="mt-1 block font-display text-base font-medium">
                        {p.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {p.kicker}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-1 border-t border-border pt-2">
                  <Link
                    href="/services"
                    className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    All services
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href as Route} className={linkCls(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden h-9 px-4 font-mono text-xs uppercase tracking-widest md:inline-flex"
          >
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button asChild size="sm" className="hidden h-9 px-4 md:inline-flex">
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
            <SheetContent
              side="right"
              className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col px-6 pt-4">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className="border-b border-border py-4 font-display text-2xl font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="py-5">
                  <p className="eyebrow mb-4">Practice areas</p>
                  <ul className="grid gap-2.5">
                    {pillars.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/services/${p.slug}` as Route}
                          className="flex items-baseline gap-3 text-sm text-muted-foreground"
                        >
                          <span className="font-mono text-[10px] text-primary">{p.index}</span>
                          {p.title}
                          <span className="text-xs opacity-60">{p.kicker}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
              <div className="mt-auto space-y-4 border-t border-border p-6">
                <Button asChild className="h-10 w-full">
                  <Link href="/contact">Start a project</Link>
                </Button>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <a href={`tel:${site.phoneHref}`} className="block hover:text-foreground">
                    {site.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="block break-all hover:text-foreground">
                    {site.email}
                  </a>
                  <p className="text-xs">{site.hours.days}, {site.hours.time}</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
