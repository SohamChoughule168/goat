const STEPS = [
  {
    n: "01",
    term: "Discovery",
    detail:
      "One structured session, one written audit. Audiences, metrics and constraints agreed before anything is designed.",
  },
  {
    n: "02",
    term: "Strategy",
    detail:
      "Scoped plan, fixed milestones: sitemap, content model, technical approach — and a price that matches it.",
  },
  {
    n: "03",
    term: "Execution",
    detail:
      "Reviewable increments on staging. You watch the product exist instead of waiting for a reveal.",
  },
  {
    n: "04",
    term: "Ownership",
    detail:
      "Measured against discovery metrics at launch, then full handover of code, accounts and pipelines.",
  },
];

export default function MechanismStrip() {
  return (
    <section className="field" data-field="paper" aria-label="How engagement works">
      <div className="container">
        <p className="micro">Mechanism</p>
        <h2 className="display mt-4 max-w-[18ch]">How an engagement runs.</h2>

        <ol className="mt-14 border-t-[4px] border-current">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="grid gap-3 border-b-[2px] border-current/25 py-8 sm:grid-cols-[80px_1fr] sm:gap-10"
            >
              <span className="index pt-1">{s.n}</span>
              <div>
                <h3 className="display" style={{ fontSize: "var(--text-h2)" }}>
                  {s.term}
                </h3>
                <p className="muted mt-3 max-w-[58ch]">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
