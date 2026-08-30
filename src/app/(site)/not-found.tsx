import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="hairline-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="shell relative flex flex-col items-start py-16">
        <p className="eyebrow mb-6">404 — Page not found</p>
        <h1 className="display-1 max-w-3xl">
          This page took a different
          <span className="font-serif font-normal italic text-primary"> route.</span>
        </h1>
        <p className="lede mt-7 max-w-xl">
          The address doesn&apos;t exist — it may have moved when our new site launched.
          Try one of these instead:
        </p>
        <ul className="mt-9 flex flex-wrap gap-3">
          {[
            { href: "/", label: "Home" },
            { href: "/services", label: "Services" },
            { href: "/work", label: "Work" },
            { href: "/insights", label: "Insights" },
            { href: "/contact", label: "Contact" },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-block rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
