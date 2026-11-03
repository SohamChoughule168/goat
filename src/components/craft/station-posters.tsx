import type { ReactNode } from "react";

function PosterFrame({
  fig,
  tag = "Poster",
  children,
}: {
  fig: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className="craft-poster-svg"
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <text x="24" y="24" className="cp-mono">
        FIG. {fig}
      </text>
      <text x="376" y="24" textAnchor="end" className="cp-mono">
        {tag}
      </text>
      <line x1="24" y1="34" x2="376" y2="34" className="cp-rule" />
      {children}
    </svg>
  );
}

export function PosterRoute() {
  const gates = [
    { x: 70, label: "ROUTE", note: "HTML" },
    { x: 156, label: "RENDER", note: "CHUNK" },
    { x: 242, label: "BUDGET", note: "LCP / CLS" },
    { x: 328, label: "VERIFY", note: "AXE / KEYS" },
  ];

  return (
    <PosterFrame fig="01">
      <text x="40" y="58" className="cp-mono">
        PAGE TOKEN → SHIP
      </text>
      <line x1="40" y1="132" x2="360" y2="132" className="cp-dash" />
      <line x1="40" y1="132" x2="328" y2="132" className="cp-accent-stroke" strokeWidth="2" />
      {gates.map((gate) => (
        <g key={gate.label}>
          <circle cx={gate.x} cy="132" r="16" className="cp-node" />
          <path
            d={`M ${gate.x - 7} 132 L ${gate.x - 2} 138 L ${gate.x + 8} 123`}
            className="cp-check"
          />
          <text x={gate.x} y="98" textAnchor="middle" className="cp-text">
            {gate.label}
          </text>
          <text x={gate.x} y="170" textAnchor="middle" className="cp-mono">
            {gate.note}
          </text>
        </g>
      ))}
      <text x="40" y="210" className="cp-mono">
        FOUR GATES / NO SKIPPED CHECKS
      </text>
      <text x="376" y="210" textAnchor="end" className="cp-mono cp-accent">
        4 / 4
      </text>
    </PosterFrame>
  );
}

export function PosterBuildOrder() {
  const layers = [
    { label: "INTENT", y: 200 },
    { label: "GRAPH", y: 172 },
    { label: "CAMERA", y: 144 },
    { label: "MATERIAL", y: 116 },
    { label: "PERFORMANCE", y: 88 },
    { label: "FALLBACK", y: 60 },
  ];

  return (
    <PosterFrame fig="02">
      <text x="40" y="58" className="cp-mono">
        RESOLVE ORDER / 06
      </text>
      <line x1="108" y1="48" x2="108" y2="216" className="cp-dash" />
      {layers.map((layer, index) => (
        <g key={layer.label}>
          <polygon
            points={`120,${layer.y} 200,${layer.y - 16} 300,${layer.y} 220,${layer.y + 16}`}
            className={index === 2 ? "cp-plate cp-plate-accent" : "cp-plate"}
          />
          <text x="312" y={layer.y + 3} className="cp-mono">
            {layer.label}
          </text>
        </g>
      ))}
      <text x="40" y="224" className="cp-mono">
        FLOOR UP / FALLBACK IS NOT LAST
      </text>
    </PosterFrame>
  );
}

export function PosterExploded() {
  const plates = [
    { y: 176, label: "SURFACE", index: "01" },
    { y: 146, label: "STRUCTURE", index: "02" },
    { y: 110, label: "SYSTEM", index: "03" },
    { y: 74, label: "EVIDENCE", index: "04" },
  ];

  return (
    <PosterFrame fig="03" tag="Dark study">
      <text x="40" y="58" className="cp-mono">
        0 ASSEMBLED / 100 EXPLODED
      </text>
      <line x1="300" y1="56" x2="300" y2="204" className="cp-dash" />
      {plates.map((plate, index) => (
        <g key={plate.label}>
          <rect
            x="120"
            y={plate.y}
            width="160"
            height="18"
            className={index === 1 ? "cp-plate cp-plate-accent" : "cp-plate"}
          />
          <text x="128" y={plate.y + 12} className="cp-mono">
            {plate.index}
          </text>
          <line x1="280" y1={plate.y + 9} x2="312" y2={plate.y + 9} className="cp-rule" />
          <text x="318" y={plate.y + 12} className="cp-mono">
            {plate.label}
          </text>
        </g>
      ))}
      <line x1="100" y1="74" x2="100" y2="194" className="cp-rule" />
      <line x1="96" y1="74" x2="104" y2="74" className="cp-rule" />
      <line x1="96" y1="194" x2="104" y2="194" className="cp-rule" />
      <text
        x="84"
        y="134"
        textAnchor="middle"
        transform="rotate(-90 84 134)"
        className="cp-mono"
      >
        TRAVEL
      </text>
      <text x="40" y="224" className="cp-mono">
        LABELS TRAVEL WITH THEIR PLATES
      </text>
    </PosterFrame>
  );
}

