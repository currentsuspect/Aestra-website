import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Monitor, Apple, Terminal, Globe } from "lucide-react";
import { cn } from "../lib";
import { Button, Card, Badge } from "../components/ui";

export const Downloads = ({ setPage }: any) => {
  const builds = [
    { os: "Windows", arch: "x64", icon: Monitor, type: "Beta", url: "https://github.com/currentsuspect/Aestra/actions" },
    { os: "macOS", arch: "Apple Silicon", icon: Apple, type: "Beta", url: "https://github.com/currentsuspect/Aestra/actions" },
    { os: "Linux", arch: "Ubuntu / Debian", icon: Terminal, type: "Beta", url: "https://github.com/currentsuspect/Aestra/actions" },
    { os: "Source", arch: "GitHub", icon: Globe, type: "Source", url: "https://github.com/currentsuspect/Aestra" },
  ];

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen">
      <button onClick={() => setPage("home")} className="text-[#98a1b7] hover:text-white mb-6 sm:mb-8 flex items-center text-sm">
        <ArrowRight className="rotate-180 mr-2 w-4 h-4" /> Back to Home
      </button>

      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Downloads</h1>
      <p className="text-sm sm:text-base text-[#9ca5bb] mb-8 sm:mb-12">Pre-release builds. Expect sharp edges.</p>

      <div className="space-y-3 sm:space-y-4">
        {builds.map((build, i) => {
          const Icon = build.icon;
          return (
            <Card key={i} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-11 h-11 rounded-[14px] bg-[#141a25] border border-[#384152] flex items-center justify-center text-[#61d5ff] shrink-0">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium text-sm sm:text-base">{build.os} <span className="text-[#8a94aa] text-xs sm:text-sm">({build.arch})</span></h3>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {build.type === "Beta" && <Badge variant="outline">Beta</Badge>}
                {build.type === "Source" && <Badge variant="outline">Open Source</Badge>}
                <a href={build.url} target="_blank" rel="noopener noreferrer" className="shrink-0 ml-auto sm:ml-0">
                  <Button size="sm" variant="secondary">
                    {build.type === "Source" ? "View Source" : "Get Build"}
                  </Button>
                </a>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-16 bg-[#131620] border border-[#1e2230] p-6 sm:p-8 rounded-[16px] sm:rounded-[20px] text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d9b549]/30 bg-[#d9b549]/10 text-[#f6de8d] text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d9b549] animate-pulse" />
          Limited to 500
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Some things don't get a second run.</h3>
        <p className="text-[#9ca5bb] text-sm mb-6 max-w-md mx-auto">
          Not a subscription. Not a tier. A piece of history — your name in the product, a metal card in your hand, and lifetime access from day one.
        </p>
        <Button
          variant="primary"
          onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
          className="bg-[linear-gradient(180deg,#d9b549,#a7802c)] border-[#d9b549]/40 hover:brightness-105 shadow-[0_0_20px_rgba(217,181,73,0.26)]"
        >
          Claim Yours
        </Button>
      </div>
    </div>
  );
};
