import type { ReactNode } from "react";

export interface EvidenceMeta {
  label: string;
  value: string;
}

interface EvidenceHeaderProps {
  index: string;
  label: string;
  kicker?: string;
  title: ReactNode;
  lede: string;
  meta: EvidenceMeta[];
  status?: string;
  actions?: ReactNode;
  note?: string[];
}

/**
 * The cover sheet shared by the five L3 evidence routes and the L4 workshop.
 *
 * The right-hand file block is deliberately a record, not a marketing card:
 * reference, status and the fields a reader can check.
 */
export default function EvidenceHeader({
  index,
  label,
  kicker = "Evidence",
  title,
  lede,
  meta,
  status = "Open record",
  actions,
  note,
}: EvidenceHeaderProps) {
  return (
    <header className="ev-head">
      <div className="inst-shell">
        <div className="ev-head-grid">
          <div className="ev-head-copy">
            <p className="inst-label">
              {kicker} / {index} — {label}
            </p>
            <h1 className="inst-display-l ev-head-title">{title}</h1>
            <p className="inst-lede ev-head-lede">{lede}</p>
            {actions ? <div className="ev-head-actions">{actions}</div> : null}
            {note?.length ? (
              <p className="ev-head-note">
                {note.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>
            ) : null}
          </div>

          <aside className="ev-file" aria-label={`${label} record details`}>
            <div className="ev-file-head">
              <span className="ev-file-index" aria-hidden="true">
                {index}
              </span>
              <span className="ev-file-state">
                <span className="ev-file-dot" aria-hidden="true" />
                {status}
              </span>
            </div>
            <dl className="ev-file-list">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="ev-file-foot">
              {label} / {index}
              <span aria-hidden="true">ImaginarsClub</span>
            </p>
          </aside>
        </div>
      </div>
    </header>
  );
}
