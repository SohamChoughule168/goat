import Link from "next/link";

const METRICS = [
  {
    value: "2024",
    label: "Founded in Mumbai",
    note: "Young studio, senior practitioners.",
  },
  {
    value: "18",
    label: "Services across 4 practices",
    note: "From Next.js builds to GEO visibility.",
  },
  {
    value: "<24h",
    label: "Response on every enquiry",
    note: "One business day, guaranteed in writing.",
  },
  {
    value: "100%",
    label: "Ownership at handover",
    note: "Code, accounts, pipelines — yours.",
  },
];

export default function MetricsBand() {
  return (
    <section className="section-y">
      <div className="shell">
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <li key={m.label} data-reveal="up" data-reveal-delay={String(i * 60)}>
              <p className="display-1 font-display">{m.value}</p>
              <p className="mt-3 text-sm font-medium">{m.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.note}</p>
            </li>
          ))}
        </ul>
        <p
          data-reveal="fade"
          className="mt-14 max-w-xl text-xs leading-relaxed text-muted-foreground"
        >
          A note on numbers: most agency sites display counters like “200+ projects”.
          Ours only shows operational facts we can demonstrate. Client outcomes live in{" "}
          <Link href="/work" className="link-line text-foreground">
            case studies with sources
          </Link>
          , not vanity counters.
        </p>
      </div>
    </section>
  );
}
