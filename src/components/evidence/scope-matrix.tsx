"use client";

import { useState } from "react";
import { SCOPE_GROUPS, SCOPE_TIERS, type ScopeCell } from "@/content/evidence";
import { PACKAGES, formatINR } from "@/content/packages";

const COLUMNS = SCOPE_TIERS.length + 1;

const LEGEND = [
  { state: "included", label: "Included" },
  { state: "optional", label: "Optional" },
  { state: "scoped", label: "Scoped after diagnosis" },
  { state: "excluded", label: "Not in scope" },
] as const;

const PACKAGE_PRICE = new Map(
  PACKAGES.map((item) => [item.slug, `${formatINR(item.price)}`]),
);

function priceFor(slug: (typeof SCOPE_TIERS)[number]["slug"]) {
  if (slug === "institutional") return "Quoted after diagnosis";
  return PACKAGE_PRICE.get(slug) ?? "On request";
}

function hasChange(values: ScopeCell[]) {
  return new Set(values.map((cell) => cell.label)).size > 1;
}

/**
 * The four-tier scope matrix.
 *
 * Rows are grouped by the part of the system they belong to. The filter hides
 * rows that are identical across all four tiers, which is the difference
 * between a comparison table and a wall of ticks.
 */
export default function ScopeMatrix() {
  const [changesOnly, setChangesOnly] = useState(false);

  const groups = changesOnly
    ? SCOPE_GROUPS.map((group) => ({
        ...group,
        rows: group.rows.filter((row) => hasChange(row.values)),
      })).filter((group) => group.rows.length > 0)
    : SCOPE_GROUPS;

  const totalRows = SCOPE_GROUPS.reduce((sum, group) => sum + group.rows.length, 0);
  const visibleRows = groups.reduce((sum, group) => sum + group.rows.length, 0);

  return (
    <div className="ev-matrix-wrap">
      <div className="ev-matrix-tools">
        <p className="ev-micro">Scope matrix / four tiers</p>
        <label className="ev-switch">
          <input
            type="checkbox"
            checked={changesOnly}
            onChange={(event) => setChangesOnly(event.target.checked)}
          />
          <span className="ev-switch-track" aria-hidden="true">
            <span className="ev-switch-thumb" />
          </span>
          <span className="ev-switch-label">Changes only</span>
        </label>
      </div>

      <p className="ev-matrix-status" aria-live="polite">
        Showing {visibleRows} of {totalRows} capabilities
      </p>

      <div
        className="ev-matrix-scroll"
        role="region"
        aria-label="Scope matrix by package tier"
        tabIndex={0}
      >
        <table className="ev-matrix">
          <caption className="sr-only">
            Scope by tier. Starter, Growth and Pro are packaged prices; Institutional is quoted
            after diagnosis.
          </caption>
          <thead>
            <tr>
              <th scope="col">Capability</th>
              {SCOPE_TIERS.map((tier) => (
                <th key={tier.slug} scope="col">
                  <span className="ev-matrix-tier">{tier.name}</span>
                  <span className="ev-matrix-price">{priceFor(tier.slug)}</span>
                  <span className="ev-matrix-role">
                    {tier.slug === "institutional" ? "Diagnosis first" : tier.support}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {groups.map((group) => (
            <tbody key={group.id}>
              <tr className="ev-matrix-group">
                <th scope="colgroup" colSpan={COLUMNS}>
                  <span>{group.title}</span>
                  <span>{group.description}</span>
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">
                    <span>{row.label}</span>
                    {row.note ? <span className="ev-matrix-note">{row.note}</span> : null}
                  </th>
                  {row.values.map((cell, index) => (
                    <td key={`${row.label}-${SCOPE_TIERS[index].slug}`} data-state={cell.state}>
                      <span className="ev-cell">{cell.label}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <ul className="ev-matrix-legend" aria-label="Matrix key">
        {LEGEND.map((item) => (
          <li key={item.state} data-state={item.state}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
