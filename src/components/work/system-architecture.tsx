/**
 * Abstract system architecture diagram for case study presentation.
 * Renders as a layered technical drawing — not a screenshot, not stock art.
 * Each node represents a real layer of the delivered system.
 */
export default function SystemArchitecture({
  layers,
  className = "",
}: {
  layers: { label: string; sub?: string }[];
  className?: string;
}) {
  const W = 600;
  const rowH = 52;
  const pad = 40;
  const H = pad * 2 + layers.length * rowH + (layers.length - 1) * 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true" fill="none">
      {/* Connection lines between layers */}
      {layers.slice(0, -1).map((_, i) => (
        <line
          key={"l" + i}
          x1={W / 2}
          y1={pad + i * (rowH + 12) + rowH}
          x2={W / 2}
          y2={pad + (i + 1) * (rowH + 12)}
          stroke="var(--color-border-interactive, currentColor)"
          strokeWidth="1"
          opacity="0.3"
        />
      ))}

      {/* Layer boxes */}
      {layers.map((layer, i) => {
        const y = pad + i * (rowH + 12);
        const boxW = Math.min(W - pad * 2, 320 + layer.label.length * 4);
        const x = (W - boxW) / 2;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={boxW}
              height={rowH}
              rx={6}
              stroke="var(--color-border-interactive, currentColor)"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <text
              x={x + 16}
              y={y + rowH / 2 - 2}
              dominantBaseline="middle"
              fontSize={13}
              fontWeight={500}
              fill="currentColor"
              fontFamily="inherit"
            >
              {layer.label}
            </text>
            {layer.sub && (
              <text
                x={x + 16}
                y={y + rowH / 2 + 14}
                dominantBaseline="middle"
                fontSize={10}
                fill="currentColor"
                fontFamily="var(--font-mono, monospace)"
                letterSpacing="0.06em"
                opacity="0.45"
              >
                {layer.sub}
              </text>
            )}
            <circle cx={x + boxW - 20} cy={y + rowH / 2} r={3} fill="var(--color-accent, currentColor)" opacity="0.6" />
          </g>
        );
      })}
    </svg>
  );
}
