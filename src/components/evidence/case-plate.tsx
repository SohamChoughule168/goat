/**
 * A static delivery section for the one verified engagement.
 *
 * It is a drawing, not a dashboard: three strata (design system, application,
 * delivery) with the two seams that had to hold for the build to ship. All the
 * labels are real text inside the SVG so the plate stays legible when printed
 * or zoomed; the same facts are repeated in the case record beside it.
 */

const BANDS = [
  {
    index: "01",
    title: "Design system",
    meta: "Type, colour and components",
    check: ["Accessibility", "WCAG 2.2 AA"],
    y: 74,
  },
  {
    index: "02",
    title: "Application",
    meta: "Pages, routes and content model",
    check: ["Performance", "Budgets enforced"],
    y: 148,
  },
  {
    index: "03",
    title: "Delivery",
    meta: "Build, DNS and monitoring",
    check: ["Ownership", "Accounts in client name"],
    y: 222,
  },
] as const;

const SEAMS = [
  { y: 137, label: "Seam / page jobs" },
  { y: 211, label: "Seam / handover" },
] as const;

const X = 92;
const W = 286;
const H = 52;
const DX = 26;
const DY = 13;

function topFace(y: number) {
  return `M ${X} ${y} L ${X + W} ${y} L ${X + W + DX} ${y - DY} L ${X + DX} ${y - DY} Z`;
}

function rightFace(y: number) {
  return `M ${X + W} ${y} L ${X + W + DX} ${y - DY} L ${X + W + DX} ${y - DY + H} L ${X + W} ${y + H} Z`;
}

export default function CasePlate() {
  return (
    <svg
      className="ev-plate"
      viewBox="0 0 560 420"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="case-plate-title case-plate-desc"
      focusable="false"
    >
      <title id="case-plate-title">Delivery section for PRV Financial Services</title>
      <desc id="case-plate-desc">
        A technical section drawing with three strata — design system, application and delivery —
        joined by two seams labelled page jobs and handover. A title block records the live site,
        client ownership, the sector and an April 2025 delivery date.
      </desc>

      <g className="ev-plate-frame" aria-hidden="true">
        <path d="M 12 24 L 12 12 L 24 12" />
        <path d="M 536 12 L 548 12 L 548 24" />
        <path d="M 12 396 L 12 408 L 24 408" />
        <path d="M 536 408 L 548 408 L 548 396" />
        <path d="M 20 48 L 540 48" />
      </g>

      <text className="ev-plate-mono ev-plate-mono--ink" x="20" y="38">
        Plate 01 / Delivery section
      </text>
      <text className="ev-plate-mono" x="540" y="38" textAnchor="end">
        PRV · 2025 · Verified
      </text>

      <g aria-hidden="true">
        <path className="ev-plate-datum" d="M 76 62 L 76 282" />
        {BANDS.map((band) => (
          <path
            key={`tick-${band.index}`}
            className="ev-plate-datum"
            d={`M 72 ${band.y + H / 2} L 80 ${band.y + H / 2}`}
          />
        ))}
      </g>

      {BANDS.map((band) => (
        <g key={band.index}>
          <text className="ev-plate-index" x="20" y={band.y + 19} aria-hidden="true">
            {band.index}
          </text>
          <text className="ev-plate-gutter" x="20" y={band.y + 36}>
            {band.title.split(" ")[0]}
          </text>
          {band.title.split(" ")[1] ? (
            <text className="ev-plate-gutter" x="20" y={band.y + 47}>
              {band.title.split(" ")[1]}
            </text>
          ) : null}

          <path className="ev-plate-face-top" d={topFace(band.y)} />
          <path className="ev-plate-face-side" d={rightFace(band.y)} />
          <rect
            className="ev-plate-face-front"
            x={X}
            y={band.y}
            width={W}
            height={H}
          />
          <rect className="ev-plate-spine" x={X} y={band.y} width="4" height={H} />

          <text className="ev-plate-band-title" x={X + 16} y={band.y + 25}>
            {band.title}
          </text>
          <text className="ev-plate-band-meta" x={X + 16} y={band.y + 40}>
            {band.meta}
          </text>

          <path
            className="ev-plate-leader"
            d={`M ${X + W + 30} ${band.y + 26} L ${X + W + 48} ${band.y + 26}`}
          />
          <circle
            className="ev-plate-node"
            cx={X + W + 30}
            cy={band.y + 26}
            r="2.5"
          />
          <text className="ev-plate-note" x={X + W + 54} y={band.y + 23}>
            {band.check[0]}
          </text>
          <text className="ev-plate-note ev-plate-note--muted" x={X + W + 54} y={band.y + 35}>
            {band.check[1]}
          </text>
        </g>
      ))}

      {SEAMS.map((seam) => (
        <g key={seam.label} aria-hidden="true">
          <text className="ev-plate-seam" x={X} y={seam.y - 5}>
            {seam.label}
          </text>
          <path className="ev-plate-seam-line" d={`M ${X} ${seam.y} L ${X + W} ${seam.y}`} />
          <path
            className="ev-plate-seam-node"
            d={`M ${X} ${seam.y - 3} L ${X + 3} ${seam.y} L ${X} ${seam.y + 3} L ${X - 3} ${seam.y} Z`}
          />
          <path
            className="ev-plate-seam-node"
            d={`M ${X + W} ${seam.y - 3} L ${X + W + 3} ${seam.y} L ${X + W} ${seam.y + 3} L ${X + W - 3} ${seam.y} Z`}
          />
        </g>
      ))}

      <g className="ev-plate-block">
        <rect x="12" y="310" width="536" height="86" />
        <path d="M 12 353 L 548 353" />
        <path d="M 296 310 L 296 396" />
        <path d="M 420 310 L 420 396" />

        <text className="ev-plate-block-label" x="24" y="326">
          Source
        </text>
        <text className="ev-plate-block-value" x="24" y="342">
          Live site + delivery record
        </text>
        <text className="ev-plate-block-label" x="308" y="326">
          Status
        </text>
        <text className="ev-plate-block-value" x="308" y="342">
          Live &amp; owned
        </text>
        <text className="ev-plate-block-label" x="432" y="326">
          Sheet
        </text>
        <text className="ev-plate-block-value" x="432" y="342">
          01 / 01
        </text>

        <text className="ev-plate-block-label" x="24" y="369">
          Client
        </text>
        <text className="ev-plate-block-value" x="24" y="385">
          PRV Financial Services
        </text>
        <text className="ev-plate-block-label" x="308" y="369">
          Sector
        </text>
        <text className="ev-plate-block-value" x="308" y="385">
          Financial services
        </text>
        <text className="ev-plate-block-label" x="432" y="369">
          Date
        </text>
        <text className="ev-plate-block-value" x="432" y="385">
          April 2025
        </text>
      </g>
    </svg>
  );
}
