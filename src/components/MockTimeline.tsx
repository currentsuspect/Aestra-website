import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { Play, Pause, Plus, Minus, Square, Circle, Scissors, Mic, ChevronLeft, ChevronRight, Disc, Sliders, Music, Layers, Folder, Settings, Activity, FileText, Search, MoreHorizontal, LayoutTemplate, Cpu, Upload, Zap, Star, X, CreditCard, Menu, MousePointer, Pencil } from "lucide-react";
import { cn, TRACK_HEIGHT, HEADER_WIDTH, RULER_HEIGHT, SNAP_GRID_PX } from "../lib";

export const MockTimeline = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [bpm, setBpm] = useState("120.0");
  const [activeTab, setActiveTab] = useState<"arsenal" | "timeline" | "audition">("timeline");
  const [timelineView, setTimelineView] = useState<"arrangement" | "mixer">("arrangement");
  const [selectedFile, setSelectedFile] = useState(6);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const playheadRef = useRef<HTMLDivElement>(null);
  const playheadPos = useRef(190);

  const files = useMemo(() => [
    { name: "Baby Keem - Ca$ino.flac", size: "28 MB" },
    { name: "Bktherula - CODE.flac", size: "19 MB" },
    { name: "Che - Promoting Violence.flac", size: "17 MB" },
    { name: "PlaqueBoyMax - Super Wrong.flac", size: "12 MB" },
    { name: "PlaqueBoyMax - Yellow Lamb Truck.flac", size: "10 MB" },
    { name: "Rapsody - Black Popstar.flac", size: "14 MB" },
    { name: "SLAYR - Flashout Freestyle.flac", size: "23 MB" },
    { name: "SoFaygo - MM3.flac", size: "19 MB" },
    { name: "Travis Scott - HOUSTONFORNICATION.flac", size: "24 MB" },
    { name: "Travis Scott - NO BYSTANDERS.flac", size: "25 MB" },
    { name: "Travis Scott - SHYNE.flac", size: "21 MB" },
    { name: "Yeat - Purpose General.flac", size: "21 MB" },
  ], []);

  const tracks = useMemo(() => [
    { id: 1, name: "Track 1", color: "#d4b02f", meter: 72, db: "-8.0 dB" },
    { id: 2, name: "Track 2", color: "#47f3d1", meter: 4, db: "-60.0 dB" },
    { id: 3, name: "Track 3", color: "#f266d7", meter: 4, db: "-60.0 dB" },
    { id: 4, name: "Track 4", color: "#8cff38", meter: 4, db: "-60.0 dB" },
    { id: 5, name: "Track 5", color: "#ff9c38", meter: 4, db: "-60.0 dB" },
    { id: 6, name: "Track 6", color: "#6ac4ff", meter: 4, db: "-60.0 dB" },
    { id: 7, name: "Track 7", color: "#ff3d83", meter: 4, db: "-60.0 dB" },
    { id: 8, name: "Track 8", color: "#ba69ff", meter: 4, db: "-60.0 dB" },
    { id: 9, name: "Track 9", color: "#f0ea28", meter: 4, db: "-60.0 dB" },
    { id: 10, name: "Track 10", color: "#2af0b2", meter: 4, db: "-60.0 dB" },
  ], []);

  const visibleMixerTracks = tracks.slice(0, 6);
  const rulerMarks = [1, 17, 33, 49, 65];

  useEffect(() => {
    let af = 0;
    let last = 0;
    let lastTimeUpdate = 0;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      if (containerRef.current && isPlaying) {
        const maxX = containerRef.current.offsetWidth - 32;
        const next = playheadPos.current + 94 * dt;
        playheadPos.current = next > maxX ? 190 : next;
        if (playheadRef.current) {
          playheadRef.current.style.transform = `translateX(${playheadPos.current}px)`;
        }
        // Throttle React state update to ~10fps instead of 60fps
        if (ts - lastTimeUpdate > 100) {
          lastTimeUpdate = ts;
          setTime((prev) => (next > maxX ? 0 : prev + dt));
        }
        af = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [isPlaying]);

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  const selectedTrackData = tracks[selectedTrack];

  return (
    <div
      className="mt-8 sm:mt-12 lg:mt-16 max-w-7xl mx-auto relative px-0 sm:px-2"
    >
      {/* Mobile placeholder - simplified */}
      <div className="md:hidden rounded-[18px] border border-[#55d6ff]/40 bg-[#101115] p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Disc size={16} className="text-[#b6a8ff]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#93cfe3]">DAW Preview</span>
        </div>
        <p className="text-sm text-[#8b94aa] mb-4">Interactive timeline editor — available on tablet and desktop.</p>
        <div className="flex justify-center gap-3 text-[#61d5ff]/60 text-xs">
          <span className="flex items-center gap-1"><Cpu size={12} /> Multi-track</span>
          <span className="flex items-center gap-1"><Sliders size={12} /> Mixer</span>
          <span className="flex items-center gap-1"><Zap size={12} /> Patterns</span>
        </div>
      </div>

      {/* Full editor on md+ screens */}
      <div className="hidden md:block">
        <div className="absolute inset-x-4 lg:inset-x-14 -top-2 h-14 rounded-full bg-[#61d5ff]/10 blur-2xl pointer-events-none" />
        <div className="relative overflow-hidden rounded-[12px] lg:rounded-[18px] border border-[#55d6ff] bg-[#101115] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <div className="h-8 border-b border-[#2c3240] bg-[#14161d] px-2 sm:px-4 flex items-center justify-between text-[10px] text-[#c7cad4]">
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="text-[#f5f6fa]">File</span>
            <span className="hidden sm:inline">Edit</span>
            <span className="hidden sm:inline">View</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#3a4050] bg-[#1d2130] p-1">
            {(["arsenal", "timeline", "audition"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] capitalize transition-colors",
                  activeTab === tab ? "bg-[#8e80da] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" : "text-[#a5abbd]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[#d7d9e4]">
            <Upload size={11} />
            <Minus size={11} />
            <Square size={10} />
            <X size={11} />
          </div>
        </div>

        <div className="border-b border-[#2b3040] bg-[#171922] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-[14px] border border-[#34394b] bg-[#232737] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <button
                  onClick={() => setIsPlaying((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#3d4254] bg-[#2a2f3d] text-[#d3d8e6]"
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setTime(43.94);
                    playheadPos.current = 190;
                    if (playheadRef.current) playheadRef.current.style.transform = 'translateX(190px)';
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#3d4254] bg-[#2a2f3d] text-[#d3d8e6]"
                >
                  <Square size={12} />
                </button>
                <button
                  onClick={() => setIsRecording((v) => !v)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#3d4254] bg-[#2a2f3d]",
                    isRecording ? "text-[#ff668f]" : "text-[#d3d8e6]"
                  )}
                >
                  <Circle size={12} fill={isRecording ? "currentColor" : "none"} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#3d4254] bg-[#2a2f3d] text-[#d3d8e6]">
                  <MoreHorizontal size={13} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#3d4254] bg-[#2a2f3d] text-[#8e94aa]">
                  <Activity size={13} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[#3d4254] bg-[#2a2f3d] text-[#8e94aa]">
                  <Mic size={13} />
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-[14px] border border-[#34394b] bg-[#232737] px-3 py-2 text-[11px] text-[#d6daea]">
                <span className="rounded-[9px] border border-[#41465a] bg-[#2a2f3d] px-2 py-1">4/4</span>
                <span className="rounded-[9px] border border-[#41465a] bg-[#2a2f3d] px-2 py-1">
                  <input
                    value={bpm}
                    onChange={(e) => /^[0-9]*\.?[0-9]*$/.test(e.target.value) && setBpm(e.target.value)}
                    className="w-12 bg-transparent text-right outline-none"
                  />
                  <span className="ml-1 text-[#a7adc0]">BPM</span>
                </span>
                <span className="rounded-[9px] border border-[#41465a] bg-[#2a2f3d] px-2 py-1 font-mono text-[#d9dced]">
                  {fmt(time)}
                </span>
              </div>
            </div>

            {activeTab === "timeline" && (
              <div className="flex items-center gap-2 rounded-2xl border border-[#34394b] bg-[#232737] p-1 text-[#a5abc0]">
                {[LayoutTemplate, Folder, CreditCard, Settings].map((Icon, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (index === 0) setTimelineView("arrangement");
                      if (index === 3) setTimelineView("mixer");
                    }}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#43485a] bg-[#2a2f3d]",
                      (index === 0 && timelineView === "arrangement") || (index === 3 && timelineView === "mixer")
                        ? "bg-[#6e7397] text-white"
                        : "text-[#9aa2b7]"
                    )}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="h-11 w-40 rounded-md border border-[#3a4050] bg-[#1f2231] p-2">
                <svg className="h-full w-full" viewBox="0 0 120 28" preserveAspectRatio="none">
                  <polyline
                    points="0,10 7,8 14,18 21,6 28,17 35,9 42,14 49,7 56,18 63,12 70,17 77,10 84,20 91,17 98,12 105,9 112,7 120,5"
                    fill="none"
                    stroke="#b08cff"
                    strokeWidth="1.8"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
              <div className="flex gap-1 rounded-md border border-[#3a4050] bg-[#1f2231] p-1">
                <div className="h-10 w-6 rounded bg-gradient-to-b from-[#0f1118] to-[#bc89ff]" />
                <div className="h-10 w-6 rounded bg-gradient-to-b from-[#0f1118] to-[#ce9eff]" />
              </div>
            </div>
          </div>
        </div>

        {activeTab === "arsenal" && (
          <div className="h-[400px] md:h-[690px] bg-[#11131a] flex items-center justify-center">
            <div className="w-[90%] sm:w-[34rem] rounded-[18px] border border-[#3b4152] bg-[#1a1d27] p-4 sm:p-8">
              <div className="mb-4 flex items-center justify-center gap-2 text-[#e5e9f5]">
                <Disc size={18} className="text-[#c59dff]" />
                <span className="text-sm tracking-[0.22em] uppercase">Arsenal</span>
              </div>
              <p className="mx-auto mb-6 max-w-md text-center text-sm text-[#9ca3b5]">
                Pattern engines and source modules live here. The live site demo keeps this subdued so the
                arrangement and mixer are the visual priority.
              </p>
              <div className="grid grid-cols-4 gap-3">
                {["808", "Hats", "Clap", "Snare", "Keys", "Pad", "Lead", "FX"].map((name, index) => (
                  <div key={name} className="rounded-xl border border-[#33394a] bg-[#141720] p-3 text-center">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#6ce8d5]">
                      {index < 4 ? "Drum" : "Unit"}
                    </div>
                    <div className="text-sm text-[#eceff8]">{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && timelineView === "arrangement" && (
          <div className="flex h-[400px] md:h-[596px] bg-[#11131a]">
            <div className="w-[200px] md:w-[268px] border-r border-[#2d3342] bg-[#1b1e28] flex flex-col">
              <div className="p-2">
                <div className="flex rounded-[12px] border border-[#454b5f] bg-[#232736] p-1 text-[10px]">
                  <button className="flex-1 rounded-[8px] bg-[#7871b6] py-1 text-white">Files</button>
                  <button className="flex-1 py-1 text-[#9aa2b7]">Plugins</button>
                </div>
              </div>

              <div className="px-3 pb-2">
                <div className="mb-2 flex gap-2">
                  <button className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#4d5368] bg-[#232737] text-[#8f95a8]">
                    <ChevronLeft size={12} />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#4d5368] bg-[#232737] text-[#8f95a8]">
                    <Star size={12} />
                  </button>
                  <div className="ml-auto flex gap-2">
                    <button className="rounded-[8px] border border-[#4d5368] bg-[#232737] px-3 py-1 text-[10px] text-[#cfd5e3]">Tags</button>
                    <button className="rounded-[8px] border border-[#4d5368] bg-[#232737] px-3 py-1 text-[10px] text-[#cfd5e3]">Sort</button>
                  </div>
                </div>
                <div className="mb-3 inline-flex rounded-[8px] border border-[#4b5270] bg-[#2a2f40] px-3 py-1 text-[11px] text-[#9ea6ff]">
                  Aestra
                </div>
                <div className="flex items-center rounded-[12px] border border-[#4a5063] bg-[#232736] px-3 py-3 text-[11px] text-[#9da5b7]">
                  <Search size={13} className="mr-2 text-[#737b91]" />
                  <span>Search files...</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-2">
                {files.map((file, index) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(index)}
                    className={cn(
                      "mb-1 flex w-full items-center gap-3 rounded-[8px] border px-3 py-2 text-left transition-colors",
                      selectedFile === index
                        ? "border-[#7f88bc] bg-[#6f77b9]/25 text-white shadow-[inset_0_0_0_1px_rgba(165,175,255,0.15)]"
                        : "border-transparent bg-transparent text-[#c1c6d4] hover:bg-[#232736]"
                    )}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-[#2b3040] text-[#8b92a6]">
                      <FileText size={11} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[11px] tracking-[-0.01em]">
                        {file.name
                          .replace(" - ", " - ")
                          .replace("HOUSTONFORNICATION", "...TION")
                          .replace("Flashout Freestyle", "...t Freestyle")
                          .replace("Promoting Violence", "...ence")
                          .replace("Yellow Lamb Truck", "...uck")
                          .replace("Black Popstar", "...star")
                          .replace("Purpose General", "...neral")}
                      </div>
                    </div>
                    <div className="text-[10px] text-[#82889d]">{file.size}</div>
                  </button>
                ))}
              </div>

              <div className="border-t border-[#2d3342] bg-[#202430]">
                <div className="px-3 pt-2 text-[11px] text-[#c9cfdd]">{files[selectedFile].name}</div>
                <div className="px-3 pb-3 text-[10px] text-[#8b92a5]">{files[selectedFile].size} FLAC</div>
                <div className="mx-3 mb-3 rounded-[10px] border border-[#5b6485] bg-[#7f88c9]/70 px-2 py-2">
                  <svg className="h-12 w-full" viewBox="0 0 220 50" preserveAspectRatio="none">
                    <polyline
                      points="0,25 10,10 20,32 30,14 40,38 50,11 60,34 70,19 80,41 90,16 100,29 110,20 120,35 130,18 140,28 150,13 160,37 170,21 180,33 190,26 200,31 210,22 220,24"
                      fill="none"
                      stroke="#232541"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="border-b border-[#2d3342] bg-[#151821] px-4 py-2">
                <div className="mb-2 flex items-center gap-2 text-[#d6dbea]">
                  {[Menu, Plus, MousePointer, Scissors, Pencil, ChevronRight].map((Icon, index) => (
                    <button
                      key={index}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border border-[#474d60] bg-[#242838]",
                        index === 2 && "text-[#8da2ff]"
                      )}
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                  {["C", "E", "A"].map((mode, index) => (
                    <button
                      key={mode}
                      className={cn(
                        "rounded-md border px-2 py-1",
                        index === 0
                          ? "border-[#636b8c] bg-[#31374a] text-[#cfd6ff]"
                          : "border-[#3a4052] bg-[#171a24] text-[#8f96ab]"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                  </div>
                  <div className="text-[11px] text-[#8e95a7]">
                    {files[selectedFile].name.replace(".flac", "").slice(0, 20)}...
                    <span className="ml-2 text-[#6f7689]">174.3s</span>
                  </div>
                </div>
              </div>

              <div ref={containerRef} className="relative flex-1 overflow-hidden bg-[#0f1016]">
                <div className="absolute left-0 right-0 top-0 h-12 border-b border-[#474037] bg-[#13151c]">
                  <div className="absolute left-[200px] right-6 top-[5px] h-5 rounded-md border border-[#6f6550]">
                    <div className="absolute inset-y-0 left-0 right-0 border-b border-[#d1ab2d] bg-[linear-gradient(90deg,rgba(212,176,47,0.18),rgba(212,176,47,0.06))]" />
                    {rulerMarks.map((mark, index) => (
                      <div key={mark} className="absolute top-0 bottom-0" style={{ left: `${index * 22 + 18}%` }}>
                        <div className="h-full border-l border-[#716e67]" />
                        <span className="absolute bottom-[-16px] left-1 text-[10px] text-[#8f95a8]">{mark}</span>
                      </div>
                    ))}
                    <span className="absolute left-[33%] top-[-9px] rounded-md border border-[#55596e] bg-[#282d3c] px-2 py-1 text-[9px] text-[#d7dcf0]">
                      Bar 35, Beat 2, Clips 1
                    </span>
                  </div>
                  <div className="absolute left-[204px] right-6 bottom-[5px] h-5 rounded-[6px] border border-[#626470] bg-[#101117]">
                    <div className="absolute left-1 top-0 bottom-0 w-px bg-[#d9dadf]" />
                    <div className="absolute left-[17%] top-0 bottom-0 w-px bg-[#5f6470]" />
                    <div className="absolute left-[33%] top-0 bottom-0 w-px bg-[#5f6470]" />
                    <div className="absolute left-[49%] top-0 bottom-0 w-px bg-[#5f6470]" />
                    <div className="absolute left-[65%] top-0 bottom-0 w-px bg-[#5f6470]" />
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-8 top-12 overflow-hidden">
                  {tracks.map((track, index) => {
                    const top = index * 43;
                    const isLeadTrack = index === 0;
                    return (
                      <div key={track.id} className="absolute inset-x-0" style={{ top, height: 43 }}>
                        <div className="absolute left-0 top-0 h-full w-[200px] border-r border-[#393e4f] bg-[#222632]">
                          <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: track.color }} />
                          <div className="flex h-full items-center justify-between px-4">
                            <span className="text-[12px]" style={{ color: track.color }}>
                              {track.name}
                            </span>
                            <div className="flex gap-2">
                              {["M", "S", "R"].map((label) => (
                                <button
                                  key={label}
                                  className="flex h-6 w-6 items-center justify-center rounded-full border border-[#5a6072] bg-[#2c3140] text-[10px] text-[#afb5c6] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-[200px] right-0 top-0 border-b border-[#4c515d] bg-[#111218]">
                          <div className="absolute inset-0">
                            {Array.from({ length: 72 }).map((_, gridIndex) => (
                              <div
                                key={gridIndex}
                                className="absolute top-0 bottom-0 border-r"
                                style={{
                                  left: `${(gridIndex / 72) * 100}%`,
                                  borderColor: gridIndex % 4 === 0 ? "#767679" : "#45484f",
                                }}
                              />
                            ))}
                          </div>

                          {isLeadTrack && (
                            <div className="absolute left-1 top-[4px] right-2 h-[32px] rounded-[3px] border border-[#f7d548] bg-[linear-gradient(180deg,#ddb72d,#f0c63a)] shadow-[0_0_0_1px_rgba(255,245,160,0.15)]">
                              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,245,180,0.16)_0px,rgba(255,245,180,0.16)_2px,transparent_2px,transparent_10px)] opacity-80" />
                              <div className="absolute inset-x-2 top-[11px] h-2">
                                <svg className="h-full w-full" viewBox="0 0 500 20" preserveAspectRatio="none">
                                  <polyline
                                    points={Array.from({ length: 80 }, (_, i) => {
                                      const x = (i / 79) * 500;
                                      const y = 10 + Math.sin(i * 0.42) * 1.8 + Math.cos(i * 0.13) * 1.2;
                                      return `${x},${y}`;
                                    }).join(" ")}
                                    fill="none"
                                    stroke="#8b6810"
                                    strokeWidth="1.6"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </svg>
                              </div>
                              <span className="absolute left-3 top-1 text-[10px] text-[#fff3b3]">
                                SLAYR - Flashout Freestyle.flac
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div ref={playheadRef} className="absolute bottom-0 top-0 z-20 w-px bg-[#7a7cff]" style={{ transform: 'translateX(190px)' }}>
                    <div className="absolute -top-12 h-12 w-px bg-[#7a7cff]" />
                    <div className="absolute bottom-0 top-0 w-px bg-[#6e73ff] shadow-[0_0_12px_rgba(122,124,255,0.8)]" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-[#2d3342] bg-[#171922] px-4 flex items-center">
                  <div className="ml-2 flex rounded-full border border-[#4b5266] bg-[#222735] p-1 text-[10px]">
                    <button className="rounded-full bg-[#7871b6] px-4 py-1 text-white">Clips</button>
                    <button className="px-4 py-1 text-[#98a0b6]">Patterns</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && timelineView === "mixer" && (
          <div className="h-[400px] md:h-[690px] bg-[#13151c] p-0">
            <div className="flex h-full flex-col">
              <div className="border-b border-[#2d3342] bg-[#232632] px-3 md:px-4 py-2 text-[11px] text-[#b7bece]">
                <span className="tracking-[0.18em] uppercase">Mixer</span>
              </div>
              <div className="flex min-h-0 flex-1 overflow-x-auto">
                <div className="flex-1 px-2 md:px-3 py-3 md:py-4 min-w-[600px]">
                  <div className="mb-3 flex h-6 items-center rounded-[10px] border border-[#55606c] bg-[#1f2432] px-1">
                    {tracks.map((track) => (
                      <div key={track.id} className="mx-[1px] h-4 flex-1 rounded-sm" style={{ backgroundColor: track.color, opacity: 0.92 }} />
                    ))}
                  </div>

                  <div className="flex h-[540px] gap-2">
                    {visibleMixerTracks.map((track, index) => (
                      <button
                        key={track.id}
                        onClick={() => setSelectedTrack(index)}
                        className={cn(
                          "relative flex w-[108px] flex-col rounded-[12px] border bg-[#181b24] px-3 py-2 text-left",
                          selectedTrack === index ? "border-[#737eb6] bg-[#23293a]" : "border-[#333949]"
                        )}
                      >
                        <div className="absolute left-0 right-0 top-0 h-1 rounded-t-[12px]" style={{ backgroundColor: track.color }} />
                        <div className="mt-2 text-center text-[11px] text-[#d8dceb]">{track.name}</div>
                        <div className="mt-3 flex justify-center gap-2">
                          {["M", "S", "R"].map((label) => (
                            <div key={label} className="flex h-5 w-5 items-center justify-center rounded-full border border-[#50566a] bg-[#262b38] text-[9px] text-[#b8bece]">
                              {label}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 rounded-[10px] border border-[#454c5d] bg-[#252a38] px-2 py-2 text-center text-[10px] text-[#8e95aa]">
                          Add Insert
                        </div>
                        <div className="mt-auto flex items-end justify-center gap-3 pt-6">
                          <div className="pb-48 text-[10px] text-[#b9bfd0]">{track.db}</div>
                          <div className="relative h-[220px] w-5 rounded-sm bg-[#d8c76f]/15">
                            <div
                              className="absolute bottom-0 left-0 right-0 rounded-sm bg-[linear-gradient(180deg,#f0c95a,#97edc4)]"
                              style={{ height: `${track.meter}%` }}
                            />
                          </div>
                          <div className="relative h-[220px] w-6 rounded-[10px] bg-[#202431]">
                            <div className="absolute left-1 right-1 h-3 rounded bg-[#b5bcff] shadow-[0_0_8px_rgba(181,188,255,0.45)]" style={{ bottom: `${index === 0 ? 66 : 0}%` }} />
                          </div>
                        </div>
                        <div className="mt-3 text-center text-[10px] text-[#b7bdd0]">0.0</div>
                        <div className="mt-2 text-center text-[10px] text-[#858ba1]">{track.id}</div>
                      </button>
                    ))}

                    <div className="w-[230px] rounded-[14px] border border-[#4a5363] bg-[#1d212d] p-3">
                      <div className="mb-3 flex rounded-full border border-[#4c5568] bg-[#242938] p-1 text-[10px]">
                        {["Inserts", "Sends", "I/O"].map((tab) => (
                          <button
                            key={tab}
                            className={cn(
                              "flex-1 rounded-full py-2",
                              tab === "Sends" ? "bg-[#319cb8]/25 text-[#c9f8ff] shadow-[inset_0_0_0_1px_rgba(97,213,255,0.35)]" : "text-[#9aa2b7]"
                            )}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <div className="mb-3 rounded-[14px] border border-[#4a5363] bg-[#171b25] p-3">
                        <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#97a0b6]">Track</div>
                        <div className="text-sm text-[#edf1fa]">{selectedTrackData.name}</div>
                        <div className="mt-1 text-[11px] text-[#9da5ba]">Track {selectedTrackData.id}</div>
                        <div className="mt-2 flex gap-1 text-[9px] text-[#8f96a9]">
                          {["Inserts", "Sends", "Fader", "Outs A"].map((chip) => (
                            <span key={chip} className="rounded-full border border-[#42485a] bg-[#232837] px-2 py-1">
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3 rounded-[14px] border border-[#4a5363] bg-[#171b25] p-3">
                        <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#97a0b6]">Send Status</div>
                        <div className="text-[11px] text-[#edf1fa]">No sends configured</div>
                        <div className="mt-1 text-[10px] text-[#8189a1]">Audio sends for this track.</div>
                      </div>

                      <div className="mb-3 rounded-[14px] border border-[#4a5363] bg-[#171b25] p-3">
                        <div className="mb-2 text-sm text-[#edf1fa]">Main Output</div>
                        <div className="mb-3 text-[10px] text-[#8189a1]">
                          Choose where the main audible path goes. Master or subgroup destination.
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-[#57607a] bg-[#2b3040] px-3 py-2 text-[12px] text-[#f0f3fb]">
                          <span>Master</span>
                          <ChevronRight size={12} className="text-[#a8b0c4]" />
                        </div>
                      </div>

                      <div className="rounded-[14px] border border-[#4a5363] bg-[#171b25] p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm text-[#edf1fa]">Route Map</div>
                          <div className="rounded-full border border-[#3d4355] px-2 py-1 text-[9px] text-[#9ea6b8]">Master off</div>
                        </div>
                        <div className="rounded-[12px] border border-[#3f4657] bg-[#1e2330] p-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full border border-[#485066] bg-[#252a38] px-3 py-1 text-[10px] text-[#bfc6d9]">
                              Track 1
                            </div>
                            <div className="h-px flex-1 bg-[#596074]" />
                            <div className="rounded-full border border-[#485066] bg-[#252a38] px-3 py-1 text-[10px] text-[#bfc6d9]">
                              Out: Master
                            </div>
                          </div>
                        </div>
                      </div>

                      <button className="mt-4 w-full rounded-[14px] border border-[#6d7388] bg-[#232837] py-3 text-[12px] text-[#d8dceb]">
                        Add Send
                      </button>
                    </div>

                    <div className="w-[148px] rounded-[14px] border border-[#4f5870] bg-[#191d28] p-3">
                      <div className="rounded-[10px] border border-[#7b72c9] bg-[#232739] px-3 py-2 text-center text-[11px] text-[#f0f3ff]">
                        MASTER
                        <div className="mt-1 text-[10px] text-[#9da5ba]">Output</div>
                      </div>
                      <button className="mt-3 w-full rounded-[10px] border border-[#4d5569] bg-[#262b38] py-2 text-[11px] text-[#99a2b7]">
                        Add Insert
                      </button>
                      <div className="mt-8 flex items-end justify-center gap-4">
                        <div className="pb-52 text-[10px] text-[#b8becf]">-8.0 dB</div>
                        <div className="relative h-[240px] w-7 rounded-sm bg-[#d9c468]/20">
                          <div className="absolute bottom-0 left-0 right-0 h-[82%] rounded-sm bg-[linear-gradient(180deg,#f0cb58,#89e3c6)]" />
                        </div>
                        <div className="relative h-[240px] w-7 rounded-[10px] bg-[#202431]">
                          <div className="absolute left-1 right-1 bottom-[68%] h-3 rounded bg-[#b5bcff] shadow-[0_0_8px_rgba(181,188,255,0.45)]" />
                        </div>
                      </div>
                      <div className="mt-3 text-center text-[10px] text-[#b7bdd0]">0.0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "audition" && (
          <div className="h-[400px] md:h-[690px] bg-[#12141a] flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full sm:w-[30rem] rounded-[18px] border border-[#384050] bg-[#1b1f2a] p-6 sm:p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5c6690] bg-[#262b3a]">
                  <Play size={22} className="ml-1 text-[#cb9dff]" />
                </div>
                <div className="mb-2 text-lg text-[#eff3fb]">Audition</div>
                <p className="mb-5 text-sm text-[#9aa2b6]">
                  Translation listening stays intentionally simpler than the arrangement and mixer views.
                </p>
                <div className="rounded-[14px] border border-[#40485d] bg-[#12151d] p-4">
                  <svg className="h-14 w-full" viewBox="0 0 300 50" preserveAspectRatio="none">
                    <polyline
                      points={Array.from({ length: 100 }, (_, i) => {
                        const x = (i / 99) * 300;
                        const y = 25 + Math.sin(i * 0.14) * 10 * Math.cos(i * 0.08 + 1);
                        return `${x},${y}`;
                      }).join(" ")}
                      fill="none"
                      stroke="#b790ff"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
});
