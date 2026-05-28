import React, { memo } from "react";
import { X } from "lucide-react";

interface FounderBannerProps {
  onDismiss: () => void;
}

export const FounderBanner = memo(({ onDismiss }: FounderBannerProps) => (
  <div className="fixed top-0 left-0 right-0 z-[60] min-h-[52px] bg-[linear-gradient(90deg,rgba(232,168,56,0.13),rgba(124,58,237,0.12),rgba(0,229,204,0.08))] border-b border-[#e8a838]/20 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto min-h-[52px] px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
      <a
        href="#founder-section"
        className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[#f2db8d] hover:text-white transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-medium">Only 500 Founder cards exist.</span>
        <span className="text-[#e8a838] underline underline-offset-2">Claim yours →</span>
      </a>
      <button
        onClick={onDismiss}
        className="text-[#e8a838]/60 hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
));
