import { useMemo } from "react";
import { ArrowRight, Github } from "lucide-react";
import type { SVGProps } from "react";

import { Badge } from "../components/ui";
import type { PageProps } from "../types";

const WinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.801" />
  </svg>
);

const MacIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const LinuxIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C9.5 2 7.5 3.8 7.5 6.5c0 .8.2 1.5.5 2.1C6.4 9.8 5 11.7 5 14c0 1.5.4 2.8 1.2 3.8-.1.4-.2.8-.2 1.2 0 1.8 1.3 3 3 3s3-1.2 3-3c0-.4-.1-.8-.2-1.2H12c.1.4.2.8.2 1.2 0 1.8 1.3 3 3 3s3-1.2 3-3c0-.4-.1-.8-.2-1.2C18.6 16.8 19 15.5 19 14c0-2.3-1.4-4.2-3-5.4.3-.6.5-1.3.5-2.1C16.5 3.8 14.5 2 12 2z" />
  </svg>
);

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
    { id: "Windows", os: "Windows", arch: "x64",             icon: WinIcon, type: "Beta",   href: workflows.windows, cta: "Find build in CI" },
    { id: "macOS",   os: "macOS",   arch: "Apple Silicon",   icon: MacIcon, type: "Beta",   href: workflows.macos,   cta: "Find build in CI" },
    { id: "Linux",   os: "Linux",   arch: "Ubuntu / Debian / Arch", icon: LinuxIcon, type: "Beta",  href: workflows.linux,   cta: "Find build in CI" },
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
