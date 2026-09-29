import React from "react";
import { type Scene, PluginWindow, Era, Label, k } from "./kit";
import { EQ_ACCENT, EqGrid, Analyzer, curvePath, eqGeom, type Band } from "./eq";

/* Unreleased: the cycle still recording. */

const BANDS: Band[] = [{ f: 60, g: -7, q: 0.9 }, { f: 420, g: 6, q: 1.3 }, { f: 3200, g: -8, q: 1.6 }];

const eqReadsReal: Scene = {
  title: "Aestra EQ response", dur: 5.6,
  draw: (t) => {
    const now = t > 2.8;
    const x = 30;
    const y = 44;
    const w = 540;
    const h = 176;
    const { fx, gy } = eqGeom(x, y, w, h);
    const settle = now ? k(t, 2.8, 3.4) : 0;
    return (
      <PluginWindow x={10} y={6} w={580} h={228} name="Aestra EQ" accent={EQ_ACCENT}>
        <Era x={550} y={25} now={now} />
        <EqGrid x={x} y={y} w={w} h={h} />
        <Analyzer x={x + 2} y={y} w={w - 4} h={h} t={t} loud={now ? 1 - settle * 0.85 : 1} />
        <path d={curvePath(BANDS, x, y, w, h, now ? 160 : 22, now ? 0 : 0.9)} stroke={EQ_ACCENT} strokeWidth={now ? 2.4 : 1.6}
          fill="none" strokeLinejoin={now ? "round" : "miter"} />
        {now && <path d={`${curvePath(BANDS, x, y, w, h, 160)}L${x + w} ${gy(0)}L${x} ${gy(0)}Z`} fill={EQ_ACCENT} opacity={0.12 * settle} />}
        {BANDS.map((b, i) => (
          <circle key={i} cx={fx(b.f)} cy={gy(b.g)} r={5} fill="#0d1210" stroke={EQ_ACCENT} strokeWidth={1.8} />
        ))}
        <Label x={x + w - 8} y={y + 16} size={10} anchor="end" color={now ? "#8ba398" : "#c6d2ff"}>
          {now ? "A real curve; the analyzer sits behind it" : "Segmented curve; the analyzer shouts over it"}
        </Label>
      </PluginWindow>
    );
  },
};

export const NEXT: Record<string, Scene> = {
  "Unreleased:the-eq-response-reads-as-a": eqReadsReal,
};