export function PosterFilm() {
  const panelWidth = 352 / 6;
  const panels = Array.from({ length: 6 }, (_, index) => 24 + index * panelWidth);

  return (
    <PosterFrame fig="04" tag="Six materials, one take">
      <rect x="24" y="38" width="352" height="198" className="cp-plate" />
      {panels.map((x, index) => (
        <rect
          key={x}
          x={x + 1}
          y="39"
          width={panelWidth - 2}
          height="167"
          className={index % 2 === 0 ? "cp-plate cp-plate-mid" : "cp-plate cp-plate-dark"}
        />
      ))}
      <line x1="24" y1="38" x2="376" y2="38" className="cp-rule" />
      <line
        x1={24 + 352 * 0.42}
        y1="38"
        x2={24 + 352 * 0.42}
        y2="206"
        className="cp-accent-stroke"
        strokeWidth="2"
      />
      <rect x="24" y="206" width="352" height="30" className="cp-plate" />
      <line x1="24" y1="206" x2="376" y2="206" className="cp-rule" />
      <text x="32" y="225" className="cp-mono">
        00:00 / 08:00
      </text>
      <text x="368" y="225" textAnchor="end" className="cp-mono">
        FILM / CONTACT SHEET
      </text>
    </PosterFrame>
  );
}

export function PosterScrub() {
  const marks = [
    { y: 70, label: "CONTENT", note: "static export" },
    { y: 110, label: "ROUTE", note: "one canonical" },
    { y: 150, label: "BUDGET", note: "LCP + CLS" },
    { y: 190, label: "VERIFY", note: "axe + keys" },
  ];

  return (
    <PosterFrame fig="05">
      <text x="376" y="58" textAnchor="end" className="cp-mono cp-accent">
        100%
      </text>
      <line x1="110" y1="60" x2="110" y2="200" className="cp-rule" />
      <line x1="110" y1="60" x2="110" y2="200" className="cp-accent-stroke" strokeWidth="4" />
      {marks.map((mark, index) => (
        <g key={mark.label}>
          <circle cx="110" cy={mark.y} r="5" className="cp-node" />
          <text x="92" y={mark.y + 3} textAnchor="end" className="cp-mono">
            0{index + 1}
          </text>
          <text x="130" y={mark.y - 1} className="cp-text">
            {mark.label}
          </text>
          <text x="130" y={mark.y + 10} className="cp-mono">
            {mark.note}
          </text>
        </g>
      ))}
      <text x="376" y="216" textAnchor="end" className="cp-mono">
        NO PAGE PIN
      </text>
    </PosterFrame>
  );
}

export function PosterStateBridge() {
  return (
    <PosterFrame fig="06">
      <text x="40" y="58" className="cp-mono">
        DOM → CANVAS
      </text>
      <polygon points="140,94 196,120 140,146 84,120" className="cp-plate" />
      <polygon points="140,120 196,146 140,172 84,146" className="cp-plate cp-plate-accent" />
      <polygon points="140,146 196,172 140,198 84,172" className="cp-plate cp-plate-mid" />
      <line x1="236" y1="70" x2="236" y2="200" className="cp-dash" />
      <text x="144" y="86" textAnchor="middle" className="cp-mono">
        YAW
      </text>
      {[
        { y: 92, knob: 300, label: "YAW" },
        { y: 130, knob: 332, label: "LIFT" },
        { y: 168, knob: 286, label: "SPREAD" },
      ].map((control) => (
        <g key={control.label}>
          <line x1="256" y1={control.y} x2="360" y2={control.y} className="cp-rule" />
          <circle cx={control.knob} cy={control.y} r="5" className="cp-node cp-accent-fill" />
          <text x="256" y={control.y - 9} className="cp-mono">
            {control.label}
          </text>
        </g>
      ))}
      <text x="40" y="224" className="cp-mono">
        SAME STATE / TWO SURFACES
      </text>
      <text x="376" y="224" textAnchor="end" className="cp-mono cp-accent">
        SYNC
      </text>
    </PosterFrame>
  );
}

