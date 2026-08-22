const FACTS = [
  "Founded 2024 · Mumbai",
  "4 practices · 18 services",
  "Replies within one business day",
  "Senior-led delivery",
  "This site scores 95+ on Lighthouse",
  "Zero fabricated numbers",
];

export default function ProofStrip() {
  const row = [...FACTS, ...FACTS];
  return (
    <section
      aria-label="Studio facts"
      className="overflow-hidden border-y border-border bg-card/40 py-5"
      data-marquee-hover="pause"
    >
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: "42s" }}>
        {row.map((fact, i) => (
          <span
            key={`${fact}-${i}`}
            aria-hidden={i >= FACTS.length}
            className="flex items-center gap-14 whitespace-nowrap font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground"
          >
            {fact}
            <span className="text-primary" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
