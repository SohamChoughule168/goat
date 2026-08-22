const STEPS = [
  {
    n: "01",
    title: "Discovery",
    weeks: "Week 1",
    detail:
      "One structured session plus a written audit of what exists. You leave with shared vocabulary: audiences, success metrics, constraints.",
  },
  {
    n: "02",
    title: "Strategy",
    weeks: "Weeks 1–2",
    detail:
      "A scoped plan with fixed milestones — sitemap, content model, technical approach and a quote that matches reality, not hope.",
  },
  {
    n: "03",
    title: "Execution",
    weeks: "Weeks 2–6",
    detail:
      "Working software in reviewable increments on staging. You watch the product exist instead of waiting for a big reveal.",
  },
  {
    n: "04",
    title: "Optimization",
    weeks: "Post-launch",
    detail:
      "Launch is the starting line. We measure against the metrics from discovery, fix what data exposes, then hand over full ownership.",
  },
];

export default function Process() {
  return (
    <section className="section-y border-t border-border">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p data-reveal="fade" className="eyebrow mb-4 flex items-center gap-3"><span className="text-primary">◆</span> Chapter IV — How we work</p>
          <h2 data-reveal="up" className="display-2">
            A process you can
            <span className="font-serif font-normal italic text-primary"> schedule </span>
            around.
          </h2>
          <p data-reveal="up" className="lede mt-5 text-sm">
            Four phases with honest timeframes. No black boxes, no surprise invoices,
            no disappearing act after launch.
          </p>
        </div>
        <ol className="relative">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              data-reveal="up"
              data-reveal-delay={String(i * 60)}
              className="group relative border-t border-border py-8 first:border-t-0 first:pt-0 md:py-10"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="font-mono text-sm tracking-[0.3em] text-primary">{s.n}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="display-3">{s.title}</h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {s.weeks}
                    </span>
                  </div>
                  <p className="lede mt-3 text-sm">{s.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

