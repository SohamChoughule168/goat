import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description: "Transparent engagement tiers and what each includes.",
  path: "/pricing",
});

const TIERS = [
  {
    name: "Sprint",
    subtitle: "One focused deliverable",
    price: "TODO(positioning: sprint band)",
    features: ["Fixed scope, fixed timeline", "One practice area", "Weekly staging reviews", "Full handover at completion"],
    excludes: ["Ongoing support", "Multiple practice areas"],
  },
  {
    name: "Engagement",
    subtitle: "Build and grow together",
    price: "TODO(positioning: engagement band)",
    featured: true,
    features: ["90-day cycles", "Up to two practice areas", "Monthly reporting", "Priority response", "Quarterly strategy review"],
    excludes: ["Dedicated team capacity guarantee"],
  },
  {
    name: "Partner",
    subtitle: "Embedded studio relationship",
    price: "TODO(positioning: partner band)",
    features: ["Everything in Engagement", "All four practices on call", "Named senior contact", "Same-day urgent response"],
    excludes: [] as string[],
  },
];

export default function PricingPage() {
  return (
    <main className="shell section-y">
      <p className="micro">Pricing</p>
      <h1 className="display mt-4 max-w-3xl">Clear scope, honest bands.</h1>
      <p className="lede mt-6 max-w-[55ch]">
        Every engagement is scoped before it starts — these tiers frame the
        conversation, they don&rsquo;t replace a written quote.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`rounded-md border p-6 ${t.featured ? "border-[color:var(--color-accent)] shadow-sm" : "border-[color:var(--color-border)]"}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-semibold">{t.name}</h2>
              {t.featured && (
                <span className="micro rounded-[var(--radius-xs)] bg-accent-subtle px-2 py-0.5">
                  Most common
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
            <p className="micro mt-6 opacity-60">{t.price}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
            {t.excludes.length > 0 && (
              <ul className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                {t.excludes.map((e) => (
                  <li key={e}>Excludes: {e}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-md border p-6">
        <h2 className="text-h4 font-semibold">Get an estimate</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Answer four questions about your project and receive an indicative price band.
        </p>
        <Link href="/estimate" className="btn btn-primary mt-4">
          Open the estimator
        </Link>
      </div>
    </main>
  );
}
