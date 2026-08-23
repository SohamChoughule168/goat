import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { insightCategories, insights } from "@/content/insights";

export const metadata: Metadata = createMetadata({
  title: "Insights",
  description:
    "Practical notes on web performance, AI-assisted delivery, search visibility and working with digital studios — written by the people who do the work.",
  path: "/insights",
});

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category && category !== "All" ? category : null;
  const list = active ? insights.filter((i) => i.category === active) : insights;

  return (
    <>
      <section className="section-y pb-10">
        <div className="shell">
          <p data-reveal="fade" className="eyebrow mb-5">
            Insights
          </p>
          <h1 data-reveal="up" className="display-1 max-w-4xl">
            Notes from the
            <span className="font-serif font-normal italic text-primary"> workbench.</span>
          </h1>
        </div>
      </section>

      <nav aria-label="Categories" className="border-y border-border">
        <div className="shell flex gap-2 overflow-x-auto py-3">
          {insightCategories.map((c) => {
            const isActive = c === "All" ? !active : c === active;
            return (
              <Link
                key={c}
                href={c === "All" ? "/insights" : `/insights?category=${encodeURIComponent(c)}`}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 rounded-full border px-4 py-1.5 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {c}
              </Link>
            );
          })}
        </div>
      </nav>

      <section className="py-16">
        <ul className="shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((post, i) => (
            <li key={post.slug} data-reveal="up" data-reveal-delay={String((i % 3) * 70)}>
              <Link
                href={`/insights/${post.slug}` as Route}
                className="group flex h-full flex-col rounded-xl border border-border bg-card/40 p-7 transition-colors duration-300 hover:border-primary/50 hover:bg-card"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                    {post.category}
                  </span>
                  <time dateTime={post.date} className="text-xs text-muted-foreground">
                    {formatDate(post.date)}
                  </time>
                </div>
                <h2 className="mt-5 text-lg font-medium leading-snug">{post.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                  {post.readingTime} read
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

