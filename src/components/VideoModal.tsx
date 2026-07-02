import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export const VideoModal = ({
  open,
  onClose,
  src,
  title,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  title?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      const playPromise = v.play();
      if (playPromise) {
        playPromise
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && v) {
        e.preventDefault();
        if (v.paused) v.play();
        else v.pause();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (pct: number) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = pct * duration;
  };

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Video player"}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-2 px-1">
          {title && (
            <h3 className="text-fg text-sm font-medium tracking-tight">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto w-9 h-9 rounded-full flex items-center justify-center text-fg-muted hover:text-fg bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
            aria-label="Close video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative w-full flex-1 min-h-0 bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <video
            ref={videoRef}
            src={src}
            playsInline
            className="w-full h-full object-contain"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              setTime(v.currentTime);
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onClick={togglePlay}
          />

          {!playing && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Play video"
            >
              <span className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </span>
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <span className="text-white/80 text-[11px] font-mono tabular-nums shrink-0">
                {fmt(time)} / {fmt(duration)}
              </span>

              <div
                className="flex-1 h-1 rounded-full bg-white/15 cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  seek(pct);
                }}
              >
                <div
                  className="h-full rounded-full bg-accent relative"
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={enterFullscreen}
                className="w-8 h-8 rounded-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
