import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/jsonld";
import FinalCta from "@/components/home/final-cta";
import { getInsight, insights } from "@/content/insights";
import { articleSchema, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

const RELATED_BY_CATEGORY: Record<string, { label: string; href: Route }[]> = {
  Education: [
    { label: "Institution blueprint", href: "/blueprint" },
    { label: "Web development", href: "/services/web-development" },
    { label: "Solutions by institution type", href: "/solutions" },
  ],
  "SEO & Search": [
    { label: "Generative engine optimization", href: "/services/generative-engine-optimization" },
    { label: "Answer engine optimization", href: "/services/answer-engine-optimization" },
    { label: "Search engine marketing", href: "/services/sem" },
  ],
  "Web Development": [
    { label: "Web development", href: "/services/web-development" },
    { label: "Website refurbishment", href: "/services/website-refurbishment" },
    { label: "PRV Financial Services case study", href: "/work/prv-financial-services" },
  ],
  "AI & Technology": [
    { label: "AI-driven websites", href: "/services/ai-driven-websites" },
    { label: "Google AI integration", href: "/services/google-ai-integration" },
  ],
  "Digital Marketing": [
    { label: "Digital marketing", href: "/services/digital-marketing" },
    { label: "Meta advertising", href: "/services/meta-advertising" },
    { label: "Scope estimator", href: "/estimate" },
  ],
};

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getInsight(slug);
  if (!post) return createMetadata({ title: "Not found", description: "", path: "/insights" });
  const published = new Date(`${post.date}T00:00:00+05:30`).toISOString();
  return createMetadata({
    title: post.metaTitle ?? post.title,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
    ogType: "article",
    article: {
      publishedTime: published,
      modifiedTime: published,
      section: post.category,
      authors: [post.author],
    },
  });
}

export default async function InsightPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getInsight(slug);
  if (!post) notFound();

  const related = insights.filter((i) => i.slug !== post.slug).slice(0, 2);
  const relatedLinks = RELATED_BY_CATEGORY[post.category] ?? [];
  const published = new Date(`${post.date}T00:00:00+05:30`).toISOString();

  return (
    <>
      <article className="pb-20">
        <header className="section-y pb-10">
          <div className="shell max-w-3xl">
            <Link
              href="/insights"
              className="link-line mb-8 inline-flex items-center gap-2 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Insights
            </Link>
            <div data-reveal="fade" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                {post.category}
              </span>
              <time dateTime={published} className="text-muted-foreground">
                {new Date(published).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span className="text-muted-foreground">· {post.readingTime} read</span>
            </div>
            <h1
              data-reveal="up"
              className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl"
            >
              {post.title}
            </h1>
            <p data-reveal="up" data-reveal-delay="80" className="mt-5 font-serif text-lg italic text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
        </header>

        <div className="shell">
          <div className="max-w-3xl space-y-6">
            {post.body.map((block, i) => {
              switch (block.type) {
                case "h2":
                  return (
                    <h2 key={i} data-reveal="fade" className="pt-6 display-3">
                      {block.text}
                    </h2>
                  );
                case "list":
                  return (
                    <ul key={i} data-reveal="fade" className="space-y-3 border-l border-border pl-5">
                      {block.items?.map((item) => (
                        <li key={item} className="text-base leading-relaxed text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                case "quote":
                  return (
                    <blockquote
                      key={i}
                      data-reveal="fade"
                      className="border-l-2 border-primary py-1 pl-6 font-serif text-xl italic leading-relaxed"
                    >
                      {block.text}
                    </blockquote>
                  );
                default:
                  return (
                    <p key={i} data-reveal="fade" className="text-base leading-[1.85] text-foreground/90">
                      {block.text}
                    </p>
                  );
              }
            })}
          </div>

          <footer className="mt-14 max-w-3xl rounded-xl border border-border bg-card/40 p-7">
            <p className="eyebrow mb-2">Written by</p>
            <p className="text-sm font-medium">{post.author}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Questions about this topic? We answer every message —{" "}
              <Link href="/contact" className="link-line text-foreground">
                get in touch
              </Link>{" "}
              or call{" "}
              <a href={`tel:${site.phoneHref}`} className="link-line text-foreground">
                {site.phone}
              </a>
              .
            </p>
          </footer>
        </div>

        {related.length > 0 && (
          <aside className="shell mt-16">
            <h2 data-reveal="fade" className="eyebrow mb-6">
              Keep reading
            </h2>
            <ul className="grid gap-6 md:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug} data-reveal="up">
                  <Link
                    href={`/insights/${r.slug}` as Route}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card/40 p-7 transition-colors hover:border-primary/50"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                      {r.category}
                    </span>
                    <h3 className="mt-4 text-lg font-medium leading-snug">{r.title}</h3>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs text-muted-foreground group-hover:text-foreground">
                      {r.readingTime} read
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {relatedLinks.length > 0 && (
          <aside className="shell mt-12" aria-labelledby="related-links">
            <h2 id="related-links" className="eyebrow mb-4">
              Related services
            </h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-line text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>

      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path: `/insights/${post.slug}`,
            publishedTime: published,
            section: post.category,
            author: post.author,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: post.title, path: `/insights/${post.slug}` },
          ]),
        ]}
      />
      <FinalCta />
    </>
  );
}