export function PosterTilt() {
  return (
    <PosterFrame fig="07">
      <text x="40" y="58" className="cp-mono">
        FINE POINTER ONLY
      </text>
      <g transform="rotate(-9 200 128)">
        <rect x="136" y="78" width="150" height="96" className="cp-plate cp-plate-dark" />
        <rect x="128" y="70" width="150" height="96" className="cp-plate cp-plate-accent" />
        <rect x="120" y="62" width="150" height="96" className="cp-plate" />
        <line x1="136" y1="84" x2="222" y2="84" className="cp-line" />
        <line x1="136" y1="98" x2="248" y2="98" className="cp-rule" />
        <line x1="136" y1="110" x2="236" y2="110" className="cp-rule" />
        <text x="136" y="142" className="cp-mono">
          DEPTH 01
        </text>
      </g>
      <line x1="300" y1="190" x2="352" y2="190" className="cp-line" />
      <path d="M 352 190 L 345 186 M 352 190 L 345 194" className="cp-line" />
      <line x1="300" y1="190" x2="300" y2="150" className="cp-line" />
      <path d="M 300 150 L 296 157 M 300 150 L 304 157" className="cp-line" />
      <text x="326" y="210" textAnchor="middle" className="cp-mono">
        X / Y
      </text>
      <text x="40" y="224" className="cp-mono">
        NO VANTA / NO LOOP
      </text>
    </PosterFrame>
  );
}

export function PosterDial() {
  const ticks = Array.from({ length: 12 }, (_, index) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x1: 190 + Math.cos(angle) * 48,
      y1: 130 + Math.sin(angle) * 48,
      x2: 190 + Math.cos(angle) * 58,
      y2: 130 + Math.sin(angle) * 58,
    };
  });

  return (
    <PosterFrame fig="08">
      <text x="376" y="58" textAnchor="end" className="cp-mono">
        LOOP OFF
      </text>
      <circle cx="190" cy="130" r="62" className="cp-line" />
      <circle cx="190" cy="130" r="54" className="cp-dash" />
      {ticks.map((tick, index) => (
        <line key={index} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} className="cp-line" />
      ))}
      <path d="M 159 76 A 62 62 0 0 1 237.5 169.9" className="cp-accent-stroke" strokeWidth="3" />
      <line x1="190" y1="130" x2="227.7" y2="156.4" className="cp-line" strokeWidth="3" />
      <circle cx="190" cy="130" r="6" className="cp-accent-fill" />
      <text x="40" y="216" className="cp-mono">
        FRAME 090 / 090
      </text>
      <text x="376" y="216" textAnchor="end" className="cp-mono">
        POSTER ON
      </text>
    </PosterFrame>
  );
}

