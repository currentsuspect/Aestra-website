import React from "react";
import { useSession } from "./session";
import { PROFILES, ROWS, STEPS, voiceLabel } from "./engine";
import { ROW_META, rowColor } from "./demos/shared";

/* The run-out groove: the end of the side. A sleeve drawn from the loop the
   visitor actually made, and credits read from what they did on the page. */

const Credit = ({ k, children }: { k: string; children: React.ReactNode }) => (
  <div className="grid sm:grid-cols-[140px_1fr] gap-x-6 gap-y-1 py-3.5" style={{ borderBottom: "1px solid #2e2a26" }}>
    <dt className="dcap" style={{ paddingTop: 3 }}>{k}</dt>
    <dd className="m-0 text-[15px] leading-snug" style={{ color: "#eee9e1" }}>{children}</dd>
  </div>
);

export const Finale = () => {
  const { state, steps, versions, branches, refName, sampleNames } = useSession();
  const { grid, bpm, voices, routes, profile } = state;
  const onBus = ROWS.filter((r) => routes[r] === "drums").map((r) => ROW_META[r].name);
  const direct = ROWS.filter((r) => routes[r] === "master").map((r) => ROW_META[r].name);
  const changes = Math.max(0, steps.length - 1);

  return (
    <section id="end" className="scroll-mt-20 pt-20 sm:pt-28 pb-10" aria-labelledby="end-h">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6">
        <div style={{ borderTop: "2px solid #eee9e1", paddingTop: 20 }}>
          <p className="dcap m-0" style={{ color: "#a88dfb" }}>Run-out groove</p>
          <h2 id="end-h" className="m-0 mt-2 text-[clamp(2.6rem,1.4rem+4.4vw,5.6rem)] leading-[0.92]" style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontStretch: "62%", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
            That's the record.
          </h2>
          <p className="m-0 mt-4 max-w-[60ch] text-[17px] leading-relaxed" style={{ color: "#aca397" }}>
            That's the whole idea: a loop you shape, send, check and keep.{" "}
            {changes > 0
              ? `You changed it ${changes === 1 ? "once" : `${changes} times`}. Here's your pressing.`
              : "You haven't touched this one yet, so here's the one we pressed for you. Scroll back up and make it yours."}
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            {/* The sleeve, drawn from your loop: one coloured block per note. */}
            <div className="relative w-full max-w-[460px] aspect-square" style={{ background: "#000", border: "1px solid #eee9e1" }} role="img" aria-label={`Sleeve art drawn from your loop: ${ROWS.map((r) => `${ROW_META[r].name} ${grid[r].filter(Boolean).length} notes`).join(", ")}`}>
              <div className="absolute grid gap-[3px]" style={{ left: "8%", right: "8%", top: "10%", bottom: "30%", gridTemplateColumns: `repeat(${STEPS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS.length}, minmax(0, 1fr))` }} aria-hidden="true">
                {ROWS.flatMap((r) => grid[r].map((on, i) => (
                  <i key={r + i} style={{ display: "block", background: on ? rowColor(r) : "#141210", opacity: on ? 0.95 : 1 }} />
                )))}
              </div>
              <div className="absolute flex items-end justify-between" style={{ left: "8%", right: "8%", bottom: "7%", color: "#eee9e1" }}>
                <span className="lowercase" style={{ fontWeight: 800, fontStretch: "125%", fontSize: "clamp(1.1rem,2.4vw,1.8rem)", letterSpacing: "-0.01em" }}>aestra</span>
                <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.1em", color: "#857d72" }}>Night Drive · {bpm} BPM</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="dcap m-0 mb-1">Credits</p>
            <dl className="m-0" style={{ borderTop: "1px solid #2e2a26" }}>
              <Credit k="Tempo">{bpm} BPM</Credit>
              <Credit k="Sounds">{ROWS.map((r) => `${ROW_META[r].name} ${voiceLabel(r, voices[r], sampleNames[r])}`).join(" · ")}</Credit>
              <Credit k="Routing">
                {onBus.length ? `${onBus.join(", ")} through the Drum Bus` : "Nothing on the Drum Bus"}
                {direct.length ? `; ${direct.join(", ")} straight to Master` : ""}
              </Credit>
              <Credit k="Listened on">{PROFILES[profile].label}</Credit>
              <Credit k="Reference">{refName ?? "The built-in loop"}</Credit>
              <Credit k="Versions">{versions.length ? `${versions.length} saved on ${branches.length} ${branches.length === 1 ? "branch" : "branches"}` : "None saved yet"}</Credit>
              <Credit k="This visit">{changes === 0 ? "No changes yet" : `${changes === 1 ? "1 change" : `${changes} changes`}, each one a step you can go back to`}</Credit>
            </dl>
            <p className="dnote mt-5 mb-0 max-w-[60ch]">
              These demos run in your browser, and some are previews of designs for v0.8.1. The real thing is a native app: free, in alpha, and on Linux today.
            </p>
          </div>
        </div>

        <p className="dcap mt-14 mb-0 text-center" style={{ color: "#57514a" }}>Keep scrolling. The needle lifts itself.</p>
      </div>
    </section>
  );
};
