import React, { useEffect, useMemo, useState, memo } from "react";
import { ArrowRight, BookOpen, FileText, Search } from "lucide-react";

import { cn } from "../lib";
import { Button, Card } from "../components/ui";

export const Docs = memo(({ setPage }: any) => {
  const docsSections = useMemo(() => [
    {
      id: "overview",
      group: "Start Here",
      title: "Docs Overview",
      eyebrow: "Portal",
      summary: "Aestra is on a 0.x pre-Beta line. This page is a guided index into the real repo docs, not a fake product manual pretending everything is finished.",
      bullets: [
        "The public target is v1 Beta in December 2026.",
        "The product is intentionally scoped around pattern-first hip-hop and electronic production.",
        "The most truthful docs today are the roadmap, build guide, testing/CI profile, and product strategy files."
      ],
      calloutTitle: "Best entry point",
      callout: "Start with the roadmap before reading older architecture notes. Some docs in the repo are preserved context, not the current source of truth.",
      links: [
        { label: "Engineering portal", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/index.md" },
        { label: "Internal docs index", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/INDEX.md" },
        { label: "Repo README", href: "https://github.com/currentsuspect/Aestra/blob/main/README.md" }
      ]
    },
    {
      id: "roadmap",
      group: "Start Here",
      title: "Roadmap Reality",
      eyebrow: "Execution Plan",
      summary: "The roadmap is explicit about what matters for Beta: trust features, deterministic save/load, undo/redo consistency, export, and dropout resilience. Aestra does not win by pretending to be a full DAW on day one.",
      bullets: [
        "Primary supported Beta platform is Windows 10/11 x64.",
        "Linux and macOS are not required for v1 Beta unless someone owns them end-to-end.",
        "AI, cloud sync, collaboration, and broad platform expansion are post-Beta."
      ],
      calloutTitle: "Core rule",
      callout: "A stable Beta beats feature breadth. If a subsystem threatens reliability, it gets cut or delayed.",
      links: [
        { label: "Technical roadmap", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/technical/roadmap.md" },
        { label: "v1 Beta task list", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/technical/v1_beta_task_list.md" },
        { label: "Product roadmap", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/Roadmap-Product.md" }
      ]
    },
    {
      id: "building",
      group: "Contribute",
      title: "Building Aestra",
      eyebrow: "Getting Started",
      summary: "The public repo supports full desktop builds and headless build shapes. The current build docs are better than the old catch-all instructions because they reflect real CMake options and public-only checkout behavior.",
      bullets: [
        "Use `Aestra_CORE_MODE=ON` in public checkouts.",
        "Use `AESTRA_HEADLESS_ONLY=ON` when you want audio/core/test workflows without the UI.",
        "Windows and Linux build instructions are both documented, but Beta support posture is still Windows-first."
      ],
      code: [
        "git clone https://github.com/currentsuspect/Aestra.git",
        "cd Aestra",
        "cmake -S . -B build -DAestra_CORE_MODE=ON -DAESTRA_ENABLE_TESTS=ON -DCMAKE_BUILD_TYPE=Release",
        "cmake --build build --parallel"
      ],
      links: [
        { label: "Building guide", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/getting-started/building.md" },
        { label: "Quick start", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/getting-started/quickstart.md" },
        { label: "Validate core build", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/getting-started/validate-core-build.md" }
      ]
    },
    {
      id: "testing",
      group: "Contribute",
      title: "Testing and CI",
      eyebrow: "Confidence",
      summary: "The repo uses explicit test profiles instead of pretending every path is equally stable. The maintained CI gate is intentionally smaller than the deeper local confidence suite.",
      bullets: [
        "Runtime-sensitive tests are opt-in behind `AESTRA_ENABLE_RUNTIME_TESTS=ON`.",
        "Experimental tests are opt-in behind `AESTRA_ENABLE_EXPERIMENTAL_TESTS=ON`.",
        "The highest-signal local confidence paths right now center on internal plugin discovery, Rumble, project round-trip, and headless rendering."
      ],
      code: [
        "cmake -S . -B build -DAESTRA_HEADLESS_ONLY=ON -DAESTRA_ENABLE_UI=OFF",
        "cmake --build build -j2",
        "ctest --test-dir build --output-on-failure -R \"CommandHistoryTest|MoveClipCommandTest|MacroCommandTest|AestraOscillatorTest|AestraMixerBusTest|AestraAtomicSaveTest\""
      ],
      links: [
        { label: "Testing & CI profiles", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/technical/testing_ci.md" },
        { label: "CI workflows map", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/technical/ci_workflows.md" },
        { label: "Rumble MVP plan", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/technical/RUMBLE_MVP_PLAN.md" }
      ]
    },
    {
      id: "product",
      group: "Vision",
      title: "Product Vision",
      eyebrow: "Strategy",
      summary: "Aestra is meant to be a free full-featured DAW with no feature gates. Monetization starts after Beta through Supporter, Founder, Campus, premium plugins, and later Muse AI, not by crippling Core.",
      bullets: [
        "v1 Beta in December 2026 is free, with no monetization.",
        "Supporter and Founder launch in v1.0, targeted for Q1 2027.",
        "Muse AI is planned for v1.1 and Cloud Takes for v1.2+."
      ],
      calloutTitle: "Important distinction",
      callout: "Product strategy is broader than current engineering reality. The docs page should distinguish roadmap intent from what is already implemented.",
      links: [
        { label: "Product strategy", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/Product-Strategy.md" },
        { label: "Pricing", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/Pricing.md" },
        { label: "Muse AI spec", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/Muse-AI-Spec.md" }
      ]
    },
    {
      id: "language",
      group: "Vision",
      title: "Design Language",
      eyebrow: "Identity",
      summary: "Aestra borrows useful interaction ideas from other domains, but the user-facing language must stay native. The design metaphor should shape the product silently, not leak into public copy as references.",
      bullets: [
        "Use Aestra terms like routing visualizer, Audition mode, and Takes.",
        "Do not expose source metaphor labels in public product copy.",
        "Keep interaction direct, visual, and consistent across the app."
      ],
      calloutTitle: "Public copy rule",
      callout: "Never say “like Unreal” or “like Spotify” in user-facing docs. The product language needs to stand on its own.",
      links: [
        { label: "Design language", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/Design-Language.md" },
        { label: "Design system", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/DESIGN_SYSTEM.md" }
      ]
    }
  ], []);

  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return docsSections;
    return docsSections.filter((section) =>
      [section.group, section.title, section.eyebrow, section.summary, ...section.bullets]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [docsSections, search]);

  const visibleSectionIds = filteredSections.map((section) => section.id);

  useEffect(() => {
    if (!visibleSectionIds.includes(activeSection) && filteredSections.length > 0) {
      setActiveSection(filteredSections[0].id);
    }
  }, [activeSection, filteredSections, visibleSectionIds]);

  const currentSection = filteredSections.find((section) => section.id === activeSection) ?? docsSections[0];
  const currentIndex = filteredSections.findIndex((section) => section.id === currentSection.id);
  const previousSection = currentIndex > 0 ? filteredSections[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < filteredSections.length - 1 ? filteredSections[currentIndex + 1] : null;

  const groupedSections = useMemo(() => {
    return filteredSections.reduce((acc: Record<string, typeof docsSections>, section) => {
      if (!acc[section.group]) acc[section.group] = [];
      acc[section.group].push(section);
      return acc;
    }, {});
  }, [filteredSections, docsSections]);

  return (
    <div className="pt-24 min-h-screen flex">
      <div className="w-64 fixed left-0 top-24 bottom-0 border-r border-[#2d3444] bg-[#0e121a] hidden md:block overflow-y-auto">
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search docs..."
              aria-label="Search documentation"
              className="w-full bg-[#151a24] border border-[#30384a] rounded-[12px] py-2 pl-9 pr-4 text-sm text-white focus:ring-2 focus:ring-[#61d5ff]/40 focus:outline-none"
            />
          </div>

          <div className="space-y-6">
            {Object.entries(groupedSections).map(([group, sections]) => (
              <div key={group}>
                <h4 className="text-xs font-bold text-[#79839b] uppercase tracking-wider mb-3">{group}</h4>
                <ul className="space-y-2 text-sm">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full text-left rounded-[14px] px-3 py-2 transition-colors",
                          activeSection === section.id
                            ? "text-[#61d5ff] font-medium bg-[#61d5ff]/10 border border-[#61d5ff]/15"
                            : "text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e]"
                        )}
                      >
                        <div>{section.title}</div>
                        <div className="text-[11px] text-[#697389] mt-1">{section.eyebrow}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {filteredSections.length === 0 && (
              <div className="rounded-[16px] border border-[#30384a] bg-[#121722] p-4 text-sm text-[#98a1b7]">
                No docs matched that search.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 md:ml-64 p-4 sm:p-8 md:p-12 max-w-4xl">
        <div className="mb-4 text-sm text-[#61d5ff] font-medium">{currentSection.group} / {currentSection.eyebrow}</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-6 sm:mb-8">{currentSection.title}</h1>

        <div className="max-w-none">
          <p className="text-lg text-[#d4dae8] leading-relaxed mb-6">{currentSection.summary}</p>

          <Card className="p-6 mb-8 bg-[#61d5ff]/5">
            <h4 className="flex items-center text-[#61d5ff] font-bold mb-2">
              <BookOpen className="w-4 h-4 mr-2" /> {currentSection.calloutTitle ?? "Quick context"}
            </h4>
            <p className="text-sm text-[#d2d8e6]">
              {currentSection.callout ?? "Use the source docs as the authority and treat this page as a guided index into them."}
            </p>
          </Card>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">What matters here</h2>
          <ul className="space-y-3 text-[#98a1b7] mb-8">
            {currentSection.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[#61d5ff] mt-0.5">›</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {currentSection.code && (
            <>
              <h2 className="text-2xl font-bold text-white mt-12 mb-4">Reference command</h2>
              <Card className="p-4 mb-8 bg-[#151a24] border border-[#30384a] font-mono text-sm">
                <div className="text-[#98a1b7] mb-2"># Typical flow</div>
                {currentSection.code.map((line, index) => (
                  <div key={index} className="text-white">
                    {line}
                  </div>
                ))}
              </Card>
            </>
          )}

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Source documents</h2>
          <div className="grid gap-3">
            {currentSection.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="section-frame rounded-[16px] px-4 py-4 flex items-center justify-between text-sm hover:border-[#61d5ff]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#61d5ff]" />
                  <span className="text-[#d4dae8]">{link.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7d879d]" />
              </a>
            ))}
          </div>

          <div className="flex gap-4 mt-12 pt-8 border-t border-[#2f3646]">
            <Button
              variant="secondary"
              className="w-full justify-between group"
              disabled={!previousSection}
              onClick={() => previousSection && setActiveSection(previousSection.id)}
            >
              <span className="text-[#98a1b7]">Previous: {previousSection ? previousSection.title : "None"}</span>
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-between group"
              disabled={!nextSection}
              onClick={() => nextSection && setActiveSection(nextSection.id)}
            >
              <span className="text-white group-hover:text-[#61d5ff] transition-colors">Next: {nextSection ? nextSection.title : "None"}</span>
              <ArrowRight className="w-4 h-4 text-[#98a1b7] group-hover:text-[#61d5ff]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