export function PosterRive() {
  const states = [
    { x: 70, label: "IDLE" },
    { x: 160, label: "HOVER" },
    { x: 250, label: "PRESS" },
    { x: 340, label: "SUCCESS" },
  ];

  return (
    <PosterFrame fig="09" tag="Pending">
      <text x="40" y="58" className="cp-mono">
        INPUTS → STATE MACHINE
      </text>
      <rect x="36" y="72" width="328" height="116" className="cp-pending-box" />
      {states.map((state) => (
        <g key={state.label}>
          <circle cx={state.x} cy="128" r="18" className="cp-node" />
          <text x={state.x} y="98" textAnchor="middle" className="cp-text">
            {state.label}
          </text>
        </g>
      ))}
      {[
        { x: 90, label: "pointerenter" },
        { x: 180, label: "pointerdown" },
        { x: 270, label: "release" },
      ].map((input) => (
        <g key={input.label}>
          <line x1={input.x} y1="128" x2={input.x + 44} y2="128" className="cp-line" />
          <path
            d={`M ${input.x + 44} 128 L ${input.x + 38} 125 M ${input.x + 44} 128 L ${input.x + 38} 131`}
            className="cp-line"
          />
          <text x={input.x + 24} y="160" textAnchor="middle" className="cp-mono">
            {input.label}
          </text>
        </g>
      ))}
      <text x="200" y="212" textAnchor="middle" className="cp-mono cp-warning">
        AWAITING .RIV
      </text>
    </PosterFrame>
  );
}

export function PosterSpline() {
  return (
    <PosterFrame fig="10" tag="Pending">
      <text x="40" y="58" className="cp-mono">
        INTENDED FRAME / NOT AUTHORED
      </text>
      <polygon points="80,72 320,58 300,190 96,198" className="cp-line" />
      <polygon points="120,88 284,80 270,166 130,172" className="cp-line" />
      <line x1="80" y1="72" x2="120" y2="88" className="cp-rule" />
      <line x1="320" y1="58" x2="284" y2="80" className="cp-rule" />
      <line x1="300" y1="190" x2="270" y2="166" className="cp-rule" />
      <line x1="96" y1="198" x2="130" y2="172" className="cp-rule" />
      <line x1="160" y1="85" x2="146" y2="178" className="cp-dash" />
      <line x1="200" y1="82" x2="198" y2="176" className="cp-dash" />
      <line x1="240" y1="79" x2="234" y2="170" className="cp-dash" />
      <rect x="50" y="38" width="22" height="16" className="cp-plate" />
      <circle cx="61" cy="46" r="3" className="cp-accent-fill" />
      <line x1="72" y1="46" x2="120" y2="88" className="cp-dash" />
      <line x1="72" y1="46" x2="320" y2="58" className="cp-dash" />
      <text x="61" y="70" textAnchor="middle" className="cp-mono">
        CAMERA
      </text>
      <circle cx="340" cy="50" r="10" className="cp-line" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={340 + Math.cos(radians) * 13}
            y1={50 + Math.sin(radians) * 13}
            x2={340 + Math.cos(radians) * 18}
            y2={50 + Math.sin(radians) * 18}
            className="cp-rule"
          />
        );
      })}
      <text x="340" y="82" textAnchor="middle" className="cp-mono">
        KEY
      </text>
      <text x="200" y="222" textAnchor="middle" className="cp-mono cp-warning">
        SELF-HOSTED .SPLINECODE PENDING
      </text>
    </PosterFrame>
  );
}

export function PosterLedger() {
  const rows = [
    { y: 72, width: 120, note: "poster" },
    { y: 98, width: 96, note: "on demand" },
    { y: 124, width: 108, note: "measured" },
    { y: 150, width: 72, note: "measured" },
    { y: 176, width: 138, note: "verified" },
  ];

  return (
    <PosterFrame fig="11">
      <text x="376" y="58" textAnchor="end" className="cp-mono">
        ENTER ONCE
      </text>
      {rows.map((row, index) => (
        <g key={row.y}>
          <text x="40" y={row.y + 6} className="cp-mono">
            0{index + 1}
          </text>
          <rect x="64" y={row.y} width="92" height="6" className="cp-swatch-mid" />
          <rect
            x="188"
            y={row.y - 1}
            width={row.width}
            height="8"
            className={index === 0 ? "cp-accent-fill" : "cp-swatch-mid"}
          />
          <text x="376" y={row.y + 6} textAnchor="end" className="cp-mono">
            {row.note}
          </text>
        </g>
      ))}
      <line x1="54" y1="66" x2="54" y2="188" className="cp-dash" />
      <text x="40" y="216" className="cp-mono">
        NO BLUR / NO SPRING / NO LAYOUT
      </text>
      <text x="376" y="216" textAnchor="end" className="cp-mono cp-accent">
        180 MS
      </text>
    </PosterFrame>
  );
}
