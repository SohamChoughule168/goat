import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/content/insights";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InsightsPreview() {
  const latest = insights.slice(0, 3);
  if (!latest.length) return null;

  return (
    <section className="section-y border-t border-border">
      <div className="shell">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal="fade" className="eyebrow mb-4">
              Insights
            </p>
            <h2 data-reveal="up" className="display-2 max-w-xl">
              Notes from the workbench.
            </h2>
          </div>
          <Link
            data-reveal="up"
            href="/insights"
            className="link-line hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
          >
            All articles <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {latest.map((post, i) => (
            <li key={post.slug} data-reveal="up" data-reveal-delay={String(i * 70)}>
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
                <h3 className="mt-5 text-lg font-medium leading-snug">{post.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                  {post.readingTime} read
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
