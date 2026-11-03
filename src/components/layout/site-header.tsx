"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { companyNav, primaryNav } from "@/content/navigation";
import CommandPalette from "./command-palette";
import SiteIndex from "./site-index";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [companyPath, setCompanyPath] = useState<string | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement>(null);
  const companyOpen = companyPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!companyRef.current?.contains(event.target as Node)) {
        setCompanyPath(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIndexOpen(false);
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setCompanyPath(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="inst-shell site-header-inner">
          <Link
            href="/"
            className="site-wordmark"
            aria-label="ImaginarsClub Institutional systems — home"
          >
            <LogoMark className="h-7 w-auto" />
            <span className="site-wordmark-name">ImaginarsClub</span>{" "}
            <span className="site-wordmark-meta">Institutional systems</span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className="site-nav-link"
                data-active={isActive(pathname, item.href)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}

            <div className="site-company" ref={companyRef}>
              <button
                type="button"
                className="site-company-button"
                aria-expanded={companyOpen}
                aria-controls="site-company-menu"
                onClick={() => setCompanyPath(companyOpen ? null : pathname)}
              >
                Company
                <ChevronDown size={13} strokeWidth={1.6} aria-hidden="true" />
              </button>
              {companyOpen ? (
                <div className="site-company-menu" id="site-company-menu">
                  {companyNav.map((item) => (
                    <Link key={item.href} href={item.href as Route}>
                      <strong>{item.label}</strong>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="site-header-actions">
            <button
              type="button"
              className="site-index-button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search the site"
            >
              <Search size={13} strokeWidth={1.6} aria-hidden="true" />
              Search
              <span
                className="site-index-kbd"
                aria-hidden="true"
                data-shortcut="⌘K"
              />
            </button>
            <button
              type="button"
              className="site-index-button"
              onClick={() => setIndexOpen(true)}
            >
              Index
            </button>
            <Link href="/book" className="inst-btn">
              Book a call
            </Link>
            <button
              type="button"
              className="site-mobile-button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search the site"
            >
              <Search size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="site-mobile-button"
              onClick={() => setIndexOpen(true)}
              aria-label="Open site index"
            >
              <Menu size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <SiteIndex
        open={indexOpen}
        onOpenChange={setIndexOpen}
        onOpenSearch={() => {
          setIndexOpen(false);
          setPaletteOpen(true);
        }}
      />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
