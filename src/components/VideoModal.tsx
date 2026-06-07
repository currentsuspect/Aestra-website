import { useEffect, useRef } from "react";
import { X } from "lucide-react";

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

  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      const playPromise = v.play();
      if (playPromise) playPromise.catch(() => {});
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Video player"}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl">
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h3 className="text-fg text-sm font-medium tracking-tight">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto w-9 h-9 rounded-md flex items-center justify-center text-fg-muted hover:text-fg hover:bg-white/5 transition-colors"
            aria-label="Close video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-border/80 shadow-2xl">
          <video
            ref={videoRef}
            src={src}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
