import React, { useMemo } from "react";
import { ArrowRight, Monitor, Apple, Terminal, Github } from "lucide-react";

import { Badge } from "../components/ui";
import type { PageProps } from "../types";

const workflows = {
  windows: "https://github.com/currentsuspect/Aestra/actions/workflows/windows.yml",
  macos: "https://github.com/currentsuspect/Aestra/actions/workflows/macos.yml",
  linux: "https://github.com/currentsuspect/Aestra/actions/workflows/linux.yml",
};

function detectOS(): string {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS X") || ua.includes("macOS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  return "";
}

export const Downloads = ({ setPage }: PageProps) => {
  const currentOS = useMemo(() => detectOS(), []);

  const builds = [
    { id: "Windows", os: "Windows", arch: "x64",             icon: Monitor, type: "Beta",   href: workflows.windows, cta: "Find build in CI" },
    { id: "macOS",   os: "macOS",   arch: "Apple Silicon",   icon: Apple,   type: "Beta",   href: workflows.macos,   cta: "Find build in CI" },
    { id: "Linux",   os: "Linux",   arch: "Ubuntu / Debian / Arch", icon: Terminal, type: "Beta",  href: workflows.linux,   cta: "Find build in CI" },
    { id: "Source",  os: "Source",  arch: "GitHub",          icon: Github,  type: "Source", href: "https://github.com/currentsuspect/Aestra", cta: "View source" },
  ] as const;

  const isCurrent = (id: string) => id === currentOS;

  return (
    <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setPage("home")}
          className="text-muted hover:text-fg mb-10 flex items-center text-sm transition-colors"
        >
          <ArrowRight className="rotate-180 w-4 h-4 mr-1.5" aria-hidden="true" /> Back to home
        </button>

        <div className="mb-12">
          <p className="kicker mb-4">Downloads</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-4">
            Get Aestra.
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed">
            Pre-release builds. Expect sharp edges.
          </p>
        </div>

        <ul className="rounded-2xl border border-border/80 bg-bg overflow-hidden">
          {builds.map((build, i) => {
            const Icon = build.icon;
            return (
              <li key={i} className="border-b border-border/80 last:border-b-0">
                <a
                  href={build.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-5 sm:p-6 hover:bg-surface-2/40 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-fg-muted shrink-0" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-fg text-[15px] font-medium">{build.os}</h2>
                      <p className="text-muted text-[13px]">{build.arch}</p>
                    </div>
                  </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {isCurrent(build.id) && (
                        <Badge>Recommended</Badge>
                      )}
                      <Badge variant="outline">{build.type === "Source" ? "Source" : "Beta"}</Badge>
                      <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium bg-surface-2 text-fg border border-border whitespace-nowrap">
                        {build.cta} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    </div>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 text-[13px] text-muted leading-relaxed max-w-2xl">
          Builds are produced automatically from CI. If a build fails or the artifact
          is missing, check the GitHub Actions page for the latest successful run.
        </div>
      </div>
    </div>
  );
};
