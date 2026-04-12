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
  Settings
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

const Waveform = ({ seed, colorClass }: { seed: number, colorClass: string }) => {
  // Memoized points could be better for perf, but simple render for now
  const points = [];
  const steps = 40;
  for(let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      const noise = (Math.sin(i * 0.5 * seed) + Math.cos(i * 1.8 * seed) * 0.8) * (Math.random() * 0.4 + 0.6);
      const h = Math.abs(noise * 35);
      points.push(`${x},${50 - h} ${x},${50 + h}`);
  }
  
  return (
    <div className={cn("w-full h-full opacity-70 px-0.5 flex items-center", colorClass)}>
       <svg className="w-full h-4/5" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline 
             points={points.join(" ")} 
             fill="none" 
             stroke="currentColor" 
             strokeWidth="2" 
             vectorEffect="non-scaling-stroke" 
             strokeLinecap="round"
             strokeLinejoin="round"
          />
       </svg>
    </div>
  );
};

const ClipComponent = ({ 
  clip, 
  trackIndex, 
  timelineRef, 
  onDragEnd, 
  onSelect 
}: any) => {
  // We use trackIndex to calculate Y position via transform
  // This is cleaner than CSS top for Framer Motion dragging
  const yPos = trackIndex * TRACK_HEIGHT;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={timelineRef}
      onDragStart={() => onSelect(clip.id)}
      onDragEnd={(e, info) => onDragEnd(clip.id, info)}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(clip.id);
      }}
      initial={false}
      animate={{ 
        x: clip.startX,
        y: yPos,
        scale: clip.selected ? 1.02 : 1,
        zIndex: clip.selected ? 50 : 10
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "absolute",
        left: 0,
        top: 0, // Always 0, we use translate Y
        height: TRACK_HEIGHT - 4, // slight gap
        width: clip.width,
        marginTop: 2,
        cursor: "grab",
        touchAction: "none"
      }}
      whileDrag={{ cursor: "grabbing", zIndex: 100, scale: 1.05, opacity: 0.9 }}
      className={cn(
        "rounded-[4px] overflow-hidden flex flex-col select-none transition-colors border shadow-sm group",
        clip.color,
        clip.selected 
          ? "ring-2 ring-white border-transparent brightness-110" 
          : "border-black/20 brightness-95 hover:brightness-100"
      )}
    >
        {/* Clip Handle Bar */}
        <div className="h-4 bg-black/20 flex items-center justify-between px-1.5 shrink-0 backdrop-blur-sm">
            <span className="text-[9px] font-bold text-white/90 truncate max-w-[80%] drop-shadow-md">{clip.name}</span>
            <div className="flex gap-0.5">
               <div className="w-1 h-1 rounded-full bg-white/40" />
               <div className="w-1 h-1 rounded-full bg-white/40" />
            </div>
        </div>
        
        {/* Waveform */}
        <div className="flex-1 w-full relative overflow-hidden bg-black/10">
          <Waveform seed={clip.seed} colorClass={clip.text} />
        </div>
    </motion.div>
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

  // File Browser State
  const [files, setFiles] = useState([
    { name: "vocals_main_take1.wav", size: "11 MB", selected: true },
    { name: "drum_break_amen.wav", size: "15 MB", selected: false },
    { name: "sub_bass_drop.wav", size: "17 MB", selected: false },
    { name: "synth_pad_ethereal.wav", size: "13 MB", selected: false },
    { name: "gtr_riff_clean.wav", size: "12 MB", selected: false },
    { name: "fx_riser_white.wav", size: "17 MB", selected: false },
  ]);

  // Tracks State
  const [tracks, setTracks] = useState([
    { id: 1, name: "Vocals Main", color: "text-violet-400", bg: "bg-violet-500", mute: false, solo: false },
    { id: 2, name: "Vocals Dbl", color: "text-violet-400", bg: "bg-violet-500", mute: false, solo: false },
    { id: 3, name: "Drums", color: "text-cyan-400", bg: "bg-cyan-500", mute: false, solo: false },
    { id: 4, name: "Bass", color: "text-pink-400", bg: "bg-pink-500", mute: false, solo: false },
    { id: 5, name: "Guitars", color: "text-orange-400", bg: "bg-orange-500", mute: false, solo: false },
    { id: 6, name: "Synth", color: "text-blue-400", bg: "bg-blue-500", mute: false, solo: false },
  ]);

  // Clips State
  const [clips, setClips] = useState([
    { id: 101, trackId: 1, startX: 0, width: 280, name: "vocals_main.wav", selected: true, color: "bg-violet-600", text: "text-violet-100", seed: 1 },
    { id: 102, trackId: 3, startX: 0, width: 420, name: "drum_break.wav", selected: false, color: "bg-cyan-600", text: "text-cyan-100", seed: 2.3 },
    { id: 103, trackId: 4, startX: 140, width: 300, name: "sub_bass.wav", selected: false, color: "bg-pink-600", text: "text-pink-100", seed: 3.5 },
    { id: 104, trackId: 5, startX: 260, width: 180, name: "gtr_riff.wav", selected: false, color: "bg-orange-600", text: "text-orange-100", seed: 4.1 },
  ]);

  // --- Logic ---

  const toggleTrack = (id: number, field: 'mute' | 'solo', isMulti: boolean = false) => {
    setTracks(prev => {
      // Logic for Exclusive Solo
      if (field === 'solo') {
        // If holding CMD/CTRL (isMulti), we toggle the target and leave others alone
        if (isMulti) {
          return prev.map(t => t.id === id ? { ...t, solo: !t.solo } : t);
        }
        // If basic click, we solo the target and unsolo EVERYTHING else
        // If target was already soloed, we toggle it off (so no solo)
        const targetTrack = prev.find(t => t.id === id);
        const willBeSoloed = !targetTrack?.solo;
        
        return prev.map(t => ({
          ...t,
          solo: t.id === id ? willBeSoloed : false
        }));
      }
      
      // Mute is standard toggle
      return prev.map(t => t.id === id ? { ...t, [field]: !t[field] } : t);
    });
  };
  
  const handleFileClick = (index: number) => {
    setFiles(files.map((f, i) => ({ ...f, selected: i === index })));
  };

  const selectClip = (clipId: number) => {
    setClips(clips.map(c => ({ ...c, selected: c.id === clipId })));
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Check if we clicked the timeline background directly
    if (e.target === timelineRef.current || e.target === containerRef.current) {
        setClips(clips.map(c => ({ ...c, selected: false })));
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setBpm(val);
    }
  };

  const handleBpmBlur = () => {
    let num = parseFloat(bpm);
    if (isNaN(num) || num < 10 || num > 999) {
      num = 120.0;
    }
    setBpm(num.toFixed(1));
  };

  // --- Drag Logic ---
  const handleDragEnd = (id: number, info: any) => {
    if (!containerRef.current) return;

    const clip = clips.find(c => c.id === id);
    if (!clip) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Y Calculation: Relative to the container top
    const relativeY = info.point.y - containerRect.top;
    let newTrackIndex = Math.floor(relativeY / TRACK_HEIGHT);
    
    // Clamp track index
    if (newTrackIndex < 0) newTrackIndex = 0;
    if (newTrackIndex >= tracks.length) newTrackIndex = tracks.length - 1;
    const newTrackId = tracks[newTrackIndex].id;

    // X Calculation: Relative to the container left
    // We use the point x minus container left, then adjust for the grab offset
    // Ideally, Framer Motion's visual X is what we want to snap.
    // The `info.point.x` is the mouse position. The element top-left is what matters.
    // However, figuring out the element offset is tricky without complex state.
    // A simpler way with Framer: use the `x` value from the style or compute it.
    // BUT, we can just use the delta.
    
    // Approach: clip.startX + delta
    let newStartX = clip.startX + info.offset.x;
    
    // Snap
    newStartX = Math.round(newStartX / SNAP_GRID_PX) * SNAP_GRID_PX;
    if (newStartX < 0) newStartX = 0;

    // Limit max width (arbitrary for demo)
    const maxW = containerRect.width - clip.width;
    if (newStartX > maxW) newStartX = maxW;

    setClips(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, trackId: newTrackId, startX: newStartX };
      }
      return c;
    }));
  };

  // Playhead Animation
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying && containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const pixelsPerSecond = 100; // Arbitrary speed
        
        const currentX = playheadX.get();
        let newX = currentX + (pixelsPerSecond * delta);
        
        if (newX >= width) newX = 0;
        
        playheadX.set(newX);
        setTime(newX / pixelsPerSecond);
        
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, playheadX]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    const ms = Math.floor((t % 1) * 100).toString().padStart(2, '0');
    return `${m}:${s}.${ms}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16 max-w-[1200px] mx-auto relative group z-20"
    >
      <div className="absolute -inset-2 bg-violet-600/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
      
      <div className="relative rounded-xl border border-[#27272a] bg-[#09090b] shadow-2xl flex flex-col h-[600px] overflow-hidden">
         
         {/* TOP TOOLBAR */}
         <div className="h-14 border-b border-[#27272a] bg-[#121214] flex items-center px-4 gap-6 shrink-0 z-30">
            {/* Transport */}
            <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-lg border border-[#27272a]">
               <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn("w-8 h-8 flex items-center justify-center rounded transition-colors", isPlaying ? "text-green-400 bg-green-400/10" : "text-zinc-400 hover:text-white hover:bg-white/5")}
               >
                 <Play size={16} fill={isPlaying ? "currentColor" : "none"} />
               </button>
               <button 
                onClick={() => { setIsPlaying(false); setTime(0); playheadX.set(0); }}
                className="w-8 h-8 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
               >
                 <Square size={14} fill="currentColor" />
               </button>
               <button 
                onClick={() => setIsRecording(!isRecording)}
                className={cn("w-8 h-8 flex items-center justify-center rounded transition-colors relative", isRecording ? "text-red-500 bg-red-500/10" : "text-zinc-400 hover:text-white hover:bg-white/5")}
               >
                 <Circle size={14} className={cn(isRecording && "fill-red-500")} />
               </button>
            </div>

            {/* Time Display */}
            <div className="flex flex-col items-center justify-center w-32">
               <span className="font-mono text-2xl text-green-500 font-medium tracking-tight leading-none">{formatTime(time)}</span>
               <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">Timecode</span>
            </div>

            {/* BPM Display */}
            <div className="flex flex-col items-center justify-center group relative">
                <input 
                  type="text"
                  inputMode="decimal"
                  value={bpm}
                  onChange={handleBpmChange}
                  onBlur={handleBpmBlur}
                  onFocus={(e) => e.target.select()}
                  className="bg-transparent text-zinc-200 font-bold text-xl w-20 text-center focus:outline-none focus:text-white focus:bg-[#27272a] rounded transition-colors leading-none py-0.5"
                />
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider group-hover:text-zinc-500 transition-colors">BPM</span>
            </div>

            <div className="w-px h-8 bg-[#27272a] mx-2" />

            {/* Tools */}
            <div className="flex items-center gap-2">
               <Button size="sm" variant="secondary" className="h-8 w-8 p-0" icon={Search} />
               <Button size="sm" variant="secondary" className="h-8 w-8 p-0" icon={Settings} />
            </div>

            {/* Meter */}
            <div className="ml-auto flex items-end gap-1 h-8 py-1">
                {[1, 0.8, 0.4, 0.6, 0.9, 0.2].map((h, i) => (
                    <div key={i} className="w-1.5 bg-zinc-800 rounded-sm h-full flex items-end overflow-hidden">
                        <div 
                          className={cn("w-full transition-all duration-75", i > 3 ? "bg-red-500" : "bg-green-500")} 
                          style={{ height: isPlaying ? `${h * 100}%` : '5%' }} 
                        />
                    </div>
                ))}
            </div>
         </div>

         {/* MAIN CONTENT AREA */}
         <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar: Browser */}
            <div className="w-48 bg-[#0c0c0e] border-r border-[#27272a] flex flex-col text-xs shrink-0 z-20">
               <div className="p-3 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Browser</div>
               <div className="flex-1 overflow-y-auto space-y-0.5 p-2">
                 <div className="px-2 py-1.5 text-zinc-400 flex items-center gap-2 font-medium mb-1">
                   <Folder size={12} className="text-violet-500" /> Samples
                 </div>
                 {files.map((file, i) => (
                   <div 
                    key={i} 
                    onClick={() => handleFileClick(i)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors truncate",
                      file.selected ? "bg-violet-600/20 text-violet-200" : "text-zinc-500 hover:text-zinc-300 hover:bg-[#27272a]"
                    )}
                   >
                     <FileText size={12} className="shrink-0 opacity-70" />
                     <span className="truncate">{file.name}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Timeline Wrapper */}
            <div className="flex-1 flex flex-col relative min-w-0 bg-[#09090b]">
               
               {/* Ruler Row */}
               <div className="h-8 border-b border-[#27272a] bg-[#121214] flex shrink-0">
                  {/* Ruler Header Offset */}
                  <div className="shrink-0 border-r border-[#27272a] bg-[#18181b] flex items-center justify-center" style={{ width: HEADER_WIDTH }}>
                     <Sliders size={12} className="text-zinc-600" />
                  </div>
                  {/* Ruler Ticks */}
                  <div className="flex-1 relative overflow-hidden select-none">
                     <div className="absolute inset-0 flex items-end">
                       {[...Array(40)].map((_, i) => (
                         <div key={i} className="flex-1 border-l border-[#27272a] h-full flex flex-col justify-end pl-1 pb-0.5 text-[9px] text-zinc-600 font-mono">
                           <span className="opacity-50">{i + 1}</span>
                           <div className="flex justify-between w-full h-1 mt-0.5 opacity-30">
                              <div className="w-px h-full bg-zinc-500" />
                              <div className="w-px h-full bg-zinc-800" />
                              <div className="w-px h-full bg-zinc-800" />
                              <div className="w-px h-full bg-zinc-800" />
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
               </div>

               {/* Tracks & Clips Area */}
               <div className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#0a0a0c]" onClick={handleBackgroundClick}>
                  
                  {/* Tracks Container */}
                  <div className="relative min-h-full" ref={containerRef}>
                      
                      {/* Grid / Rows */}
                      {tracks.map((track, i) => (
                        <div key={track.id} className="flex border-b border-[#27272a] bg-[#0a0a0c] relative group" style={{ height: TRACK_HEIGHT }}>
                           
                           {/* Track Header */}
                           <div className="shrink-0 border-r border-[#27272a] bg-[#121214] p-2 flex flex-col justify-between group-hover:bg-[#151518] transition-colors z-20 relative shadow-[2px_0_5px_rgba(0,0,0,0.2)]" style={{ width: HEADER_WIDTH }}>
                              <div className="flex items-center gap-2 mb-1">
                                 <div className={cn("w-1 h-8 rounded-sm", track.bg)} />
                                 <div className="overflow-hidden">
                                    <div className={cn("font-bold text-xs truncate", track.color)}>{track.name}</div>
                                    <div className="text-[9px] text-zinc-600 flex gap-2">
                                       <span>Vol: -0.2dB</span>
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="flex gap-1.5 mt-auto">
                                 <button 
                                   onClick={(e) => toggleTrack(track.id, 'mute')}
                                   className={cn(
                                     "flex-1 h-5 rounded flex items-center justify-center text-[9px] font-bold border transition-colors uppercase",
                                     track.mute ? "bg-red-500/20 text-red-500 border-red-500/50" : "bg-[#09090b] text-zinc-600 border-[#27272a] hover:text-zinc-400"
                                   )}
                                 >M</button>
                                 <button 
                                   onClick={(e) => toggleTrack(track.id, 'solo', e.ctrlKey || e.metaKey)}
                                   className={cn(
                                     "flex-1 h-5 rounded flex items-center justify-center text-[9px] font-bold border transition-colors uppercase",
                                     track.solo ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" : "bg-[#09090b] text-zinc-600 border-[#27272a] hover:text-zinc-400"
                                   )}
                                   title="Click to Solo (Exclusive). Cmd+Click to add."
                                 >S</button>
                                 <div className="w-5 h-5 rounded bg-[#09090b] border border-[#27272a] flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                 </div>
                              </div>
                           </div>

                           {/* Lane Background */}
                           <div className="flex-1 relative">
                              {/* Grid lines */}
                              <div className="absolute inset-0 flex pointer-events-none">
                                {[...Array(20)].map((_, j) => (
                                  <div key={j} className={cn("flex-1 border-r border-[#27272a]", j % 4 === 0 ? "border-opacity-40" : "border-opacity-10")} />
                                ))}
                              </div>
                           </div>
                        </div>
                      ))}

                      {/* CLIPS LAYER */}
                      {/* This sits absolutely on top of the track rows, shifted right by HEADER_WIDTH */}
                      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" style={{ left: HEADER_WIDTH }}>
                          {/* We make this container pointer-events-auto ONLY for its children (clips) generally, 
                              but since we want drag, we usually put pointer-events-auto on the clip itself. 
                              The container should pass through clicks to the background if empty.
                          */}
                          <div className="relative w-full h-full" ref={timelineRef}>
                            {clips.map((clip) => {
                              const trackIndex = tracks.findIndex(t => t.id === clip.trackId);
                              if (trackIndex === -1) return null;
                              return (
                                <ClipComponent 
                                  key={clip.id}
                                  clip={clip}
                                  trackIndex={trackIndex}
                                  timelineRef={timelineRef}
                                  onDragEnd={handleDragEnd}
                                  onSelect={selectClip}
                                />
                              );
                            })}
                            
                            {/* Playhead Line (Within the timeline area) */}
                            <motion.div 
                              className="absolute top-0 bottom-0 w-px bg-white z-50 pointer-events-none"
                              style={{ x: playheadX }}
                            >
                               <div className="absolute -top-1 -translate-x-1/2 text-white">
                                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                                     <path d="M0.5 0.5H10.5V5.5L5.5 10.5L0.5 5.5V0.5Z" fill="#22c55e" stroke="#22c55e" />
                                  </svg>
                               </div>
                               <div className="absolute inset-0 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            </motion.div>
                          </div>
                      </div>

                  </div>
               </div>
            </div>
         </div>
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