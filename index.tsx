import "./styles.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { 
  Download, 
  ChevronLeft,
  ChevronRight, 
  Layers, 
  Zap, 
  Music, 
  Cpu, 
  Disc, 
  Sliders, 
  Check,
  Pause,
  Play,
  Plus,
  Square,
  Circle,
  Menu,
  Minus,
  MousePointer,
  Pencil,
  Star,
  X,
  User,
  Terminal,
  ArrowRight,
  LayoutTemplate,
  FileText,
  Search,
  Scissors,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [bpm, setBpm] = useState("120.0");
  const [activeTab, setActiveTab] = useState<"arsenal" | "timeline" | "audition">("timeline");
  const [timelineView, setTimelineView] = useState<"arrangement" | "mixer">("arrangement");
  const [selectedFile, setSelectedFile] = useState(6);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const playheadX = useMotionValue(190);

  const files = [
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
  ];

  const tracks = [
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
  ];

  const visibleMixerTracks = tracks.slice(0, 6);
  const rulerMarks = [1, 17, 33, 49, 65];

  useEffect(() => {
    let af = 0;
    let last = 0;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      if (containerRef.current && isPlaying) {
        const maxX = containerRef.current.offsetWidth - 32;
        const next = playheadX.get() + 94 * dt;
        playheadX.set(next > maxX ? 190 : next);
        setTime((prev) => (next > maxX ? 0 : prev + dt));
        af = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [isPlaying, playheadX]);

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  const selectedTrackData = tracks[selectedTrack];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-16 max-w-[84rem] mx-auto relative"
    >
      <div className="absolute inset-x-14 -top-2 h-14 rounded-full bg-[#61d5ff]/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-[18px] border border-[#55d6ff] bg-[#101115] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <div className="h-8 border-b border-[#2c3240] bg-[#14161d] px-4 flex items-center justify-between text-[10px] text-[#c7cad4]">
          <div className="flex items-center gap-5">
            <span className="text-[#f5f6fa]">File</span>
            <span>Edit</span>
            <span>View</span>
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
                    playheadX.set(190);
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
          <div className="h-[690px] bg-[#11131a] flex items-center justify-center">
            <div className="w-[34rem] rounded-[18px] border border-[#3b4152] bg-[#1a1d27] p-8">
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
          <div className="flex h-[596px] bg-[#11131a]">
            <div className="w-[268px] border-r border-[#2d3342] bg-[#1b1e28] flex flex-col">
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

                  <motion.div className="absolute bottom-0 top-0 z-20 w-px bg-[#7a7cff]" style={{ x: playheadX }}>
                    <div className="absolute -top-12 h-12 w-px bg-[#7a7cff]" />
                    <div className="absolute bottom-0 top-0 w-px bg-[#6e73ff] shadow-[0_0_12px_rgba(122,124,255,0.8)]" />
                  </motion.div>
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
          <div className="h-[690px] bg-[#13151c] p-0">
            <div className="flex h-full flex-col">
              <div className="border-b border-[#2d3342] bg-[#232632] px-4 py-2 text-[11px] text-[#b7bece]">
                <span className="tracking-[0.18em] uppercase">Mixer</span>
              </div>
              <div className="flex min-h-0 flex-1">
                <div className="flex-1 px-3 py-4">
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
          <div className="h-[690px] bg-[#12141a] flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-[30rem] rounded-[18px] border border-[#384050] bg-[#1b1f2a] p-8 text-center">
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
