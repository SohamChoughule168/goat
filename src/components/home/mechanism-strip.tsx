const STEPS = [
  {
    n: "01",
    term: "Discovery",
    detail:
      "One structured session plus a written audit. Audiences, success metrics and constraints agreed before anything is designed.",
  },
  {
    n: "02",
    term: "Strategy",
    detail:
      "A scoped plan with fixed milestones: sitemap, content model, technical approach — and a price that matches it.",
  },
  {
    n: "03",
    term: "Execution",
    detail:
      "Reviewable increments on staging. You watch the product exist instead of waiting for a big reveal.",
  },
  {
    n: "04",
    term: "Ownership",
    detail:
      "Launch measured against discovery metrics, then full handover of code, accounts and pipelines. Leaving us is effortless.",
  },
];

export default function MechanismStrip() {
  return (
    <section className="section-y border-t border-border" aria-label="How engagement works">
      <div className="shell">
        <p className="micro">Mechanism</p>
        <h2 className="display-2 mt-4 max-w-xl">How an engagement actually runs.</h2>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-background p-6">
              <p className="micro">{s.n}</p>
              <h3 className="mt-4 text-base font-medium text-[color:var(--text-1)]">{s.term}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
