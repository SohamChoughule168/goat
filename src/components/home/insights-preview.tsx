import Link from "next/link";
import type { Route } from "next";
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
    <section className="section-y border-t border-border" aria-label="Latest writing">
      <div className="shell grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <p className="micro">Insights</p>
          <h2 className="display-2 mt-4 max-w-sm">Notes from the workbench.</h2>
          <Link
            href="/insights"
            className="link-line mt-6 inline-block text-sm font-medium text-[color:var(--text-1)]"
          >
            All articles
          </Link>
        </div>

        <ul className="border-t border-border">
          {latest.map((post) => (
            <li key={post.slug} className="border-b border-border">
              <Link
                href={`/insights/${post.slug}` as Route}
                className="group -mx-2 flex items-baseline justify-between gap-6 rounded-md px-2 py-6 transition-colors duration-150 hover:bg-[color:var(--surface-2)]"
              >
                <span className="min-w-0">
                  <span className="micro">{post.category}</span>
                  <span className="mt-1.5 block font-medium leading-snug text-[color:var(--text-1)]">
                    {post.title}
                  </span>
                </span>
                <span className="micro shrink-0 pt-1 text-right">
                  {formatDate(post.date)}
                  <span className="block pt-1 normal-case tracking-normal">
                    {post.readingTime} read
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

