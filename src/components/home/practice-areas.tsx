import Link from "next/link";
import type { Route } from "next";
import { getServicesByPillar, pillars } from "@/content/services";

export default function PracticeAreas() {
  return (
    <section className="field" data-field="ink" aria-label="Practice areas">
      <div className="container">
        <div className="flex items-baseline justify-between gap-6">
          <p className="micro">Practices</p>
          <span className="index">04 practices / 18 services</span>
        </div>
        <h2 className="mega mt-8 max-w-[14ch]">Everything digital. One studio.</h2>

        <ul className="mt-16 border-t-[3px] border-current">
          {pillars.map((p, i) => {
            const list = getServicesByPillar(p.slug);
            return (
              <li key={p.slug} className="border-b-[3px] border-current/20">
                <Link
                  href={`/services/${p.slug}` as Route}
                  className="group -mx-4 flex items-baseline justify-between gap-8 px-4 py-10 transition-opacity duration-150 hover:opacity-80"
                >
                  <span className="min-w-0">
                    <span className="index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-2 block display">{p.title}</span>
                    <span className="mt-2 block max-w-[52ch] text-sm leading-relaxed muted">
                      {list[0]?.tagline}
                    </span>
                  </span>
                  <span className="index shrink-0 pt-2 whitespace-nowrap">
                    {String(list.length).padStart(2, "0")} services →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

