import React, { memo } from "react";
import { X } from "lucide-react";

interface FounderBannerProps {
  onDismiss: () => void;
}

export const FounderBanner = memo(({ onDismiss }: FounderBannerProps) => (
  <div className="fixed top-0 left-0 right-0 z-[60] bg-[linear-gradient(90deg,rgba(232,168,56,0.16),rgba(131,66,23,0.28))] border-b border-[#e8a838]/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <a
        href="#founder-section"
        className="flex items-center gap-2 text-sm text-[#f2db8d] hover:text-white transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-medium">Only 500 were made.</span>
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
