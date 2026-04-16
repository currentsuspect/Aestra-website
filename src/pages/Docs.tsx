import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { BookOpen, Terminal, ChevronRight, LifeBuoy, FileText, ArrowRight, Search, Zap } from "lucide-react";
import { cn } from "../lib";
import { Button, Card } from "../components/ui";

export const Docs = memo(({ setPage }: any) => {
  return (
    <div className="pt-24 min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-24 bottom-0 border-r border-[#2d3444] bg-[#0e121a] hidden md:block overflow-y-auto">
        <div className="p-6">
          <div className="relative mb-6">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
             <input type="text" placeholder="Search manual..." aria-label="Search documentation" className="w-full bg-[#151a24] border border-[#30384a] rounded-[12px] py-2 pl-9 pr-4 text-sm text-white focus:ring-2 focus:ring-[#61d5ff]/40 focus:outline-none" />
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-[#79839b] uppercase tracking-wider mb-3">Getting Started</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="text-[#61d5ff] font-medium bg-[#61d5ff]/10 rounded-full px-3 py-1">Introduction</button></li>
                <li><button className="text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e] rounded-full px-3 py-1 transition-colors">Installation</button></li>
                <li><button className="text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e] rounded-full px-3 py-1 transition-colors">Audio Setup</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#79839b] uppercase tracking-wider mb-3">Core Concepts</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e] rounded-full px-3 py-1 transition-colors">The Timeline</button></li>
                <li><button className="text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e] rounded-full px-3 py-1 transition-colors">Mixer Routing</button></li>
                <li><button className="text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e] rounded-full px-3 py-1 transition-colors">Automation Clips</button></li>
                <li><button className="text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e] rounded-full px-3 py-1 transition-colors">Recording & Export</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 md:ml-64 p-4 sm:p-8 md:p-12 max-w-4xl">
        <div className="mb-4 text-sm text-[#61d5ff] font-medium">Getting Started / Introduction</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-6 sm:mb-8">Welcome to Aestra</h1>
        
        <div className="prose prose-invert prose-violet max-w-none">
            <p className="text-lg text-[#d4dae8] leading-relaxed mb-6">
            Aestra is a DAW that gets out of your way. Fast startup, low memory, no bloat — 
            built for producers who want to make music, not manage software.
          </p>
          
          <Card className="p-6 mb-8 bg-[#61d5ff]/5">
            <h4 className="flex items-center text-[#61d5ff] font-bold mb-2">
              <Zap className="w-4 h-4 mr-2" /> Quick Tip
            </h4>
            <p className="text-sm text-[#d2d8e6]">
              Press <code className="bg-black/30 px-1.5 py-0.5 rounded text-white font-mono text-xs">Ctrl + K</code> anywhere in the app to open the Command Palette. 
              Every feature, one shortcut. Hands never leave the keyboard.
            </p>
          </Card>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Philosophy</h2>
          <p className="text-[#98a1b7] mb-4 leading-relaxed">
            Your tools should be invisible. When you're in the zone, you shouldn't be fighting windows, waiting for scans, or dealing with crashes.
          </p>
          <ul className="space-y-2 list-disc list-inside text-[#98a1b7] mb-8">
            <li><strong className="text-white">Performance First:</strong> Every feature is benchmarked.</li>
            <li><strong className="text-white">Linux First:</strong> Built on Arch Linux, optimized for low-spec machines.</li>
            <li><strong className="text-white">Keyboard Centric:</strong> Mouse-free workflow is a first-class citizen.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Building from Source</h2>
          <p className="text-[#98a1b7] mb-4 leading-relaxed">
            Aestra is built with CMake. You need a C++17 compiler, CMake 3.22+, and the dependencies listed below.
          </p>
          <Card className="p-4 mb-6 bg-[#151a24] border border-[#30384a] font-mono text-sm">
            <div className="text-[#98a1b7] mb-2"># Clone and build</div>
            <div className="text-white">git clone --recursive https://github.com/currentsuspect/Aestra</div>
            <div className="text-white">cd Aestra</div>
            <div className="text-white">cmake -S . -B build -DAestra_CORE_MODE=ON -DCMAKE_BUILD_TYPE=Release</div>
            <div className="text-white">cmake --build build --parallel</div>
          </Card>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Dependencies</h3>
          <ul className="space-y-2 text-sm text-[#cfd5e4] mb-8">
            <li className="flex items-start gap-2"><span className="text-[#61d5ff]">›</span>SDL2 (Linux windowing, input)</li>
            <li className="flex items-start gap-2"><span className="text-[#61d5ff]">›</span>RtAudio (cross-platform audio I/O)</li>
            <li className="flex items-start gap-2"><span className="text-[#61d5ff]">›</span>FreeType (text rendering)</li>
            <li className="flex items-start gap-2"><span className="text-[#61d5ff]">›</span>miniaudio (audio decoding: MP3, FLAC)</li>
            <li className="flex items-start gap-2"><span className="text-[#61d5ff]">›</span>VST3 SDK + CLAP SDK (plugin hosting)</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Low-Memory Build</h2>
          <p className="text-[#98a1b7] mb-4 leading-relaxed">
            Building on a 4GB RAM machine? Use the lowmem preset — it disables LTO, vectorization, and limits parallel jobs.
          </p>
          <Card className="p-4 mb-6 bg-[#151a24] border border-[#30384a] font-mono text-sm">
            <div className="text-white">cmake --preset lowmem && cmake --build --preset lowmem-release</div>
          </Card>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Running Tests</h2>
          <Card className="p-4 mb-8 bg-[#151a24] border border-[#30384a] font-mono text-sm">
            <div className="text-white">ctest --test-dir build --output-on-failure</div>
          </Card>

          <div className="flex gap-4 mt-12 pt-8 border-t border-[#2f3646]">
             <Button variant="secondary" className="w-full justify-between group">
                 <span className="text-[#98a1b7]">Previous: None</span>
             </Button>
             <Button variant="secondary" className="w-full justify-between group">
                 <span className="text-white group-hover:text-[#61d5ff] transition-colors">Next: The Timeline</span>
                 <ArrowRight className="w-4 h-4 text-[#98a1b7] group-hover:text-[#61d5ff]" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
