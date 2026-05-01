import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, FileText, Search } from "lucide-react";

import { cn } from "../lib";
import { Button, Card } from "../components/ui";

type DocsSection = {
  id: string;
  group: string;
  title: string;
  eyebrow: string;
  summary: string;
  calloutTitle?: string;
  callout?: string;
  links?: Array<{ label: string; href: string }>;
};

type PaletteAction = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

export const Docs = memo(({ setPage }: any) => {
  const docsSections = useMemo<DocsSection[]>(() => [
    {
      id: "patch-recipes",
      group: "Create",
      title: "Patch Recipes",
      eyebrow: "Goal-Driven",
      summary: "Short, reusable recipe cards built for speed: goal, starting preset, exact steps, and a quick A/B result.",
      calloutTitle: "How to use this",
      callout: "Pick a recipe, run the steps in order, then compare Before/After to validate the outcome.",
      links: [
        { label: "Repository docs index", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/index.md" },
        { label: "Quick start", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/getting-started/quickstart.md" }
      ]
    },
    {
      id: "signal-flow",
      group: "Mix",
      title: "Interactive Signal Flow",
      eyebrow: "Visual Lab",
      summary: "Clickable audio stages that explain what each step does and how it changes your sound in context.",
      calloutTitle: "A/B mindset",
      callout: "Use Before to spot the issue, After to hear intent, then copy only the stages that solve your exact problem.",
      links: [
        { label: "Testing and CI profile", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/technical/testing_ci.md" }
      ]
    },
    {
      id: "persona-tracks",
      group: "Learn",
      title: "Persona Tracks",
      eyebrow: "Guided Paths",
      summary: "Progressive tracks for beatmakers, mix engineers, and first-time producers, each with a practical step playlist.",
      calloutTitle: "Track strategy",
      callout: "Stay in one track until you can ship a complete draft, then branch into a second track for depth.",
      links: [
        { label: "Product strategy", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/Product-Strategy.md" }
      ]
    },
    {
      id: "symptom-solver",
      group: "Fix",
      title: "Troubleshoot by Symptom",
      eyebrow: "No Jargon Wall",
      summary: "Start from what you hear — muddy lows, quiet exports, latency drag — and jump straight to targeted fixes.",
      calloutTitle: "Fastest path",
      callout: "Use immediate fixes first; only move to deep fixes if the symptom persists in your A/B check.",
      links: [
        { label: "Building guide", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/getting-started/building.md" }
      ]
    },
    {
      id: "command-palette",
      group: "Navigate",
      title: "Command Palette Docs",
      eyebrow: "Slash & Keys",
      summary: "Press / from docs to jump sections, open related pages, and run common doc actions from one command surface.",
      calloutTitle: "Shortcut",
      callout: "Press / anywhere in the docs area to open the palette instantly.",
      links: [
        { label: "Engineering portal", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/index.md" }
      ]
    },
    {
      id: "mini-sandboxes",
      group: "Play",
      title: "Live Mini Sandboxes",
      eyebrow: "Hands-On",
      summary: "Small interactive widgets for pattern programming and routing logic so docs can be tested, not just read.",
      calloutTitle: "Practice loop",
      callout: "Use these as muscle-memory drills, then apply the same moves in your session.",
      links: [
        { label: "Design system", href: "https://github.com/currentsuspect/Aestra/blob/main/AestraDocs/DESIGN_SYSTEM.md" }
      ]
    },
    {
      id: "changes-for-me",
      group: "Updates",
      title: "What Changed for Me?",
      eyebrow: "Workflow Impact",
      summary: "Version notes translated into user-impact language by workflow, so every update answers: what got better for me?",
      calloutTitle: "Reading order",
      callout: "Filter by your workflow first, then scan the latest version notes.",
      links: [
        { label: "Changelog page", href: "/changelog" },
        { label: "Repo changelog", href: "https://github.com/currentsuspect/Aestra/blob/main/CHANGELOG.md" }
      ]
    },
    {
      id: "community-breakdowns",
      group: "Community",
      title: "Session Breakdowns",
      eyebrow: "Real Projects",
      summary: "Compact walkthroughs showing how people built actual tracks with concrete chains, choices, and takeaways.",
      calloutTitle: "Use case",
      callout: "Steal structure, not style: clone the flow, then swap sounds to fit your own track.",
      links: [
        { label: "Roadmap", href: "https://github.com/currentsuspect/Aestra/blob/main/docs/technical/roadmap.md" }
      ]
    }
  ], []);

  const patchRecipes = useMemo(() => [
    {
      id: "punchy-808",
      title: "Punchy 808 Drums",
      goal: "Keep the 808 huge while letting the kick cut through cleanly.",
      preset: "Trap Starter A",
      steps: [
        "Load Kick A + 808 Mono in separate channels.",
        "Set sidechain from Kick to 808 at 2.5:1, fast attack.",
        "High-pass hats at 180Hz and trim bus by -1.5dB.",
        "Check Translation Preview on Laptop + Car profiles."
      ],
      before: "Kick transient masked, low-end blooms unpredictably.",
      after: "Kick speaks clearly, 808 stays present without swallowing the groove."
    },
    {
      id: "clean-vocal-stack",
      title: "Clean Vocal Stack",
      goal: "Center lead vocal while keeping doubles wide and controlled.",
      preset: "Vocal Pop Chain",
      steps: [
        "Route Lead, Doubles, Adlibs into a Vocal Bus.",
        "Lead gets mild compression + de-esser before bus.",
        "Doubles receive high-pass at 120Hz and stereo spread.",
        "Use Audition profile to verify speech clarity on earbuds."
      ],
      before: "Vocal image feels blurry and sibilance pokes in choruses.",
      after: "Lead sits forward, doubles support width, top end stays smooth."
    },
    {
      id: "wider-hooks",
      title: "Wider Hooks, Stable Verse",
      goal: "Make hook feel larger without collapsing mono compatibility.",
      preset: "Hook Width Lite",
      steps: [
        "Duplicate hook synth and pan pair ±35.",
        "Apply micro-delay (12ms / 18ms) only to sides.",
        "Keep mono-compatible low-mid by filtering sides below 240Hz.",
        "A/B in Routing Visualizer and Translation Preview."
      ],
      before: "Hook sounds narrow or loses power in mono.",
      after: "Hook opens up in stereo while verse remains tight and centered."
    }
  ], []);

  const flowNodes = useMemo(() => [
    {
      id: "input",
      name: "Input",
      badge: "Stage 1",
      before: "Peaks vary wildly between takes.",
      after: "Input gain is staged for clean headroom.",
      tip: "Aim for consistent recording gain before adding processing."
    },
    {
      id: "eq",
      name: "Corrective EQ",
      badge: "Stage 2",
      before: "Mud around 250Hz and harshness around 3kHz.",
      after: "Problem bands trimmed; clarity opens up.",
      tip: "Cut narrow issues before broad sweetening."
    },
    {
      id: "dynamics",
      name: "Dynamics",
      badge: "Stage 3",
      before: "Volume jumps between phrases.",
      after: "Performance feels steady without sounding crushed.",
      tip: "Use moderate ratio and tune release to groove."
    },
    {
      id: "space",
      name: "Space FX",
      badge: "Stage 4",
      before: "Dry and disconnected from the mix bed.",
      after: "Sits naturally with controlled depth.",
      tip: "Short early reflections help glue without washing details."
    },
    {
      id: "bus",
      name: "Bus/Master",
      badge: "Stage 5",
      before: "Elements feel separate and unglued.",
      after: "Cohesive image with stable loudness behavior.",
      tip: "Keep bus moves subtle; aim for cohesion, not character replacement."
    }
  ], []);

  const personaTracks = useMemo(() => [
    {
      id: "beatmaker",
      label: "Beatmaker",
      summary: "Idea-to-draft speed and loop-to-arrangement flow.",
      playlist: [
        "Build a 16-step drum bed in Pattern view.",
        "Layer bass and lead with routing sanity checks.",
        "Duplicate patterns into A/B arrangement blocks.",
        "Run Translation Preview on 3 listening profiles."
      ]
    },
    {
      id: "mix",
      label: "Mix Engineer",
      summary: "Headroom, routing clarity, and translation consistency.",
      playlist: [
        "Stage gain and identify masking lanes.",
        "Route buses and verify node flow in visualizer.",
        "Apply targeted compression and saturation.",
        "Lock export loudness with platform-aware checks."
      ]
    },
    {
      id: "first-time",
      label: "First-Time Producer",
      summary: "Zero-jargon path to a complete first release draft.",
      playlist: [
        "Pick a starter preset and set project tempo.",
        "Program kick/snare/hat foundation.",
        "Add one melody and one bass movement.",
        "Export, compare, and fix one translation issue."
      ]
    }
  ], []);

  const symptoms = useMemo(() => [
    {
      id: "muddy-808",
      symptom: "My 808 sounds muddy",
      immediate: [
        "High-pass non-bass elements (hats/synths) to clear low-end space.",
        "Sidechain kick into 808 by a small amount.",
        "Cut 200–350Hz on the 808 only if masking is obvious."
      ],
      deep: [
        "Check phase alignment between kick transient and 808 attack.",
        "Move saturation before compression to avoid pumping haze."
      ]
    },
    {
      id: "quiet-export",
      symptom: "My export is too quiet",
      immediate: [
        "Raise pre-limiter gain in small steps (+0.5dB).",
        "Verify no hidden -6dB utility or trim plugin is active.",
        "Compare LUFS in Translation Preview profile."
      ],
      deep: [
        "Rebuild gain staging from drum bus outward.",
        "Use less aggressive dynamics if crest factor is too wide."
      ]
    },
    {
      id: "latency-off",
      symptom: "Latency feels off while recording",
      immediate: [
        "Switch to low-latency monitoring mode.",
        "Disable high-latency plugins on record-enabled tracks.",
        "Lower device buffer while tracking."
      ],
      deep: [
        "Split record and mix templates so heavy FX load later.",
        "Use freeze/bounce strategy for CPU-heavy instruments."
      ]
    }
  ], []);

  const workflowImpact = useMemo(() => [
    {
      id: "beatmaker",
      label: "Beatmaker",
      notes: [
        { version: "v0.3.2", change: "Pattern duplication now keeps automation lanes attached.", impact: "You can iterate drops faster without rebuilding movement each copy." },
        { version: "v0.3.1", change: "Startup path trimmed for repeat sessions.", impact: "Idea capture is faster when bouncing between references and drafts." }
      ]
    },
    {
      id: "mix",
      label: "Mix Engineer",
      notes: [
        { version: "v0.3.2", change: "Routing visualizer labels improved for bus grouping.", impact: "Tracing signal paths is quicker and mistakes are easier to catch." },
        { version: "v0.3.0", change: "Export reliability pass for long sessions.", impact: "Fewer last-mile export retries on dense projects." }
      ]
    },
    {
      id: "new-user",
      label: "First-Time Producer",
      notes: [
        { version: "v0.3.2", change: "Docs now include symptom-first troubleshooting.", impact: "You can fix common issues without digging through technical notes." },
        { version: "v0.3.1", change: "Guided defaults updated in starter templates.", impact: "You get a better sounding base session out of the box." }
      ]
    }
  ], []);

  const communityBreakdowns = useMemo(() => [
    {
      id: "night-drive",
      title: "Night Drive Bounce",
      genre: "Melodic Trap · 142 BPM",
      chain: "Punchy 808 recipe + Translation Preview (Car + Earbuds)",
      takeaway: "Small sidechain and mid cleanup gave the hook room without losing weight.",
      recipeId: "punchy-808"
    },
    {
      id: "glass-room",
      title: "Glass Room Vox",
      genre: "Alt R&B · 92 BPM",
      chain: "Clean Vocal Stack + Space FX stage tweaks",
      takeaway: "Lead compression first, then subtle room, preserved intimacy and clarity.",
      recipeId: "clean-vocal-stack"
    },
    {
      id: "sunset-hook",
      title: "Sunset Hook Build",
      genre: "Pop/Electronic · 124 BPM",
      chain: "Wider Hooks recipe + Routing Visualizer A/B",
      takeaway: "Stereo width lived in upper bands; low-mid stayed mono-stable.",
      recipeId: "wider-hooks"
    }
  ], []);

  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("patch-recipes");

  const [selectedRecipe, setSelectedRecipe] = useState(patchRecipes[0].id);
  const [recipeMode, setRecipeMode] = useState<"before" | "after">("before");
  const [recipeChecks, setRecipeChecks] = useState<Record<string, boolean[]>>({});

  const [selectedFlowNode, setSelectedFlowNode] = useState(flowNodes[0].id);
  const [flowMode, setFlowMode] = useState<"before" | "after">("before");

  const [selectedPersona, setSelectedPersona] = useState(personaTracks[0].id);
  const [personaProgress, setPersonaProgress] = useState<Record<string, number>>({
    [personaTracks[0].id]: 0,
    [personaTracks[1].id]: 0,
    [personaTracks[2].id]: 0
  });

  const [selectedSymptom, setSelectedSymptom] = useState(symptoms[0].id);
  const [selectedWorkflowImpact, setSelectedWorkflowImpact] = useState(workflowImpact[0].id);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const paletteInputRef = useRef<HTMLInputElement | null>(null);

  const [patternRows, setPatternRows] = useState<Record<string, number[]>>({
    kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hat: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]
  });
  const [routingToggles, setRoutingToggles] = useState({
    eq: true,
    comp: true,
    saturator: false,
    sidechain: true
  });

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return docsSections;
    return docsSections.filter((section) =>
      [section.group, section.title, section.eyebrow, section.summary, section.calloutTitle, section.callout]
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

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPaletteOpen(false);
        return;
      }
      const activeEl = document.activeElement as HTMLElement | null;
      const isTypingTarget =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.isContentEditable;

      if (event.key === "/" && !isTypingTarget) {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    if (paletteOpen) {
      setPaletteQuery("");
      setTimeout(() => paletteInputRef.current?.focus(), 0);
    }
  }, [paletteOpen]);

  const groupedSections = useMemo(() => {
    return filteredSections.reduce((acc: Record<string, DocsSection[]>, section) => {
      if (!acc[section.group]) acc[section.group] = [];
      acc[section.group].push(section);
      return acc;
    }, {});
  }, [filteredSections]);

  const currentSection = filteredSections.find((section) => section.id === activeSection) ?? docsSections[0];
  const currentIndex = filteredSections.findIndex((section) => section.id === currentSection.id);
  const previousSection = currentIndex > 0 ? filteredSections[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < filteredSections.length - 1 ? filteredSections[currentIndex + 1] : null;

  const paletteActions = useMemo<PaletteAction[]>(() => {
    const navActions = docsSections.map((section) => ({
      id: `nav-${section.id}`,
      label: `Go to: ${section.title}`,
      hint: `${section.group} · ${section.eyebrow}`,
      run: () => {
        setActiveSection(section.id);
        setSearch("");
      }
    }));
    return [
      ...navActions,
      {
        id: "go-changelog",
        label: "Open Changelog page",
        hint: "Route: /changelog",
        run: () => setPage("changelog")
      },
      {
        id: "clear-search",
        label: "Clear docs search",
        hint: "Reset filter",
        run: () => setSearch("")
      },
      {
        id: "open-repo-docs",
        label: "Open repository docs index",
        hint: "GitHub external",
        run: () => window.open("https://github.com/currentsuspect/Aestra/blob/main/docs/index.md", "_blank", "noopener,noreferrer")
      }
    ];
  }, [docsSections, setPage]);

  const filteredPaletteActions = useMemo(() => {
    const query = paletteQuery.trim().toLowerCase();
    if (!query) return paletteActions;
    return paletteActions.filter((action) =>
      `${action.label} ${action.hint}`.toLowerCase().includes(query)
    );
  }, [paletteActions, paletteQuery]);

  const selectedRecipeData = patchRecipes.find((recipe) => recipe.id === selectedRecipe) ?? patchRecipes[0];
  const recipeStepChecks = recipeChecks[selectedRecipeData.id] ?? Array(selectedRecipeData.steps.length).fill(false);

  const selectedFlowData = flowNodes.find((node) => node.id === selectedFlowNode) ?? flowNodes[0];
  const selectedSymptomData = symptoms.find((item) => item.id === selectedSymptom) ?? symptoms[0];
  const selectedPersonaData = personaTracks.find((track) => track.id === selectedPersona) ?? personaTracks[0];
  const selectedImpactData = workflowImpact.find((item) => item.id === selectedWorkflowImpact) ?? workflowImpact[0];

  const toggleRecipeStep = (recipeId: string, stepIndex: number, total: number) => {
    setRecipeChecks((prev) => {
      const current = [...(prev[recipeId] ?? Array(total).fill(false))];
      current[stepIndex] = !current[stepIndex];
      return { ...prev, [recipeId]: current };
    });
  };

  const togglePatternCell = (row: string, index: number) => {
    setPatternRows((prev) => {
      const next = [...prev[row]];
      next[index] = next[index] === 1 ? 0 : 1;
      return { ...prev, [row]: next };
    });
  };

  const renderSectionContent = () => {
    switch (currentSection.id) {
      case "patch-recipes":
        return (
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            <div className="space-y-3">
              {patchRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => {
                    setSelectedRecipe(recipe.id);
                    setRecipeMode("before");
                  }}
                  className={cn(
                    "section-frame w-full rounded-[14px] p-4 text-left transition-colors",
                    recipe.id === selectedRecipe ? "border-[#00e5cc]/40 bg-[#00e5cc]/10" : "hover:border-[#00e5cc]/25"
                  )}
                >
                  <div className="text-xs uppercase tracking-wider text-[#00e5cc] mb-1">Recipe</div>
                  <div className="text-white font-semibold">{recipe.title}</div>
                  <div className="text-xs text-[#8d97af] mt-1">{recipe.preset}</div>
                </button>
              ))}
            </div>

            <Card className="section-frame p-5 sm:p-6">
              <h3 className="text-xl text-white font-bold">{selectedRecipeData.title}</h3>
              <p className="text-sm text-[#9aa5bd] mt-2">{selectedRecipeData.goal}</p>
              <div className="mt-4 inline-flex rounded-xl border border-[#2f3648] overflow-hidden">
                <button
                  onClick={() => setRecipeMode("before")}
                  className={cn("px-3 py-2 text-xs", recipeMode === "before" ? "bg-[#7c6fe0] text-white" : "bg-transparent text-[#8d97af]")}
                >
                  Before
                </button>
                <button
                  onClick={() => setRecipeMode("after")}
                  className={cn("px-3 py-2 text-xs", recipeMode === "after" ? "bg-[#3dbb6e] text-white" : "bg-transparent text-[#8d97af]")}
                >
                  After
                </button>
              </div>
              <div className="mt-4 rounded-[12px] border border-[#2f3648] bg-[#101521] px-4 py-3 text-sm text-[#d4dae8]">
                {recipeMode === "before" ? selectedRecipeData.before : selectedRecipeData.after}
              </div>
              <h4 className="text-sm text-white mt-6 mb-3">Step checklist</h4>
              <div className="space-y-2">
                {selectedRecipeData.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => toggleRecipeStep(selectedRecipeData.id, index, selectedRecipeData.steps.length)}
                    className={cn(
                      "w-full rounded-[10px] border px-3 py-3 text-left flex items-start gap-3",
                      recipeStepChecks[index] ? "border-[#3dbb6e]/60 bg-[#3dbb6e]/10" : "border-[#2f3648] bg-[#0f131d]"
                    )}
                  >
                    <span className={cn("mt-0.5 inline-flex w-4 h-4 rounded-full border items-center justify-center text-[10px]", recipeStepChecks[index] ? "border-[#3dbb6e] text-[#3dbb6e]" : "border-[#475069] text-[#79839b]")}>
                      {recipeStepChecks[index] ? "✓" : index + 1}
                    </span>
                    <span className="text-sm text-[#d4dae8]">{step}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        );

      case "signal-flow":
        return (
          <Card className="section-frame p-5 sm:p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {flowNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedFlowNode(node.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs border",
                    selectedFlowNode === node.id ? "border-[#00e5cc] bg-[#00e5cc]/15 text-[#00e5cc]" : "border-[#2f3648] text-[#8d97af] hover:text-white"
                  )}
                >
                  {node.name}
                </button>
              ))}
            </div>

            <div className="rounded-[14px] border border-[#2f3648] bg-[#0f131d] p-4 mb-5">
              <svg viewBox="0 0 760 90" width="100%" className="h-auto">
                {flowNodes.map((node, index) => {
                  const x = 60 + index * 150;
                  const active = node.id === selectedFlowNode;
                  return (
                    <g key={node.id} onClick={() => setSelectedFlowNode(node.id)} style={{ cursor: "pointer" }}>
                      {index < flowNodes.length - 1 && (
                        <line x1={x + 42} y1={45} x2={x + 108} y2={45} stroke={active ? "#61d5ff" : "#3a4358"} strokeWidth="2.2" />
                      )}
                      <rect x={x} y={26} width={84} height={38} rx={10} fill={active ? "#61d5ff22" : "#151b28"} stroke={active ? "#61d5ff" : "#2f3648"} />
                      <text x={x + 42} y={49} textAnchor="middle" fontSize="11" fill={active ? "#61d5ff" : "#a5afc4"}>{node.badge}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex gap-2 mb-4">
              <button onClick={() => setFlowMode("before")} className={cn("rounded-lg px-3 py-2 text-xs border", flowMode === "before" ? "border-[#7c6fe0] bg-[#7c6fe0]/15 text-[#b8aef9]" : "border-[#2f3648] text-[#8d97af]")}>Before</button>
              <button onClick={() => setFlowMode("after")} className={cn("rounded-lg px-3 py-2 text-xs border", flowMode === "after" ? "border-[#3dbb6e] bg-[#3dbb6e]/15 text-[#7ad999]" : "border-[#2f3648] text-[#8d97af]")}>After</button>
            </div>

            <h3 className="text-lg font-bold text-white">{selectedFlowData.name}</h3>
            <p className="text-sm text-[#9aa5bd] mt-2">{flowMode === "before" ? selectedFlowData.before : selectedFlowData.after}</p>
            <p className="text-xs text-[#00e5cc] mt-3">Tip: {selectedFlowData.tip}</p>
          </Card>
        );

      case "persona-tracks":
        return (
          <div className="grid lg:grid-cols-[220px_1fr] gap-6">
            <div className="space-y-2">
              {personaTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedPersona(track.id)}
                  className={cn(
                    "section-frame w-full rounded-[12px] px-4 py-3 text-left",
                    selectedPersona === track.id ? "border-[#00e5cc]/45 bg-[#00e5cc]/10" : "hover:border-[#00e5cc]/25"
                  )}
                >
                  <div className="text-white font-semibold">{track.label}</div>
                  <div className="text-xs text-[#8d97af] mt-1">{track.summary}</div>
                </button>
              ))}
            </div>

            <Card className="section-frame p-5 sm:p-6">
              <h3 className="text-xl text-white font-bold">{selectedPersonaData.label} Track</h3>
              <p className="text-sm text-[#9aa5bd] mt-2">{selectedPersonaData.summary}</p>
              <div className="space-y-2 mt-5">
                {selectedPersonaData.playlist.map((item, index) => {
                  const progress = personaProgress[selectedPersonaData.id] ?? 0;
                  const done = index <= progress;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "rounded-[10px] border px-3 py-3 text-sm",
                        done ? "border-[#3dbb6e]/55 bg-[#3dbb6e]/10 text-[#d9f5e2]" : "border-[#2f3648] bg-[#0f131d] text-[#9aa5bd]"
                      )}
                    >
                      <span className="mr-2 text-xs">{done ? "✓" : `${index + 1}.`}</span>
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setPersonaProgress((prev) => {
                      const current = prev[selectedPersonaData.id] ?? 0;
                      const max = selectedPersonaData.playlist.length - 1;
                      return { ...prev, [selectedPersonaData.id]: Math.min(current + 1, max) };
                    })
                  }
                >
                  Mark next step done
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setPersonaProgress((prev) => ({ ...prev, [selectedPersonaData.id]: 0 }))
                  }
                >
                  Reset track
                </Button>
              </div>
            </Card>
          </div>
        );

      case "symptom-solver":
        return (
          <Card className="section-frame p-5 sm:p-6">
            <div className="flex flex-wrap gap-2 mb-5">
              {symptoms.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSymptom(item.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs border",
                    selectedSymptom === item.id ? "border-[#00e5cc] bg-[#00e5cc]/15 text-[#00e5cc]" : "border-[#2f3648] text-[#8d97af]"
                  )}
                >
                  {item.symptom}
                </button>
              ))}
            </div>

            <h3 className="text-lg text-white font-bold">{selectedSymptomData.symptom}</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-[12px] border border-[#2f3648] bg-[#0f131d] p-4">
                <div className="text-xs uppercase tracking-wider text-[#00e5cc] mb-2">Immediate fixes</div>
                <ul className="space-y-2 text-sm text-[#c9d1e3]">
                  {selectedSymptomData.immediate.map((line, index) => (
                    <li key={index}>• {line}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[12px] border border-[#2f3648] bg-[#0f131d] p-4">
                <div className="text-xs uppercase tracking-wider text-[#e8a838] mb-2">Deep fixes</div>
                <ul className="space-y-2 text-sm text-[#c9d1e3]">
                  {selectedSymptomData.deep.map((line, index) => (
                    <li key={index}>• {line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        );

      case "command-palette":
        return (
          <Card className="section-frame p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Docs command palette</h3>
                <p className="text-sm text-[#9aa5bd] mt-1">Use / (or Ctrl/Cmd + K) to jump anywhere in docs instantly.</p>
              </div>
              <Button variant="secondary" onClick={() => setPaletteOpen(true)}>Open palette</Button>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {[
                ["Open command palette", "/"],
                ["Open command palette", "Ctrl/Cmd + K"],
                ["Close palette", "Esc"],
                ["Jump to section", "Type section name"]
              ].map(([label, key]) => (
                <div key={label + key} className="rounded-[10px] border border-[#2f3648] bg-[#0f131d] px-3 py-3 flex items-center justify-between">
                  <span className="text-sm text-[#c9d1e3]">{label}</span>
                  <span className="text-xs text-[#00e5cc] font-mono">{key}</span>
                </div>
              ))}
            </div>
          </Card>
        );

      case "mini-sandboxes":
        return (
          <div className="grid xl:grid-cols-2 gap-6">
            <Card className="section-frame p-5">
              <h3 className="text-lg font-bold text-white">Pattern mini-grid</h3>
              <p className="text-sm text-[#9aa5bd] mt-1">Tap cells to sketch a groove idea.</p>
              <div className="mt-4 space-y-3">
                {Object.entries(patternRows).map(([row, values]) => (
                  <div key={row} className="grid grid-cols-[56px_1fr] gap-2 items-center">
                    <div className="text-xs text-[#8d97af] uppercase">{row}</div>
                    <div className="grid grid-cols-16 gap-1">
                      {values.map((value, idx) => (
                        <button
                          key={`${row}-${idx}`}
                          onClick={() => togglePatternCell(row, idx)}
                          className={cn(
                            "h-5 rounded-[4px] border",
                            value ? "bg-[#7c3aed] border-[#a79af5]" : "bg-[#111725] border-[#2d3446]"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="section-frame p-5">
              <h3 className="text-lg font-bold text-white">Routing mini-lab</h3>
              <p className="text-sm text-[#9aa5bd] mt-1">Toggle processing blocks to inspect chain behavior.</p>
              <div className="mt-4 space-y-2">
                {Object.entries(routingToggles).map(([node, active]) => (
                  <button
                    key={node}
                    onClick={() => setRoutingToggles((prev) => ({ ...prev, [node]: !active }))}
                    className={cn(
                      "w-full rounded-[10px] border px-3 py-3 text-left flex items-center justify-between",
                      active ? "border-[#00e5cc]/50 bg-[#00e5cc]/10" : "border-[#2f3648] bg-[#0f131d]"
                    )}
                  >
                    <span className="text-sm text-[#d4dae8] uppercase">{node}</span>
                    <span className={cn("text-xs", active ? "text-[#00e5cc]" : "text-[#79839b]")}>{active ? "ON" : "OFF"}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-[10px] border border-[#2f3648] bg-[#0f131d] p-3 text-sm text-[#c9d1e3]">
                Current chain: {Object.entries(routingToggles).filter(([, active]) => active).map(([node]) => node.toUpperCase()).join(" → ") || "BYPASS"}
              </div>
            </Card>
          </div>
        );

      case "changes-for-me":
        return (
          <Card className="section-frame p-5 sm:p-6">
            <div className="flex flex-wrap gap-2 mb-5">
              {workflowImpact.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedWorkflowImpact(item.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs border",
                    selectedWorkflowImpact === item.id ? "border-[#00e5cc] bg-[#00e5cc]/15 text-[#00e5cc]" : "border-[#2f3648] text-[#8d97af]"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {selectedImpactData.notes.map((note, index) => (
                <div key={index} className="rounded-[12px] border border-[#2f3648] bg-[#0f131d] p-4">
                  <div className="text-xs text-[#00e5cc] uppercase tracking-wider">{note.version}</div>
                  <div className="text-sm text-white mt-1">{note.change}</div>
                  <div className="text-sm text-[#9aa5bd] mt-2">Impact: {note.impact}</div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4" onClick={() => setPage("changelog")}>
              Open full changelog
            </Button>
          </Card>
        );

      case "community-breakdowns":
        return (
          <div className="grid gap-3">
            {communityBreakdowns.map((item) => (
              <Card key={item.id} className="section-frame p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg text-white font-bold">{item.title}</h3>
                    <p className="text-xs text-[#00e5cc] mt-1">{item.genre}</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setActiveSection("patch-recipes");
                      setSelectedRecipe(item.recipeId);
                      setRecipeMode("after");
                    }}
                  >
                    Open linked recipe
                  </Button>
                </div>
                <div className="mt-4 grid md:grid-cols-2 gap-3">
                  <div className="rounded-[10px] border border-[#2f3648] bg-[#0f131d] p-3">
                    <div className="text-xs uppercase tracking-wider text-[#8d97af]">Chain used</div>
                    <div className="text-sm text-[#d4dae8] mt-1">{item.chain}</div>
                  </div>
                  <div className="rounded-[10px] border border-[#2f3648] bg-[#0f131d] p-3">
                    <div className="text-xs uppercase tracking-wider text-[#8d97af]">Key takeaway</div>
                    <div className="text-sm text-[#d4dae8] mt-1">{item.takeaway}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

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
              placeholder="Search docs segments..."
              aria-label="Search documentation"
              className="w-full bg-[#151a24] border border-[#30384a] rounded-[12px] py-2 pl-9 pr-4 text-sm text-white focus:ring-2 focus:ring-[#00e5cc]/40 focus:outline-none"
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
                            ? "text-[#00e5cc] font-medium bg-[#00e5cc]/10 border border-[#00e5cc]/15"
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

      <div className="flex-1 md:ml-64 p-4 sm:p-8 md:p-12 max-w-5xl">
        <div className="mb-4 text-sm text-[#00e5cc] font-medium">{currentSection.group} / {currentSection.eyebrow}</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-5">{currentSection.title}</h1>
        <p className="text-lg text-[#d4dae8] leading-relaxed mb-7 max-w-3xl">{currentSection.summary}</p>

        <Card className="p-5 mb-7 bg-[#00e5cc]/5 section-frame">
          <h4 className="flex items-center text-[#00e5cc] font-bold mb-2">
            <BookOpen className="w-4 h-4 mr-2" /> {currentSection.calloutTitle ?? "Quick context"}
          </h4>
          <p className="text-sm text-[#d2d8e6]">
            {currentSection.callout ?? "Use this segment as a practical guide, then jump to source docs when needed."}
          </p>
        </Card>

        {renderSectionContent()}

        {!!currentSection.links?.length && (
          <>
            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Source documents</h2>
            <div className="grid gap-3">
              {currentSection.links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="section-frame rounded-[16px] px-4 py-4 flex items-center justify-between text-sm hover:border-[#00e5cc]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#00e5cc]" />
                    <span className="text-[#d4dae8]">{link.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#7d879d]" />
                </a>
              ))}
            </div>
          </>
        )}

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
            <span className="text-white group-hover:text-[#00e5cc] transition-colors">Next: {nextSection ? nextSection.title : "None"}</span>
            <ArrowRight className="w-4 h-4 text-[#98a1b7] group-hover:text-[#00e5cc]" />
          </Button>
        </div>
      </div>

      {paletteOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-[1px] p-4 sm:p-8" onClick={() => setPaletteOpen(false)}>
          <div className="max-w-2xl mx-auto mt-16 rounded-[16px] border border-[#2f3648] bg-[#0f131d] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="p-4 border-b border-[#262d3f]">
              <input
                ref={paletteInputRef}
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Type a command… (e.g. patch, troubleshooting, changelog)"
                className="w-full bg-[#111726] border border-[#30384a] rounded-[10px] py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00e5cc]/40"
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filteredPaletteActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.run();
                    setPaletteOpen(false);
                  }}
                  className="w-full text-left rounded-[10px] px-3 py-3 hover:bg-[#1a2131] transition-colors"
                >
                  <div className="text-sm text-white">{action.label}</div>
                  <div className="text-xs text-[#8d97af] mt-0.5">{action.hint}</div>
                </button>
              ))}
              {filteredPaletteActions.length === 0 && (
                <div className="px-3 py-4 text-sm text-[#8d97af]">No command matched.</div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-[#262d3f] text-xs text-[#79839b] flex justify-between">
              <span>/ or Ctrl/Cmd + K to open</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
