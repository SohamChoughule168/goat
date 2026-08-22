import Link from "next/link";
import type { Route } from "next";
import { LogoFull } from "@/components/brand/logo";
import { site } from "@/content/site";
import { pillars } from "@/content/services";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-8">
        <div>
          <LogoFull />
          <p className="lede mt-5 max-w-xs text-sm">{site.description}</p>
          <ul className="mt-6 flex gap-4">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow mb-5">Explore</h2>
          <ul className="space-y-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Practice areas">
          <h2 className="eyebrow mb-5">Practice</h2>
          <ul className="space-y-3">
            {pillars.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/services/${p.slug}` as Route}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-5">Contact</h2>
          <address className="space-y-3 text-sm not-italic text-muted-foreground">
            <p>
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city} {site.address.postalCode}
            </p>
            <p>
              <a href={`tel:${site.phoneHref}`} className="inline-block py-1 transition-colors hover:text-foreground">
                {site.phone}
              </a>
              <br />
              <a
                href={`mailto:${site.email}`}
                className="inline-block break-all py-1 transition-colors hover:text-foreground"
              >
                {site.email}
              </a>
            </p>
            <p className="text-xs">
              {site.hours.days}, {site.hours.time}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="shell flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.25em]">Designed &amp; built in Mumbai</p>
          <div className="flex gap-5">
            <Link href="/legal/privacy" className="inline-block py-1 transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/terms" className="inline-block py-1 transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

