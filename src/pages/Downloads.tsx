import React from "react";
import { ArrowRight, Monitor, Apple, Terminal, Globe } from "lucide-react";
import { Button, Badge } from "../components/ui";

export const Downloads = ({ setPage }: any) => {
  const builds = [
    { os: "Windows",     arch: "x64",                 icon: Monitor, type: "Beta"   },
    { os: "macOS",       arch: "Apple Silicon",       icon: Apple,   type: "Beta"   },
    { os: "Linux",       arch: "Ubuntu / Debian",     icon: Terminal, type: "Beta"  },
    { os: "Source",      arch: "GitHub",              icon: Globe,   type: "Source" },
  ];

  return (
    <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setPage("home")}
          className="text-zinc-400 hover:text-zinc-100 mb-10 flex items-center text-sm transition-colors"
        >
          <ArrowRight className="rotate-180 w-4 h-4 mr-1.5" /> Back to home
        </button>

        <div className="mb-12">
          <p className="kicker mb-4">Downloads</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-zinc-50 mb-4">
            Get Aestra.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Pre-release builds. Expect sharp edges.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden">
          {builds.map((build, i) => {
            const Icon = build.icon;
            const url = build.type === "Source"
              ? "https://github.com/currentsuspect/Aestra"
              : "https://github.com/currentsuspect/Aestra/actions";
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-zinc-800/80 last:border-b-0 hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-zinc-50 text-[15px] font-medium">{build.os}</div>
                    <div className="text-zinc-500 text-[13px]">{build.arch}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline">{build.type === "Source" ? "Source" : "Beta"}</Badge>
                  <Button size="sm" variant="secondary">
                    {build.type === "Source" ? "View source" : "Get build"} <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 text-[13px] text-zinc-500 leading-relaxed max-w-2xl">
          Builds are produced automatically from CI. If a build fails or the artifact
          is missing, check the GitHub Actions page for the latest successful run.
        </div>
      </div>
    </div>
  );
};
