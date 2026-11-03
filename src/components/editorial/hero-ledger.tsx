type LedgerRow = {
  label: string;
  value: string;
};

type HeroLedgerProps = {
  eyebrow: string;
  value: string;
  title: string;
  rows: LedgerRow[];
  footer: string;
  slip?: string;
  className?: string;
};

/**
 * A paper dossier used as the hero visual on interior pages.
 * Every figure is a real studio fact — no decorative statistics.
 */
export default function HeroLedger({
  eyebrow,
  value,
  title,
  rows,
  footer,
  slip,
  className,
}: HeroLedgerProps) {
  return (
    <aside
      className={`hero-ledger${className ? ` ${className}` : ""}`}
      aria-label={`${eyebrow}: ${value} ${title}`}
      data-reveal="up"
      data-reveal-delay="120"
    >
      <span className="hero-ledger-ghost" aria-hidden="true">
        {value}
      </span>

      <div className="hero-ledger-card">
        <div className="hero-ledger-top">
          <p className="micro">{eyebrow}</p>
          <svg viewBox="0 0 24 24" className="hero-ledger-mark" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5" />
          </svg>
        </div>

        <p className="hero-ledger-value">{value}</p>
        <p className="hero-ledger-title">{title}</p>

        <dl className="hero-ledger-rows">
          {rows.map((row, index) => (
            <div key={row.label}>
              <dt>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {row.label}
              </dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="hero-ledger-footer">
          <span className="hero-ledger-pulse" aria-hidden="true" />
          {footer}
        </p>
      </div>

      {slip ? (
        <span className="hero-ledger-slip" aria-hidden="true">
          {slip}
        </span>
      ) : null}
    </aside>
  );
}
