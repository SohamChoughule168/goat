import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { getServicesByPillar, pillars } from "@/content/services";

export default function OfferingSplit() {
  return (
    <section className="section-y">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="micro">Practices</p>
          <h2 className="display-2 mt-4">Four practices. One standard.</h2>
          <p className="lede mt-5 text-sm">
            Every engagement runs through the same senior team and the same
            engineering bar — whether you need one landing page or an entire
            growth system.
          </p>
          <Link
            href="/services"
            className="btn btn-secondary mt-8"
          >
            All 18 services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="border-t border-border">
          {pillars.map((p, i) => {
            const list = getServicesByPillar(p.slug);
            return (
              <li key={p.slug} className="border-b border-border reveal" style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={`/services/${p.slug}` as Route}
                  className="group -mx-4 flex items-baseline justify-between gap-6 rounded-md px-4 py-8 transition-colors duration-120 hover:bg-[color:var(--surface-2)]"
                >
                  <span className="min-w-0">
                    <span className="micro">{p.index} · {p.kicker}</span>
                    <span className="mt-2 block display-3">{p.title}</span>
                    <span className="mt-2 block max-w-md text-sm leading-relaxed text-muted-foreground">
                      {list[0]?.tagline}
                    </span>
                  </span>
                  <span className="micro shrink-0 pt-1">{list.length} svcs</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
