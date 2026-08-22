const STATS = [
  { value: "2024", label: "Founded in Mumbai" },
  { value: "18", label: "Services across 4 practices" },
  { value: "<24h", label: "First reply on every enquiry", accent: true },
];

export default function ProofStrip() {
  return (
    <section aria-label="Studio facts" className="border-y border-border">
      <div className="shell grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((s) => (
          <div key={s.label} className="py-10 sm:px-10 first:sm:pl-0 last:sm:pr-0">
            <p
              className="display-3"
              style={s.accent ? { color: "var(--accent-brand)" } : undefined}
            >
              {s.value}
            </p>
            <p className="micro mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
