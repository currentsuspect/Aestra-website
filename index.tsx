import "./styles.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { 
  Download, 
  ChevronRight, 
  Layers, 
  Zap, 
  Music, 
  Cpu, 
  Disc, 
  Sliders, 
  Check,
  Play,
  Square,
  Circle,
  Menu,
  X,
  User,
  Terminal,
  ArrowRight,
  LayoutTemplate,
  FileText,
  Search,
  BookOpen,
  LifeBuoy,
  CreditCard,
  Shield,
  Activity,
  GitCommit,
  Folder,
  MoreHorizontal,
  Mic,
  Settings,
  Upload
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

// --- Design System & Utilities ---

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// --- Constants ---
const TRACK_HEIGHT = 72;
const HEADER_WIDTH = 180; // Fixed width for track headers
const RULER_HEIGHT = 32;
const SNAP_GRID_PX = 20; // Snap every 20px

// --- Components ---

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  icon: Icon,
  ...props 
}: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-violet-500",
    secondary: "bg-white/5 text-zinc-100 hover:bg-white/10 border border-white/10 backdrop-blur-sm",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
    outline: "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10 p-0"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className={cn("w-4 h-4", children ? "mr-2" : "")} />}
      {children}
    </motion.button>
  );
};

const Badge = ({ children, variant = "default", className }: any) => {
  const styles = variant === "outline" 
    ? "border border-violet-500/30 text-violet-300 bg-violet-500/10" 
    : "bg-violet-600 text-white";
    
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles, className)}>
      {variant === "outline" && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mr-2 animate-pulse" />}
      {children}
    </span>
  );
};

const Card = ({ children, className }: any) => (
  <div className={cn("bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden", className)}>
    {children}
  </div>
);

// --- Sections ---

