import React, { useEffect, useRef } from "react";
import { useSession } from "./session";
import { useReducedMotion } from "./hooks";
import "./inside.css";

/* A record on a turntable. As the hero ("in"), dropping the needle plays the loop and
   scrolling zooms into the grooves, which become the page. As the finale ("out"), the
   same record is reached from inside, the view pulls back, and the needle lifts by itself. */

const REST = -46;   // degrees: needle parked off the record
const PLAY = -27;   // needle in the groove

export const Turntable = ({ children, mode = "in", controls }: { children?: React.ReactNode; mode?: "in" | "out"; controls?: React.ReactNode }) => {
  const { playing, toggle, audio, engine, stopSoft } = useSession();
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const s = stage.current;
    if (!w || !s) return;
    if (reduced) { s.style.setProperty("--p", "0"); return; }
    let af = 0;
    let lifted = false; // the needle lifts once per pass through the outro, not on every scroll
    const update = () => {
      af = 0;
      const r = w.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const raw = Math.min(1, Math.max(0, -r.top / span));
      // Going in: zoomed out to zoomed in. Coming out: the reverse, then a held view to read it.
      const p = mode === "in" ? raw : Math.max(0, 1 - raw / 0.62);
      if (mode === "out") {
        if (raw <= 0.3) lifted = false;
        else if (!lifted) { lifted = true; if (engine.playing) stopSoft(); }
      }
      s.style.setProperty("--p", p.toFixed(4));
      // Once you're deep in the record, stop painting the parts that are no longer visible.
      const deep = p > 0.3 ? "1" : "0";
      if (s.dataset.deep !== deep) s.dataset.deep = deep;
    };
    const onScroll = () => { if (!af) af = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (af) cancelAnimationFrame(af);
    };
  }, [reduced, mode, engine, stopSoft]);

  return (
    <div ref={wrap} className="tt-wrap" data-mode={mode}>
      <div ref={stage} className="tt-sticky" data-deep={mode === "out" ? "1" : "0"} data-mode={mode}>
        <div className="tt-top tt-fade tt-chrome">
          <div className="tt-head">{children}</div>
          <div className="tt-ctl">
            {controls ?? (
              <>
                <button
                  type="button"
                  onClick={() => { void toggle(); }}
                  aria-pressed={playing}
                  className="dbtn pri"
                  style={{ minHeight: 44, padding: "0 20px", fontSize: 14 }}
                >
                  {playing ? "Lift the needle" : "Drop the needle"}
                </button>
                <p className="m-0 text-[13px] text-muted max-w-[30ch]">
                  {audio === "unavailable"
                    ? "This browser can't make sound here, but everything below still works to look at."
                    : playing ? "That's a real loop, made in your browser. Keep scrolling to go inside." : "Press it for sound, then keep scrolling to go inside the record."}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="tt-zoom">
          {/* plinth */}
          <div className="absolute inset-0 tt-fade tt-chrome" style={{ background: "#0c0b0a", border: "1px solid #3d3833", borderRadius: 14, boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }} aria-hidden="true">
            <div className="absolute" style={{ right: "3.2%", bottom: "5%", width: "7%", aspectRatio: "1", borderRadius: "50%", background: "#1c1a17", border: "1px solid #3d3833" }}>
              <span className="absolute inset-[34%] rounded-full" style={{ background: playing ? "#3fd6ad" : "#57514a", boxShadow: playing ? "0 0 12px #3fd6ad" : "none", transition: "all .3s" }} />
            </div>
            <span className="absolute font-mono" style={{ right: "3.2%", bottom: "13.5%", fontSize: "clamp(7px,0.9vw,11px)", letterSpacing: "0.14em", color: "#857d72" }}>33⅓</span>
          </div>

          {/* platter + record */}
          <div className="absolute" style={{ left: "10%", top: "7.14%", width: "60%", aspectRatio: "1" }} aria-hidden="true">
            <div className="absolute inset-0 rounded-full tt-fade tt-chrome" style={{ background: "#141210", border: "1px solid #3d3833" }} />
            <div className="absolute rec-spin rec-grooves rounded-full" data-on={playing} style={{ inset: "3.2%", border: "1px solid #25221f" }}>
              <div className="absolute rounded-full" style={{ inset: "33.5%", background: "#7c3aed", boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.25)" }}>
                <div className="absolute inset-0 grid place-items-center text-center" style={{ color: "#0c0b0a", fontFamily: "Archivo, sans-serif" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontStretch: "125%", fontSize: "clamp(8px,1.5vw,19px)", letterSpacing: "-0.01em", textTransform: "lowercase" }}>aestra</div>
                    <div className="font-mono whitespace-nowrap" style={{ fontSize: "clamp(5px,0.7vw,9px)", letterSpacing: "0.14em", marginTop: 3 }}>{mode === "in" ? "SIDE A" : "SIDE C"}</div>
                  </div>
                </div>
              </div>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: "1.6%", aspectRatio: "1", background: "#0c0b0a", boxShadow: "0 0 0 1px rgba(238,233,225,0.35)" }} />
            </div>
            <div className="absolute rec-sheen rounded-full pointer-events-none" style={{ inset: "3.2%" }} />
          </div>

          {/* tonearm */}
          <svg className="absolute inset-0 w-full h-full tt-fade tt-chrome" viewBox="0 0 1000 700" aria-hidden="true">
            <circle cx="880" cy="120" r="46" fill="#1c1a17" stroke="#3d3833" />
            <g className="arm" style={{ transformOrigin: "880px 120px", transform: `rotate(${playing ? PLAY : REST}deg)` }}>
              <line x1="880" y1="120" x2="882" y2="120" stroke="none" />
              <line x1="905" y1="108" x2="880" y2="120" stroke="#857d72" strokeWidth="16" strokeLinecap="round" />
              <line x1="880" y1="120" x2="457" y2="322" stroke="#aca397" strokeWidth="9" strokeLinecap="round" />
              <rect x="428" y="314" width="48" height="22" rx="3" transform="rotate(25 452 325)" fill="#25221f" stroke="#aca397" />
              <circle cx="440" cy="336" r="3.5" fill="#eee9e1" />
              <circle cx="880" cy="120" r="14" fill="#25221f" stroke="#aca397" />
            </g>
          </svg>

          <div className="tt-cover" aria-hidden="true" />
        </div>

      </div>
    </div>
  );
};
