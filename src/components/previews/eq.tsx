import React from "react";
import { Label } from "./kit";

/* Aestra EQ's plot, drawn the way the editor draws it: log frequency,
   ±18 dB, mint response over a dark well. Shared by the EQ scenes. */

export const EQ_ACCENT = "#86e8b3";
export type Band = { f: number; g: number; q: number; color?: string; label?: string };

const LOG0 = Math.log10(20);
const LOG1 = Math.log10(20000);

export const eqGeom = (x: number, y: number, w: number, h: number) => {
  const fx = (f: number) => x + ((Math.log10(f) - LOG0) / (LOG1 - LOG0)) * w;
  const gy = (g: number) => y + h / 2 - (g / 18) * (h / 2);
  return { fx, gy };
};

export const response = (bands: Band[], f: number) =>
  bands.reduce((sum, b) => {
    const d = Math.log2(f / b.f) * b.q;
    return sum + b.g / (1 + d * d * 1.6);
  }, 0);

export const curvePath = (bands: Band[], x: number, y: number, w: number, h: number, steps = 120, jag = 0) => {
  const { gy } = eqGeom(x, y, w, h);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const f = Math.pow(10, LOG0 + (i / steps) * (LOG1 - LOG0));
    const g = response(bands, f) + (jag ? Math.sin(i * 1.9) * jag : 0);
    d += `${i ? "L" : "M"}${(x + (i / steps) * w).toFixed(1)} ${gy(g).toFixed(1)}`;
  }
  return d;
};

/** Spectrum analyzer as filled bars; `loud` 0..1 sets how much it shouts. */
export const Analyzer = ({ x, y, w, h, t, loud }: { x: number; y: number; w: number; h: number; t: number; loud: number }) => {
  const n = 64;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const tilt = 1 - i / n;
        const v = (0.25 + 0.55 * tilt) * (0.6 + 0.4 * Math.abs(Math.sin(t * 6 + i * 0.7) * Math.cos(t * 3.1 + i * 0.23)));
        const bh = v * h * (0.35 + 0.65 * loud);
        return <rect key={i} x={x + (i / n) * w} y={y + h - bh} width={w / n - 1} height={bh}
          fill={loud > 0.5 ? "#9fb4ff" : "#86e8b3"} opacity={0.08 + 0.42 * loud} />;
      })}
    </g>
  );
};

export const EqGrid = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => {
  const { fx, gy } = eqGeom(x, y, w, h);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#0d1210" stroke="#1d2a24" />
      {[30, 100, 300, 1000, 3000, 10000].map((f) => (
        <g key={f}>
          <line x1={fx(f)} x2={fx(f)} y1={y} y2={y + h} stroke="#17211c" />
          <Label x={fx(f)} y={y + h - 5} size={8.5} anchor="middle" color="#5d6b64">{f >= 1000 ? `${f / 1000}k` : f}</Label>
        </g>
      ))}
      {[12, 6, 0, -6, -12].map((g) => (
        <g key={g}>
          <line x1={x} x2={x + w} y1={gy(g)} y2={gy(g)} stroke={g === 0 ? "#2a3a32" : "#17211c"} />
          <Label x={x + 5} y={gy(g) - 2} size={8} color="#5d6b64">{g > 0 ? `+${g}` : g}</Label>
        </g>
      ))}
    </g>
  );
};
