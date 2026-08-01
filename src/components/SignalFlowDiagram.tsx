import { memo, useState } from "react";

const SIGNAL = "var(--color-accent)";

type SignalFlowDiagramProps = {
  variant?: "compact" | "detailed";
};

const CompactDiagram = () => (
  <svg
    className="w-full h-full routing-svg"
    viewBox="0 0 220 60"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="Live routing diagram: input splits to two processors, joins a bus, then reaches the master output"
    data-signal-flow="compact"
  >
    <circle cx="20" cy="30" r="6" className="fill-accent/15 stroke-accent" strokeWidth="1.2" data-signal-node-id="input" />
    <circle cx="20" cy="30" r="1.5" className="fill-accent" data-signal-indicator-for="input" />
    <rect x="60" y="14" width="32" height="14" rx="3" className="fill-accent/10 stroke-accent/40" strokeWidth="1" />
    <rect x="60" y="32" width="32" height="14" rx="3" className="fill-accent/10 stroke-accent/40" strokeWidth="1" />
    <rect x="130" y="22" width="40" height="16" rx="3" className="fill-accent/20 stroke-accent" strokeWidth="1.2" />
    <circle cx="195" cy="30" r="5" className="fill-accent/15 stroke-accent" strokeWidth="1.2" />
    <line x1="26" y1="30" x2="60" y2="21" className="stroke-accent/40" strokeWidth="1" />
    <line x1="26" y1="30" x2="60" y2="39" className="stroke-accent/40" strokeWidth="1" />
    <line x1="92" y1="21" x2="130" y2="30" className="stroke-accent/40" strokeWidth="1" />
    <line x1="92" y1="39" x2="130" y2="30" className="stroke-accent/40" strokeWidth="1" />
    <line x1="170" y1="30" x2="190" y2="30" className="stroke-accent" strokeWidth="1.2" />
  </svg>
);

const DetailedDiagram = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const sources = [
    { id: 0, cx: 40, cy: 50, label: "KICK", path: "M 58 50 C 100 50 110 90 145 90" },
    { id: 1, cx: 40, cy: 90, label: "808", path: "M 58 90 L 145 90" },
    { id: 2, cx: 40, cy: 130, label: "SYNTH", path: "M 58 130 C 100 130 110 90 145 90" },
  ];

  return (
    <div className="w-full max-w-md aspect-[16/9]">
      <svg
        viewBox="0 0 320 180"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Three sources route through an effects bus to the master output"
        data-signal-flow="detailed"
      >
        {sources.map((source) => (
          <path
            key={source.id}
            d={source.path}
            stroke={SIGNAL}
            strokeWidth={hovered === source.id ? 2.5 : 1.5}
            strokeOpacity={hovered === null ? 0.3 : hovered === source.id ? 1 : 0.1}
            fill="none"
            className="transition-all duration-150"
          />
        ))}
        <path d="M 195 90 L 240 90" stroke={SIGNAL} strokeOpacity="0.45" strokeWidth="2" fill="none" />

        {sources.map((source) => (
          <g
            key={source.id}
            onMouseEnter={() => setHovered(source.id)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            <circle
              cx={source.cx}
              cy={source.cy}
              r="18"
              fill={SIGNAL}
              fillOpacity={hovered === source.id ? 0.2 : 0.08}
              stroke={SIGNAL}
              strokeOpacity={hovered === source.id ? 0.9 : 0.35}
              strokeWidth="1"
              className="transition-all duration-150"
            />
            <text x={source.cx} y={source.cy + 3} textAnchor="middle" fontSize="8" fill={SIGNAL} fontFamily="Geist Mono, monospace">
              {source.label}
            </text>
          </g>
        ))}

        <path d="M 145 90 L 170 70 L 195 90 L 170 110 Z" fill={SIGNAL} fillOpacity="0.08" stroke={SIGNAL} strokeOpacity="0.45" strokeWidth="1" />
        <text x="170" y="88" textAnchor="middle" fontSize="8" fill={SIGNAL} fontFamily="Geist Mono, monospace">FX BUS</text>
        <text x="170" y="100" textAnchor="middle" fontSize="7" fill={SIGNAL} fillOpacity="0.7" fontFamily="Geist Mono, monospace">EQ + VERB</text>
        <rect x="240" y="68" width="60" height="44" rx="5" fill={SIGNAL} fillOpacity="0.14" stroke={SIGNAL} strokeOpacity="0.55" strokeWidth="1" />
        <text x="270" y="88" textAnchor="middle" fontSize="8" fill={SIGNAL} fontFamily="Geist Mono, monospace">MASTER</text>
        <text x="270" y="102" textAnchor="middle" fontSize="7" fill={SIGNAL} fillOpacity="0.7" fontFamily="Geist Mono, monospace">−3.2 dB</text>
        <circle cx="260" cy="160" r="3" fill="var(--color-success)" />
        <text x="270" y="163" fontSize="8" fill="var(--color-success)" fontFamily="Geist Mono, monospace">LIVE</text>
      </svg>
    </div>
  );
};

export const SignalFlowDiagram = memo(({ variant = "compact" }: SignalFlowDiagramProps) =>
  variant === "detailed" ? <DetailedDiagram /> : <CompactDiagram />
);
