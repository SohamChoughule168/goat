const STATS = [
  { value: "2024", label: "Founded in Mumbai" },
  { value: "18", label: "Services · 4 practices" },
  { value: "<24h", label: "First reply, always" },
];

export default function ProofStrip() {
  return (
    <section className="field" data-field="ink" aria-label="Studio facts">
      <div className="container grid grid-cols-1 gap-y-10 sm:grid-cols-3">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={
              "py-2 sm:px-10 first:sm:pl-0 last:sm:pr-0 " +
              (i > 0 ? "sm:border-l-[3px] sm:border-current sm:pl-10" : "")
            }
          >
            <p className="display">{s.value}</p>
            <p className="micro mt-3 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
