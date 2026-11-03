"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export type FaqItem = {
  q: string;
  a: string;
  category: string;
  href?: string;
  hrefLabel?: string;
};

const CATEGORY_ORDER = [
  "Working together",
  "Packages & pricing",
  "Portals & modules",
  "Ownership & trust",
  "Services",
];

export function FaqExplorer({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const present = new Set(items.map((item) => item.category));
    return ["All", ...CATEGORY_ORDER.filter((name) => present.has(name))];
  }, [items]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const inQuery =
        !term ||
        item.q.toLowerCase().includes(term) ||
        item.a.toLowerCase().includes(term);
      return inCategory && inQuery;
    });
  }, [items, query, category]);

  return (
    <div>
      <div className="sticky top-[4.25rem] z-20 -mx-4 border-y border-[var(--rule)] bg-[var(--paper)]/92 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-md sm:border">
        <label className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-[var(--ink-3)]" aria-hidden="true" />
          <span className="sr-only">Search questions</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--ink-3)]"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {categories.map((name) => {
            const active = category === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(name)}
                className={`min-h-8 rounded-full border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--paper)]"
                    : "border-[var(--rule)] text-[var(--ink-3)] hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <p className="micro mt-5" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "question" : "questions"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-[var(--rule)] p-8 text-center">
          <p className="text-sm text-[var(--ink-3)]">
            Nothing matches that search. Ask us directly and we will answer.
          </p>
          <Link href="/contact" className="link-line mt-3 inline-block text-sm text-[var(--accent)]">
            Send the question →
          </Link>
        </div>
      ) : (
        <div className="mt-3 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {filtered.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <span>
                  <span className="micro mb-1.5 block">{item.category}</span>
                  <span className="text-base font-medium">{item.q}</span>
                </span>
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-sm transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 max-w-[68ch] text-sm leading-relaxed text-[var(--ink-3)]">
                <p>{item.a}</p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="link-line mt-3 inline-block text-sm text-[var(--accent)]"
                  >
                    {item.hrefLabel ?? "Read more"} →
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
