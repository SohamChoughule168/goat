"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { insightCategories, insights } from "@/content/insights";
import { useState } from "react";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function InsightsClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featured = insights[0];
  const list = activeCategory
    ? insights.filter((i) => i.category === activeCategory)
    : insights.slice(1);
  const visibleCount = activeCategory ? list.length : insights.length;

  return (
    <>
      <section className="section-y pt-0" aria-labelledby="lead-note">
        <div className="shell">
          <div className="mb-6 flex items-end justify-between gap-6">
            <p className="eyebrow">Lead note</p>
            <p className="font-mono text-[length:var(--text-micro)] uppercase tracking-[0.18em] text-[var(--ink-3)]">
              Latest / {formatDate(featured.date)}
            </p>
          </div>

          <Link href={`/insights/${featured.slug}`} className="insight-feature group">
            <div className="insight-feature-copy">
              <p className="micro text-[var(--accent)]">
                {featured.category} · {featured.readingTime} read
              </p>
              <h2 id="lead-note">{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="mt-7 inline-flex items-center gap-2 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.16em] text-[var(--accent)]">
                Read the note <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="insight-feature-art" aria-hidden="true">
              <div className="folio-visual">
                <div className="folio-sheet">
                  <span>Field note / back matter</span>
                  <div className="folio-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>ImaginarsClub · 2026</span>
                </div>
                <div className="folio-sheet">
                  <span>Index / education</span>
                  <strong>Ask what the front office answers.</strong>
                  <div className="folio-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="folio-sheet">
                  <span>Note 01 / {featured.readingTime}</span>
                  <strong>The institute website checklist.</strong>
                  <div className="folio-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="folio-stamp">
                    <span>Read time</span>
                    <span>{featured.readingTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section id="library" className="scroll-mt-24 border-t border-[var(--rule)]">
        <div className="shell">
          <nav aria-label="Filter notes by category" className="flex gap-2 overflow-x-auto py-4">
            {insightCategories.map((c) => {
              const isActive = c === "All" ? !activeCategory : c === activeCategory;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c === "All" ? null : c)}
                  aria-pressed={isActive}
                  className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="shell pb-20 pt-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{activeCategory ?? "All notes"}</p>
              <h2 className="display-2 mt-3 max-w-[18ch]">
                {activeCategory ? "Filtered reading." : "The rest of the bench."}
              </h2>
            </div>
            <p
              aria-live="polite"
              className="hidden font-mono text-[length:var(--text-micro)] uppercase tracking-[0.16em] text-[var(--ink-3)] sm:block"
            >
              {String(visibleCount).padStart(2, "0")} notes
            </p>
          </div>

          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((post, i) => (
              <li
                key={post.slug}
                data-reveal="up"
                data-reveal-delay={String((i % 3) * 70)}
                className="h-full"
              >
                <Link
                  href={`/insights/${post.slug}`}
                  className="group flex h-full flex-col border border-[var(--rule)] bg-[var(--paper-2)] p-6 transition-colors duration-300 hover:border-[var(--rule-strong)] hover:bg-[var(--paper)]"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
                      {post.category}
                    </span>
                    <time dateTime={post.date} className="text-xs text-[var(--ink-3)]">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <h3 className="mt-5 [font-family:var(--font-display)] text-[1.35rem] leading-[1.12] tracking-[-0.02em]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--ink-3)]">
                    {post.excerpt}
                  </p>
                  <span className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-4 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)] transition-colors group-hover:text-[var(--accent)]">
                    <span>{post.readingTime} read</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