const Navbar = ({ activePage, setPage, topOffset = 0 }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", id: "features" },
    { name: "Docs", id: "docs" },
    { name: "Pricing", id: "pricing" },
    { name: "Changelog", id: "changelog" },
  ];

  return (
    <nav className={cn(
      "fixed left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "bg-[#09090b]/80 backdrop-blur-md border-[#27272a] py-3" : "bg-transparent border-transparent py-5"
    )} style={{ top: topOffset }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setPage("home")} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-violet-500/20 transition-all">
            <img src="/aestra_icon.svg" alt="Aestra" className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Aestra</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => setPage(link.id)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-violet-400",
                activePage === link.id ? "text-white" : "text-zinc-400"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <Button size="sm" onClick={() => setPage("download")} icon={Download}>
            Download Beta
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#18181b] border-b border-[#27272a] overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => { setPage(link.id); setMobileOpen(false); }}
                  className="text-left text-zinc-300 hover:text-violet-400"
                >
                  {link.name}
                </button>
              ))}
              <hr className="border-[#27272a]" />
              <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="text-left text-zinc-300">GitHub</a>
              <Button className="w-full" onClick={() => setPage("download")}>Download Free</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MockTimeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [bpm, setBpm] = useState("120.0");
  const playheadX = useMotionValue(0);
  const [activeTab, setActiveTab] = useState<"arsenal" | "timeline" | "audition">("timeline");

  const TRACK_H = 68;

  const [files] = useState([
    { name: "vocals_main_take1.wav", size: "11 MB", selected: true },
    { name: "drum_break_amen.wav", size: "15 MB", selected: false },
    { name: "sub_bass_drop.wav", size: "17 MB", selected: false },
    { name: "synth_pad_ethereal.wav", size: "13 MB", selected: false },
    { name: "gtr_riff_clean.wav", size: "12 MB", selected: false },
    { name: "fx_riser_white.wav", size: "17 MB", selected: false },
  ]);

  const [tracks] = useState([
    { id: 1, name: "Track 1", hex: "#3B5BDB", route: "Snd T2", meter: 65, db: "-8.2" },
    { id: 2, name: "Track 2", hex: "#0CA678", route: null, meter: 40, db: "-19.3" },
    { id: 3, name: "Track 3", hex: "#AE3EC9", route: null, meter: 5, db: "-60.0" },
    { id: 4, name: "Track 4", hex: "#37B24D", route: null, meter: 5, db: "-60.0" },
    { id: 5, name: "Track 5", hex: "#E8590C", route: null, meter: 5, db: "-60.0" },
    { id: 6, name: "Track 6", hex: "#1C7ED6", route: null, meter: 5, db: "-60.0" },
  ]);

  const [clips, setClips] = useState([
    { id: 1, trackId: 1, x: 0, w: 260, name: "vocals_main.wav" },
    { id: 2, trackId: 2, x: 0, w: 260, name: "vocals_dbl.wav" },
    { id: 3, trackId: 3, x: 0, w: 400, name: "drum_break.wav" },
    { id: 4, trackId: 4, x: 120, w: 280, name: "sub_bass.wav" },
    { id: 5, trackId: 5, x: 240, w: 160, name: "gtr_riff.wav" },
  ]);

  const [selectedClip, setSelectedClip] = useState(1);
  const [selectedFile, setSelectedFile] = useState(0);

  // Playhead
  useEffect(() => {
    let af: number; let last: number;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const dt = (ts - last) / 1000; last = ts;
      if (isPlaying && containerRef.current) {
        const w = containerRef.current.offsetWidth;
        let x = playheadX.get() + 100 * dt;
        if (x >= w) x = 0;
        playheadX.set(x); setTime(x / 100);
        af = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) af = requestAnimationFrame(tick);
    return () => { if (af) cancelAnimationFrame(af); };
  }, [isPlaying, playheadX]);

  const fmt = (t: number) => {
    const m = Math.floor(t / 60), s = Math.floor(t % 60), ms = Math.floor((t % 1) * 100);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(ms).padStart(2,"0")}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-16 max-w-6xl mx-auto relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-violet-600/20 rounded-xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
      <div className="relative bg-[#0f0f12] rounded-xl border border-[#27272a] overflow-hidden shadow-2xl">

        {/* Menu Bar */}
        <div className="h-7 bg-[#141418] border-b border-[#27272a] flex items-center px-3 justify-between select-none">
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-zinc-500 hover:text-zinc-300 cursor-pointer">File</span>
            <span className="text-[9px] text-zinc-500 hover:text-zinc-300 cursor-pointer">Edit</span>
            <span className="text-[9px] text-zinc-500 hover:text-zinc-300 cursor-pointer">View</span>
          </div>
          <div className="flex items-center gap-0">
            {(["arsenal", "timeline", "audition"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1 text-[10px] font-medium capitalize transition-all relative",
                  activeTab === tab
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#4080f0] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Upload size={10} className="text-zinc-500 hover:text-zinc-300 cursor-pointer" />
          </div>
        </div>

        {/* Title Bar */}
        <div className="h-9 bg-[#18181b] border-b border-[#27272a] flex items-center px-4 justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff5f57]"/><div className="w-3 h-3 rounded-full bg-[#febc2e]"/><div className="w-3 h-3 rounded-full bg-[#28c840]"/></div>
            <span className="text-[10px] text-zinc-500 font-mono">Aestra</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button onClick={() => setIsRecording(!isRecording)} className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px]", isRecording ? "bg-red-500 text-white animate-pulse" : "text-zinc-500 hover:text-white")}>●</button>
              <button onClick={() => { setIsPlaying(false); playheadX.set(0); setTime(0); }} className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-zinc-500 hover:text-white">■</button>
              <button onClick={() => setIsPlaying(!isPlaying)} className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px]", isPlaying ? "text-blue-400" : "text-zinc-500 hover:text-white")}>{isPlaying ? "❚❚" : "▶"}</button>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <span>{fmt(time)}</span><span className="text-zinc-600">|</span>
              <input value={bpm} onChange={e => /^[0-9]*\.?[0-9]*$/.test(e.target.value) && setBpm(e.target.value)} className="w-10 text-right bg-transparent text-zinc-300 outline-none" /><span className="text-zinc-500">BPM</span>
              <span className="text-zinc-600">|</span><span>4/4</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-600 flex items-center gap-1"><Layers size={10}/><span>Snap</span></div>
        </div>

        {/* === Tab Content === */}
        {activeTab === "arsenal" && (
          <div className="h-[420px] flex items-center justify-center bg-[#0a0a0e]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Disc size={20} className="text-violet-400" />
                <span className="text-sm font-medium text-white">Arsenal</span>
              </div>
              <p className="text-[10px] text-zinc-500 max-w-xs">Pattern-based units. Synth engines, samplers, and drum machines arranged in a grid.</p>
              <div className="mt-4 grid grid-cols-4 gap-1.5 max-w-xs mx-auto">
                {["808 Sub", "Hi-Hats", "Clap", "Snare", "Keys", "Pads", "Vox", "FX"].map((name, i) => (
                  <div key={i} className="bg-[#121214] border border-[#27272a] rounded px-2 py-1.5 text-center">
                    <div className="text-[7px] text-zinc-500 mb-0.5">{["Synth", "Drums", "Drums", "Drums", "Synth", "Synth", "Audio", "Audio"][i]}</div>
                    <div className="text-[9px] text-white font-medium">{name}</div>
                    <div className="mt-1 h-1 rounded-full bg-[#1a1a1e] overflow-hidden">
                      <div className="h-full rounded-full bg-violet-500/60" style={{ width: `${30 + i * 8}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
        <div className="flex h-[420px]">
          {/* File Browser */}
          <div className="w-[170px] bg-[#121214] border-r border-[#27272a] flex flex-col shrink-0">
            <div className="flex border-b border-[#27272a]">
              <button className="flex-1 py-1.5 text-[10px] font-medium text-white bg-[#1a1a2e]">Files</button>
              <button className="flex-1 py-1.5 text-[10px] font-medium text-zinc-500">Plugins</button>
            </div>
            <div className="p-2">
              <div className="flex items-center bg-[#18181b] rounded px-2 py-1 border border-[#27272a]">
                <Search size={10} className="text-zinc-500 mr-1.5"/>
                <input placeholder="Search files..." className="bg-transparent text-[10px] text-zinc-300 outline-none w-full placeholder-zinc-600"/>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-1">
              {files.map((f, i) => (
                <div key={i} onClick={() => setSelectedFile(i)} className={cn("flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer mb-0.5", selectedFile === i ? "bg-[#2040a0]/30 text-white" : "text-zinc-400 hover:bg-white/5")}>
                  <FileText size={10} className="shrink-0 text-zinc-500"/>
                  <div className="min-w-0 flex-1"><div className="text-[10px] truncate">{f.name}</div><div className="text-[8px] text-zinc-600">{f.size}</div></div>
                </div>
              ))}
            </div>
            <div className="h-14 border-t border-[#27272a] p-2 bg-[#09090b]">
              <div className="text-[9px] text-zinc-400 mb-1 truncate">{files[selectedFile]?.name}</div>
              <div className="h-6 bg-[#121214] rounded flex items-center px-1">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none"><polyline points="0,10 5,7 10,13 15,4 20,16 25,6 30,14 35,9 40,17 45,5 50,13 55,10 60,16 65,7 70,12 75,5 80,15 85,8 90,11 95,9 100,10" fill="none" stroke="#4080f0" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/></svg>
                <div className="w-3 h-3 rounded-full bg-[#27272a] flex items-center justify-center ml-1 shrink-0"><Play size={6} className="text-white ml-px"/></div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-2.5 flex border-b border-[#27272a]">
              {tracks.map((t) => <div key={t.id} className="flex-1" style={{ background: t.hex, opacity: 0.7 }}/>)}
            </div>
            <div ref={containerRef} className="flex-1 relative bg-[#0a0a0e] overflow-hidden" onClick={() => setSelectedClip(0)}>
              {tracks.map((t, i) => <div key={t.id} className="absolute left-0 right-0" style={{ top: i * TRACK_H, height: TRACK_H }}>
                <div className="h-[3px]" style={{ background: t.hex }} />
                <div className="flex-1" style={{ height: TRACK_H - 3, background: i % 2 === 0 ? "rgba(255,255,255,0.008)" : "transparent", borderBottom: "1px solid #15151a" }} />
              </div>)}
              <div className="absolute inset-0 flex pointer-events-none">{[...Array(20)].map((_, j) => <div key={j} className="flex-1" style={{ borderRight: `1px solid ${j % 4 === 0 ? "#1f1f28" : "#131316"}` }}/>)}</div>
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="relative w-full h-full" ref={timelineRef}>
                  {clips.map(clip => {
                    const ti = tracks.findIndex(t => t.id === clip.trackId);
                    if (ti === -1) return null;
                    return (
                      <motion.div key={clip.id} drag dragMomentum={false} dragElastic={0} dragConstraints={timelineRef}
                        onPointerDown={e => { e.stopPropagation(); setSelectedClip(clip.id); }}
                        animate={{ x: clip.x, y: ti * TRACK_H + 2, zIndex: selectedClip === clip.id ? 50 : 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn("absolute overflow-hidden cursor-grab", selectedClip === clip.id ? "ring-1 ring-white/40" : "")}
                        style={{ height: TRACK_H - 4, width: clip.w, left: 0, top: 0, touchAction: "none", background: "#22273a", border: "1px solid #2a2f42" }}
                        whileDrag={{ cursor: "grabbing", zIndex: 100, scale: 1.01 }}
                      >
                        <span className="absolute top-1 left-1.5 text-[7px] font-medium text-white/80 truncate z-10 max-w-[80%]">{clip.name}</span>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <defs><clipPath id={`wf-${clip.id}`}><rect x="0" y="0" width="100" height="40"/></clipPath></defs>
                          <g clipPath={`url(#wf-${clip.id})`}>
                            {Array.from({length: 50}, (_, i) => {
                              const x = (i / 49) * 100;
                              const amp = 12 + Math.sin(i * 0.6 + clip.id * 2) * 8 * Math.cos(i * 0.25 + clip.id);
                              return <rect key={i} x={x - 0.8} y={20 - amp} width={1.6} height={amp * 2} fill="#a8c8ff" opacity={0.35} />;
                            })}
                          </g>
                        </svg>
                      </motion.div>
                    );
                  })}
                  <motion.div className="absolute top-0 bottom-0 w-px bg-white z-50 pointer-events-none" style={{ x: playheadX }}>
                    <div className="absolute -top-0.5 -translate-x-1/2"><svg width="9" height="7" viewBox="0 0 9 7"><path d="M0 0H9V3.5L4.5 7L0 3.5Z" fill="#22c55e"/></svg></div>
                    <div className="absolute inset-0 bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" style={{ width: 1 }}/>
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="h-5 bg-[#121214] border-t border-[#27272a] flex items-center px-3"><span className="text-[8px] font-bold text-zinc-500 tracking-wider">MIXER</span></div>
            <div className="h-[130px] bg-[#0f0f12] border-t border-[#27272a] flex">
              {tracks.map(t => (
                <div key={t.id} className="flex-1 border-r border-[#1a1a1e] flex flex-col items-center py-1.5 px-1">
                  <div className="text-[7px] font-medium text-white truncate w-full text-center mb-0.5">{t.name}</div>
                  {t.route && <div className="text-[6px] text-zinc-500 mb-0.5">{t.route}</div>}
                  <div className="flex gap-0.5 mb-1.5">
                    <div className="w-3.5 h-2.5 rounded-[2px] text-[6px] font-bold border border-[#27272a] text-zinc-500 flex items-center justify-center">M</div>
                    <div className="w-3.5 h-2.5 rounded-[2px] text-[6px] font-bold border border-[#27272a] text-zinc-500 flex items-center justify-center">S</div>
                    <div className="w-3.5 h-2.5 rounded-[2px] text-[6px] font-bold border border-[#27272a] text-zinc-500 flex items-center justify-center">R</div>
                  </div>
                  <div className="flex gap-1 flex-1 w-full justify-center">
                    <div className="text-[6px] text-zinc-500 font-mono self-end mb-px">{t.db}</div>
                    <div className="w-1.5 h-full bg-[#1a1a1e] rounded-sm relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 rounded-sm" style={{ height: `\${t.meter}%`, background: t.meter > 30 ? `linear-gradient(to top, \${t.hex}, \${t.hex}aa)` : "#3f3f46" }}/>
                    </div>
                    <div className="w-2.5 h-full bg-[#1a1a1e] rounded-sm relative flex flex-col justify-end items-center">
                      <div className="w-2 h-3 bg-white rounded-sm shadow-sm" style={{ marginBottom: "35%" }}/>
                    </div>
                  </div>
                  <div className="text-[6px] text-zinc-500 font-mono mt-px">0.0</div>
                  <div className="text-[6px] text-zinc-600">{t.id}</div>
                </div>
              ))}
              <div className="w-[50px] bg-[#121214] border-l border-[#27272a] flex flex-col items-center py-1.5 px-1">
                <div className="text-[7px] font-bold text-white mb-0.5">MASTER</div>
                <div className="flex gap-0.5 mb-1.5">
                  <div className="w-3.5 h-2.5 rounded-[2px] text-[6px] font-bold border border-[#27272a] text-zinc-500 flex items-center justify-center">M</div>
                  <div className="w-3.5 h-2.5 rounded-[2px] text-[6px] font-bold border border-[#27272a] text-zinc-500 flex items-center justify-center">S</div>
                </div>
                <div className="flex gap-1 flex-1 w-full justify-center">
                  <div className="text-[6px] text-zinc-500 font-mono self-end mb-px">-6.0</div>
                  <div className="w-2 h-full bg-[#1a1a1e] rounded-sm relative overflow-hidden"><div className="absolute bottom-0 left-0 right-0 rounded-sm" style={{ height: "75%", background: "linear-gradient(to top, #f0c030, #f08030)" }}/></div>
                  <div className="w-2.5 h-full bg-[#1a1a1e] rounded-sm relative flex flex-col justify-end items-center"><div className="w-2 h-3 bg-white rounded-sm shadow-sm" style={{ marginBottom: "25%" }}/></div>
                </div>
                <div className="text-[6px] text-zinc-500 font-mono mt-px">0.0</div>
              </div>
            </div>
          </div>

          {/* Inspector */}
          <div className="w-[200px] bg-[#121214] border-l border-[#27272a] flex flex-col shrink-0">
            <div className="flex border-b border-[#27272a]">
              <button className="flex-1 py-1.5 text-[9px] font-medium text-zinc-500">Inserts</button>
              <button className="flex-1 py-1.5 text-[9px] font-medium text-white bg-[#1a1a2e]">Sends</button>
              <button className="flex-1 py-1.5 text-[9px] font-medium text-zinc-500">I/O</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
              <div><div className="text-[8px] text-zinc-500 mb-0.5">TRACK</div><div className="text-[10px] text-white font-medium">Track 1</div><div className="text-[8px] text-zinc-500">1 send active</div></div>
              <div><div className="text-[9px] text-white font-medium mb-1">Main Output</div><div className="text-[7px] text-zinc-500 mb-1.5">Choose where the main audible path goes.</div><div className="flex items-center justify-between bg-[#18181b] rounded px-2 py-1.5 border border-[#27272a]"><span className="text-[9px] text-white">Master</span><ChevronRight size={10} className="text-zinc-500"/></div></div>
              <div><div className="text-[9px] text-white font-medium mb-1">Route Map</div><div className="bg-[#09090b] rounded p-2 border border-[#1a1a1e]"><div className="flex items-center justify-between mb-1"><span className="text-[8px] text-white">Track 1</span><div className="flex-1 mx-2 border-t border-dashed border-zinc-700"/><span className="text-[8px] text-white">Master</span></div><div className="text-[7px] text-zinc-500">Out Master</div><div className="text-[7px] text-violet-400">S1 → Track 2</div></div></div>
              <div>
                <div className="flex items-center justify-between mb-1"><span className="text-[9px] text-white font-medium">Send 1</span><span className="text-[8px] text-zinc-400">0.0 dB</span></div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1e] border border-[#27272a] relative"><div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#4080f0] rounded-full"/></div>
                  <div className="flex-1"><div className="text-[7px] text-zinc-500 mb-0.5">Destination</div><div className="bg-[#18181b] rounded px-2 py-1 border border-[#27272a] text-[9px] text-white">Track 2</div></div>
                </div>
                <div className="flex gap-1.5 mb-1.5">
                  <div className="flex-1"><div className="text-[7px] text-zinc-500 mb-0.5">Tap</div><div className="flex gap-1"><button className="flex-1 py-0.5 rounded text-[7px] bg-[#1a1a1e] text-zinc-500 border border-[#27272a]">Pre</button><button className="flex-1 py-0.5 rounded text-[7px] bg-[#4080f0]/20 text-[#4080f0] border border-[#4080f0]/30">Post</button></div></div>
                  <div className="flex-1"><div className="text-[7px] text-zinc-500 mb-0.5">Type</div><div className="flex gap-1"><button className="flex-1 py-0.5 rounded text-[7px] bg-[#4080f0]/20 text-[#4080f0] border border-[#4080f0]/30">Audio</button><button className="flex-1 py-0.5 rounded text-[7px] bg-[#1a1a1e] text-zinc-500 border border-[#27272a]">SC</button></div></div>
                </div>
                <button className="w-full py-1 rounded text-[8px] text-zinc-400 bg-[#1a1a1e] border border-[#27272a] hover:border-zinc-600 transition-colors">+ Add Send</button>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === "audition" && (
          <div className="h-[420px] bg-[#0a0a0e] flex flex-col">
            {/* Audition Header */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Play size={24} className="text-violet-400 ml-1" />
                </div>
                <div className="text-sm font-medium text-white mb-1">[EUPHORIA] 12-25-2026 - INTRO</div>
                <div className="text-[10px] text-zinc-500 mb-4">currentsuspect · Echoes and Euphoria · Spotify preset</div>
                {/* Waveform */}
                <div className="h-12 bg-[#121214] rounded-lg border border-[#27272a] mx-8 mb-4 flex items-center px-3">
                  <svg className="w-full h-8" viewBox="0 0 200 30" preserveAspectRatio="none">
                    <polyline points={Array.from({length:100}, (_, i) => `${(i/99)*200},${15+Math.sin(i*0.15)*10*Math.cos(i*0.08+1)}`).join(" ")} fill="none" stroke="#8b5cf6" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
                {/* Progress */}
                <div className="mx-8 mb-4">
                  <div className="h-1 bg-[#27272a] rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-violet-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[8px] text-zinc-500 mt-1">
                    <span>1:24</span><span>3:42</span>
                  </div>
                </div>
                {/* Transport */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button className="text-zinc-500 hover:text-white text-[10px]">⏮</button>
                  <button className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">▶</button>
                  <button className="text-zinc-500 hover:text-white text-[10px]">⏭</button>
                </div>
                {/* DSP Presets */}
                <div className="flex items-center justify-center gap-2">
                  {["Studio", "Spotify", "AirPods", "Car"].map((preset, i) => (
                    <button key={i} className={cn("px-2.5 py-1 rounded text-[8px] border", i === 1 ? "bg-violet-600/20 text-violet-300 border-violet-500/30" : "bg-[#121214] text-zinc-500 border-[#27272a] hover:border-zinc-600")}>
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Queue */}
            <div className="h-20 border-t border-[#27272a] bg-[#121214] px-4 py-2">
              <div className="text-[8px] text-zinc-500 mb-1.5">QUEUE</div>
              <div className="flex gap-2 overflow-x-auto">
                {["[EUPHORIA] 12-25-2026 - INTRO", "Echoes - Interlude", "Euphoria pt. II", "Outro (Dec 25)"].map((track, i) => (
                  <div key={i} className={cn("shrink-0 px-3 py-1.5 rounded text-[9px] border", i === 0 ? "bg-violet-600/10 text-violet-300 border-violet-500/20" : "bg-[#18181b] text-zinc-400 border-[#27272a]")}>
                    {track}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

const Hero = ({ setPage }: any) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Badge variant="outline">v1 Beta — December 2026</Badge>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          The DAW for those who <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
            live inside the audio.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Brutally optimized for speed and flow state. <br className="hidden md:block" />
          No bloat. Instant startup. Pure signal.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" onClick={() => setPage("download")} icon={Download}>
            Download Free
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setPage("features")}>
            Explore Features <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Render the Detailed Mock Timeline */}
      <MockTimeline />
      
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-6 rounded-2xl bg-[#121214] border border-[#27272a] hover:border-violet-500/50 transition-colors group"
  >
    <div className="w-12 h-12 rounded-lg bg-violet-900/10 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Features = () => (
  <section className="py-32 px-6 bg-[#09090b]">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Engineered for <span className="text-violet-500">Flow State</span></h2>
        <p className="text-xl text-zinc-400 max-w-2xl">
          We stripped away the clutter found in traditional DAWs. 
          Aestra gives you exactly what you need to create, mix, and ship.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Cpu} 
          title="Brutally Optimized"
          description="Built in C++17 with a 64-bit multi-threaded audio engine. Runs on a 5-year-old laptop. We optimize for the hardware you actually have, not the hardware you wish you had."
          delay={0}
        />
        <FeatureCard 
          icon={Zap} 
          title="Instant Startup"
          description="No scanning plugins on every launch. No splash screens. Open Aestra and you're making music."
          delay={0.1}
        />
        <FeatureCard 
          icon={Layers} 
          title="Pattern-First Workflow" 
          description="Built for hip-hop and electronic production. Patterns, clips, and arrangements designed around how beats are actually made."
          delay={0.2}
        />
        <FeatureCard 
          icon={Sliders} 
          title="Routing Visualizer" 
          description="See your entire signal flow as an animated node graph. Color-coded connections, real-time signal indicators, and drag-to-route."
          delay={0.3}
        />
        <FeatureCard 
          icon={Terminal} 
          title="Audition Mode" 
          description="Final-listen environment with DSP presets that simulate Spotify, Apple Music, AirPods, and car speakers. Hear how your mix translates."
          delay={0.4}
        />
        <FeatureCard 
          icon={Disc} 
          title="Version Control" 
          description="Git-inspired mix versioning with musical names. Create Takes, compare, and blend. Never lose a mix again."
          delay={0.5}
        />
      </div>
    </div>
  </section>
);

const FounderCountdown = () => {
  const targetDate = new Date("2026-12-12T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [spotsLeft] = useState(500);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const totalSeconds = Math.floor(diff / 1000);
      const months = Math.floor(totalSeconds / (30.44 * 24 * 3600));
      const remaining = totalSeconds - months * Math.floor(30.44 * 24 * 3600);
      const days = Math.floor(remaining / (24 * 3600));
      const hours = Math.floor((remaining % (24 * 3600)) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      setTimeLeft({ months, days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("https://formspree.io/f/xnjlaqqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "founder-waitlist" }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-5xl font-bold text-white font-mono tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );

  return (
    <section id="founder-section" className="py-32 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Limited to 500 — Founder Edition
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          Claim Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Gold Card
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-400 mb-12 max-w-xl mx-auto"
        >
          Lifetime access. Physical metal card shipped to you. Name in the app forever.
          Only 500 will ever exist.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-6 md:gap-10 mb-16"
        >
          <CountdownUnit value={timeLeft.months} label="Months" />
          <span className="text-2xl text-zinc-600 self-start mt-1">:</span>
          <CountdownUnit value={timeLeft.days} label="Days" />
          <span className="text-2xl text-zinc-600 self-start mt-1">:</span>
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <span className="text-2xl text-zinc-600 self-start mt-1">:</span>
          <CountdownUnit value={timeLeft.minutes} label="Min" />
          <span className="text-2xl text-zinc-600 self-start mt-1">:</span>
          <CountdownUnit value={timeLeft.seconds} label="Sec" />
        </motion.div>

        {/* Email form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 h-12 px-4 rounded-lg bg-[#18181b] border border-[#27272a] text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-12 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-sm hover:from-amber-400 hover:to-orange-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] disabled:opacity-50"
              >
                {submitting ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">You're on the list.</span>
              </div>
              <p className="text-zinc-500 text-sm">
                We'll email you when Founder cards open. Watch the countdown.
              </p>
            </div>
          )}
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </motion.div>

        {/* Spots counter */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-zinc-600 text-xs mt-6"
        >
          {spotsLeft} Founder cards available — 0 claimed yet
        </motion.p>
      </div>
    </section>
  );
};

const Downloads = ({ setPage }: any) => {
  const builds = [
    { os: "Source", arch: "GitHub", ver: "develop", date: "Latest", type: "Open Source", url: "https://github.com/currentsuspect/Aestra" },
    { os: "Windows", arch: "x64", ver: "CI Build", date: "Live", type: "Beta", url: "https://github.com/currentsuspect/Aestra/actions" },
    { os: "macOS", arch: "Apple Silicon", ver: "CI Build", date: "Live", type: "Beta", url: "https://github.com/currentsuspect/Aestra/actions" },
    { os: "Linux", arch: "Ubuntu/Debian", ver: "CI Build", date: "Live", type: "Beta", url: "https://github.com/currentsuspect/Aestra/actions" },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <button onClick={() => setPage("home")} className="text-zinc-400 hover:text-white mb-8 flex items-center text-sm">
        <ArrowRight className="rotate-180 mr-2 w-4 h-4" /> Back to Home
      </button>
      
      <h1 className="text-4xl font-bold text-white mb-4">Downloads</h1>
      <p className="text-zinc-400 mb-12">Aestra is in active development. Download builds from CI, or clone the source directly.</p>

      <div className="space-y-4">
        {builds.map((build, i) => (
          <Card key={i} className="p-6 flex items-center justify-between hover:border-violet-500/30 transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                 {build.os === "Windows" ? <LayoutTemplate size={20} /> : <Cpu size={20} />}
               </div>
               <div>
                 <h3 className="text-white font-medium">{build.os} <span className="text-zinc-500 text-sm">({build.arch})</span></h3>
                 <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs bg-zinc-800 text-zinc-300 px-1.5 rounded">{build.ver}</span>
                   <span className="text-xs text-zinc-500">{build.date}</span>
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
              {build.type === "Beta" && <Badge variant="outline">Beta</Badge>}
              {build.type === "Open Source" && <Badge variant="outline">Source Available</Badge>}
              <a href={build.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="secondary" icon={Download}>
                  {build.type === "Open Source" ? "View Source" : "View CI Builds"}
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Founder Waitlist CTA */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Limited to 500
        </span>
        <h3 className="text-2xl font-bold text-white mb-2">Want the Gold Card?</h3>
        <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
          Lifetime access. Physical metal card. Name in the app forever.
          Only 500 Founder cards will ever be minted.
        </p>
        <Button
          variant="primary"
          onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          Join the Waitlist
        </Button>
      </div>
    </div>
  );
};

// --- New MVP Pages ---

const Pricing = ({ setPage }: any) => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Free forever. Support if you believe.</h1>
        <p className="text-xl text-zinc-400">The full DAW is free. Always.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <Card className="p-8 border-zinc-800 flex flex-col relative">
          <div className="mb-8">
            <h3 className="text-xl font-medium text-white mb-2">Aestra Core</h3>
            <div className="text-4xl font-bold text-white mb-2">$0</div>
            <p className="text-zinc-400 text-sm">Free forever. Full DAW. No gates.</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["Full DAW — unlimited tracks", "Pattern-based workflow", "Routing visualizer", "Audition mode", "Version control (Takes)", "Basic plugins included"].map((feat, i) => (
              <li key={i} className="flex items-center text-zinc-300 text-sm">
                <Check className="w-4 h-4 text-zinc-500 mr-3" />
                {feat}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="w-full" onClick={() => setPage("download")}>Download Free</Button>
        </Card>

        {/* Paid Tier */}
        <Card className="p-8 border-violet-500/50 bg-[#121214] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
          <div className="absolute inset-0 bg-violet-500/5 pointer-events-none" />
          
          <div className="mb-8 relative z-10">
            <h3 className="text-xl font-medium text-white mb-2">Aestra Supporter</h3>
            <div className="text-4xl font-bold text-white mb-2">$5<span className="text-lg text-zinc-400">/mo</span></div>
            <p className="text-violet-300 text-sm">Support the craft. Get more.</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            {["Everything in Core", "Premium plugins (AestraRumble + more)", "Muse AI — predictive creative assistant", "Cloud storage for Takes", "Monthly sound packs", "Silver card identity"].map((feat, i) => (
              <li key={i} className="flex items-center text-white text-sm">
                <Check className="w-4 h-4 text-violet-400 mr-3" />
                {feat}
              </li>
            ))}
          </ul>
          <Button variant="primary" className="w-full relative z-10" onClick={() => setPage("changelog")}>Coming Soon — Follow Progress</Button>
        </Card>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-zinc-500 text-sm">
          Students get free Supporter access via Campus. <button className="text-violet-400 hover:underline">Contact us</button>.
        </p>
      </div>
    </div>
  );
};

const Changelog = ({ setPage }: any) => {
  const versions = [
    {
      ver: "Phase 2",
      date: "March 29, 2026",
      type: "In Progress",
      changes: [
        { type: "fix", text: "Fixed audio engine dropout on high buffer sizes (>2048 samples)." },
        { type: "fix", text: "Fixed Linux audio, transport, text rendering, and pattern browser issues." },
        { type: "fix", text: "Fixed FLAC cover art crash and audition drop safety." },
        { type: "fix", text: "Fixed timeline clip loading and UI refresh." },
        { type: "fix", text: "Fixed mixer channels not showing — ChannelSlotMap now rebuilt on addChannel." },
        { type: "fix", text: "Fixed timeline playback — AudioEngine setTransportPlaying now wired correctly." },
        { type: "ci", text: "CI: Fixed Linux, macOS, and Windows build issues (include paths, linker, MSVC)." },
        { type: "ci", text: "CI: Added AESTRA_HEADLESS mode for audio tests on headless CI runners." },
        { type: "docs", text: "Docs: Comprehensive overhaul — eliminated nomad references, fixed stale content." },
        { type: "fix", text: "Fixed UI contrast and readability; bitmap text renderer instead of SDF." }
      ]
    },
    {
      ver: "Phase 1",
      date: "Jan 1, 2026",
      type: "Complete",
      changes: [
        { type: "new", text: "Core audio engine: 64-bit multi-threaded, C++17." },
        { type: "new", text: "Pattern-based production with clip launcher." },
        { type: "new", text: "VST3 plugin hosting." },
        { type: "new", text: "VST3 + CLAP plugin hosting." }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case "new": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "fix": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "perf": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "ci": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "docs": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-white">Changelog</h1>
        <div className="flex items-center text-sm text-zinc-500">
          <Activity className="w-4 h-4 mr-2" />
          <span className="w-2 h-2 bg-violet-500 rounded-full mr-2 animate-pulse" />
          Phase 2 of 6 — Active Development
        </div>
      </div>

      <div className="relative border-l border-zinc-800 ml-3 space-y-12">
        {versions.map((release, i) => (
          <div key={i} className="relative pl-12">
            {/* Timeline Dot */}
            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-violet-600 ring-4 ring-[#09090b]" />
            
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">v{release.ver}</h2>
              <div className="flex items-center gap-3">
                 <span className="text-sm text-zinc-500 font-mono">{release.date}</span>
                 <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{release.type}</Badge>
              </div>
            </div>

            <ul className="space-y-4">
              {release.changes.map((change, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase mt-0.5", getTypeColor(change.type))}>
                    {change.type}
                  </span>
                  <span className="text-zinc-300 text-sm leading-relaxed">{change.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const Docs = ({ setPage }: any) => {
  return (
    <div className="pt-24 min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-24 bottom-0 border-r border-[#27272a] bg-[#09090b] hidden md:block overflow-y-auto">
        <div className="p-6">
          <div className="relative mb-6">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
             <input type="text" placeholder="Search manual..." className="w-full bg-[#18181b] border border-[#27272a] rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:ring-2 focus:ring-violet-500/50 focus:outline-none" />
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Getting Started</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="text-violet-400 font-medium">Introduction</button></li>
                <li><button className="text-zinc-400 hover:text-white transition-colors">Installation</button></li>
                <li><button className="text-zinc-400 hover:text-white transition-colors">Audio Setup</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Core Concepts</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="text-zinc-400 hover:text-white transition-colors">The Timeline</button></li>
                <li><button className="text-zinc-400 hover:text-white transition-colors">Mixer Routing</button></li>
                <li><button className="text-zinc-400 hover:text-white transition-colors">Automation Clips</button></li>
                <li><button className="text-zinc-400 hover:text-white transition-colors">Recording & Export</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 md:ml-64 p-8 md:p-12 max-w-4xl">
        <div className="mb-4 text-sm text-violet-400 font-medium">Getting Started / Introduction</div>
        <h1 className="text-4xl font-bold text-white mb-8">Welcome to Aestra</h1>
        
        <div className="prose prose-invert prose-violet max-w-none">
          <p className="text-lg text-zinc-300 leading-relaxed mb-6">
            Aestra is a digital audio workstation designed for speed, stability, and flow. 
            Unlike other DAWs that try to be everything to everyone, Aestra focuses purely on 
            the music creation process.
          </p>
          
          <Card className="p-6 mb-8 bg-violet-900/10 border-violet-500/20">
            <h4 className="flex items-center text-violet-300 font-bold mb-2">
              <Zap className="w-4 h-4 mr-2" /> Quick Tip
            </h4>
            <p className="text-sm text-zinc-300">
              Press <code className="bg-black/30 px-1.5 py-0.5 rounded text-white font-mono text-xs">Cmd + K</code> anywhere in the app to open the Command Palette. 
              You can access every single feature of Aestra without lifting your hands from the keyboard.
            </p>
          </Card>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Philosophy</h2>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            We believe that your tools should be invisible. When you are in the creative zone, 
            you shouldn't be fighting with windows, waiting for plugins to scan, or dealing with crashes.
          </p>
          <ul className="space-y-2 list-disc list-inside text-zinc-400 mb-8">
            <li><strong className="text-white">Performance First:</strong> Every feature is benchmarked.</li>
            <li><strong className="text-white">Linux First:</strong> Built on Arch Linux, optimized for low-spec machines.</li>
            <li><strong className="text-white">Keyboard Centric:</strong> Mouse-free workflow is a first-class citizen.</li>
          </ul>

          <div className="flex gap-4 mt-12 pt-8 border-t border-[#27272a]">
             <Button variant="secondary" className="w-full justify-between group">
               <span className="text-zinc-400">Previous: None</span>
             </Button>
             <Button variant="secondary" className="w-full justify-between group">
               <span className="text-white group-hover:text-violet-400 transition-colors">Next: Installation</span>
               <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Mock Dashboard Page ---

const Dashboard = ({ setPage }: any) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#27272a] bg-[#121214] hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-12 text-white font-bold text-xl cursor-pointer" onClick={() => setPage("home")}>
          <Music className="text-violet-500" /> Aestra
        </div>
        <div className="space-y-1">
          <button onClick={() => setActiveTab("overview")} className={cn("w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3", activeTab === "overview" ? "bg-violet-600/10 text-violet-400" : "text-zinc-400 hover:text-white")}>
            <LayoutTemplate size={16} /> Overview
          </button>
          <button onClick={() => setActiveTab("licenses")} className={cn("w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3", activeTab === "licenses" ? "bg-violet-600/10 text-violet-400" : "text-zinc-400 hover:text-white")}>
            <Shield size={16} /> Licenses
          </button>
          <button onClick={() => setActiveTab("plugins")} className={cn("w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3", activeTab === "plugins" ? "bg-violet-600/10 text-violet-400" : "text-zinc-400 hover:text-white")}>
            <Zap size={16} /> My Plugins
          </button>
          <button onClick={() => setActiveTab("support")} className={cn("w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3", activeTab === "support" ? "bg-violet-600/10 text-violet-400" : "text-zinc-400 hover:text-white")}>
            <LifeBuoy size={16} /> Support
          </button>
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#18181b] border border-[#27272a]">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
            <div className="text-xs">
              <div className="text-white">John Doe</div>
              <div className="text-zinc-500">Pro Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white capitalize">{activeTab}</h1>
            <Button size="sm" variant="outline" onClick={() => setPage("home")}>Sign Out</Button>
          </div>
          
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-zinc-400 text-sm font-medium mb-2">Active License</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Active</div>
                  <span className="text-zinc-500 text-sm">Beta</span>
                </div>
                <div className="bg-black/50 border border-dashed border-[#27272a] rounded p-3 font-mono text-zinc-300 text-sm flex justify-between items-center group cursor-pointer hover:border-violet-500/50 transition-colors">
                  <span>XXXX-XXXX-XXXX-8921</span>
                  <Check className="w-3 h-3 text-zinc-600 group-hover:text-violet-500" />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-zinc-400 text-sm font-medium mb-2">Latest Build</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white font-medium">Aestra Beta</div>
                  <div className="text-xs text-zinc-500">Released 2 days ago</div>
                </div>
                <Button className="w-full" icon={Download}>Download Installer</Button>
              </Card>

               <div className="md:col-span-2 mt-4">
                <h3 className="text-white font-medium mb-4">Installation History</h3>
                <div className="rounded-xl border border-[#27272a] overflow-hidden">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#121214] border-b border-[#27272a] last:border-0 hover:bg-[#18181b] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#18181b] flex items-center justify-center text-zinc-500"><Cpu size={14} /></div>
                        <div>
                          <div className="text-sm text-zinc-200">macOS Installer (Apple Silicon)</div>
                          <div className="text-xs text-zinc-500">v0.{9-i} • GitHub CI Build</div>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500">March {29-i}, 2026</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "plugins" && (
            <div className="text-center py-20">
               <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Zap className="text-zinc-500" />
               </div>
               <h3 className="text-white text-lg font-medium mb-2">Muse AI</h3>
               <p className="text-zinc-400 max-w-md mx-auto mb-6">
                 Predictive creative assistant — autocomplete for your music. Coming for Supporters.
               </p>
               <Badge variant="outline">Coming in v1.1</Badge>
            </div>
          )}

          {activeTab === "support" && (
             <div className="space-y-6">
               <Card className="p-6">
                 <h3 className="text-white font-medium mb-4">Open a Ticket</h3>
                 <textarea className="w-full h-32 bg-black/50 border border-[#27272a] rounded-lg p-4 text-zinc-300 focus:outline-none focus:border-violet-500 mb-4" placeholder="Describe your issue..." />
                 <Button>Submit Request</Button>
               </Card>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Footer ---

const Footer = ({ setPage }: any) => (
  <footer className="bg-[#050507] border-t border-[#27272a] py-12 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <img src="/aestra_icon.svg" alt="Aestra" className="w-6 h-6" />
          <span className="text-lg font-bold text-white">Aestra</span>
        </div>
        <p className="text-zinc-500 text-sm max-w-sm mb-6">
          The DAW for people who actually live inside their music. 
          Built by obsessed engineers for obsessed producers.
        </p>
        <div className="text-zinc-600 text-xs">
          © 2026 Dylan Makori / Aestra Studios
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-medium mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li><button onClick={() => setPage("features")} className="hover:text-violet-400">Features</button></li>
          <li><button onClick={() => setPage("pricing")} className="hover:text-violet-400">Pricing</button></li>
          <li><button onClick={() => setPage("changelog")} className="hover:text-violet-400">Changelog</button></li>
          <li><button onClick={() => setPage("download")} className="hover:text-violet-400">Download</button></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-medium mb-4">Resources</h4>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li><button onClick={() => setPage("docs")} className="hover:text-violet-400">Documentation</button></li>
          <li><button className="hover:text-violet-400">Community Forum</button></li>
          <li><a href="https://github.com/currentsuspect/Aestra" className="hover:text-violet-400">Source Code</a></li>
          <li><button className="hover:text-violet-400">Support</button></li>
        </ul>
      </div>
    </div>
  </footer>
);

// --- Main App Entry ---

const FounderBanner = ({ onDismiss }: { setPage: (p: string) => void; onDismiss: () => void }) => (
  <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-amber-500/20">
    <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
      <a
        href="#founder-section"
        className="flex items-center gap-2 text-sm text-amber-200 hover:text-white transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-medium">Only 500 Founder Gold Cards exist.</span>
        <span className="text-amber-400 underline underline-offset-2">Join the waitlist →</span>
      </a>
      <button onClick={onDismiss} className="text-amber-400/60 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const App = () => {
  const [page, setPage] = useState("home");
  const [showBanner, setShowBanner] = useState(true);

  // Scroll to top on page change
  useEffect(() => {
    // Check for hash in URL and scroll to element
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [page]);

  // Handle hash clicks (anchor links within SPA)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (target) {
        e.preventDefault();
        const hash = target.getAttribute("href");
        if (hash) {
          document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Simple Router
  const renderPage = () => {
    switch(page) {
      case "home":
        return (
          <>
            {showBanner && <FounderBanner setPage={setPage} onDismiss={() => setShowBanner(false)} />}
            <Navbar activePage="home" setPage={setPage} topOffset={showBanner ? 40 : 0} />
            <Hero setPage={setPage} />
            <Features />
            <FounderCountdown />
            <Footer setPage={setPage} />
          </>
        );
      case "features":
        return (
           <>
            <Navbar activePage="features" setPage={setPage} />
            <div className="pt-32 pb-20 px-6 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Deep Dive</h1>
              <p className="text-zinc-400">Full feature breakdown below.</p>
              <Button className="mt-8" onClick={() => setPage("home")}>Back Home</Button>
            </div>
            <Footer setPage={setPage} />
           </>
        );
      case "pricing":
        return (
          <>
            {showBanner && <FounderBanner setPage={setPage} onDismiss={() => setShowBanner(false)} />}
            <Navbar activePage="pricing" setPage={setPage} topOffset={showBanner ? 40 : 0} />
            <Pricing setPage={setPage} />
            <Footer setPage={setPage} />
          </>
        );
      case "changelog":
        return (
          <>
            {showBanner && <FounderBanner setPage={setPage} onDismiss={() => setShowBanner(false)} />}
            <Navbar activePage="changelog" setPage={setPage} topOffset={showBanner ? 40 : 0} />
            <Changelog setPage={setPage} />
            <Footer setPage={setPage} />
          </>
        );
      case "docs":
        return (
          <>
            <Navbar activePage="docs" setPage={setPage} />
            <Docs setPage={setPage} />
          </>
        );
      case "download":
        return (
          <>
            {showBanner && <FounderBanner setPage={setPage} onDismiss={() => setShowBanner(false)} />}
            <Navbar activePage="download" setPage={setPage} topOffset={showBanner ? 40 : 0} />
            <Downloads setPage={setPage} />
            <Footer setPage={setPage} />
          </>
        );
      case "login":
      case "account":
        return <Dashboard setPage={setPage} />;
      default:
        return (
          <>
            <Navbar setPage={setPage} />
            <div className="pt-40 text-center text-white">Page not found</div>
          </>
        );
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen text-zinc-100 font-sans selection:bg-violet-500/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}