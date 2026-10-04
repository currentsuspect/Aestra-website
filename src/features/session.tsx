import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  CUSTOM, Engine, ROWS, VOICE_BANK, cloneGrid, defaultGrid, defaultSession, defaultVoices, voiceLabel,
  type Grid, type Row, type SessionState, type Voices,
} from "./engine";

/* ─────────────────────────────────────────────────────────────────
   One session for the whole page: a single loop, played by one engine,
   that every demo reads and edits. A change made in one place is heard
   and seen in all the others.

   Two kinds of history live here, mirroring the History design for
   v0.8.1: every change is a *step* you can go back to, and a *version*
   is a step you chose to keep, on a branch.
   ───────────────────────────────────────────────────────────────── */

export type Step = { id: number; label: string; grid: Grid; bpm: number; at: number };
export type Branch = { id: string; name: string; color: string };
export type Version = { id: number; name: string; branch: string; parent: number | null; grid: Grid; bpm: number; at: number };

export const BRANCH_COLORS = ["#7c3aed", "#62dcf0", "#f3a93b", "#3fd6ad", "#ff7a66"];
const STORAGE_KEY = "aestra-features-session-v1";

type Persisted = {
  state: SessionState;
  versions: Version[];
  branches: Branch[];
  savedAt: number;
};

const mainBranch: Branch = { id: "main", name: "Main", color: BRANCH_COLORS[0] };

/* A saved session may predate newer fields, and a dropped-in sample can't survive a reload,
   so merge onto the defaults and fall back to a built-in sound where a sample is gone. */
const sanitizeVoices = (v: Partial<Voices> | undefined): Voices => {
  const out = defaultVoices();
  for (const r of ROWS) if (v?.[r] && VOICE_BANK[r].some((x) => x.id === v[r])) out[r] = v[r]!;
  return out;
};

const load = (): Persisted | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Persisted;
    if (!p?.state?.grid || !ROWS.every((r) => Array.isArray(p.state.grid[r]) && p.state.grid[r].length === 16)) return null;
    p.state = { ...defaultSession(), ...p.state, voices: sanitizeVoices(p.state.voices), ab: "mix", refTrimDb: 0 };
    return p;
  } catch {
    return null;
  }
};

type Audio = "idle" | "on" | "unavailable";

type Ctx = {
  state: SessionState;
  playing: boolean;
  audio: Audio;
  engine: Engine;
  steps: Step[];
  cursor: number;
  versions: Version[];
  branches: Branch[];
  savedAt: number;
  closed: boolean;
  /** Change the session. Pass a label to record it as a step. */
  change: (fn: (s: SessionState) => SessionState, label?: string) => void;
  toggle: () => Promise<void>;
  goToStep: (i: number) => void;
  saveVersion: (name: string, branch?: string) => void;
  newBranch: (name: string) => void;
  restoreVersion: (id: number) => void;
  setClosed: (v: boolean) => void;
  reset: (grid: Grid, bpm: number, label: string) => void;
  /** Names of samples dropped into rows, and the reference file, for display. */
  sampleNames: Partial<Record<Row, string>>;
  refName: string | null;
  notice: string;
  setVoice: (row: Row, id: string) => void;
  loadSample: (row: Row, file: File) => Promise<void>;
  loadReference: (file: File) => Promise<void>;
  clearReference: () => void;
};

const SessionCtx = createContext<Ctx | null>(null);
export const useSession = () => {
  const c = useContext(SessionCtx);
  if (!c) throw new Error("useSession outside SessionProvider");
  return c;
};

let stepId = 1;

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const engine = useRef<Engine | null>(null);
  engine.current ??= new Engine();
  const eng = engine.current;

  const [state, setState] = useState<SessionState>(() => defaultSession());
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<Audio>("idle");
  const [steps, setSteps] = useState<Step[]>(() => [{ id: 0, label: "Opened Night Drive", grid: defaultGrid(), bpm: 92, at: 0 }]);
  const [cursor, setCursor] = useState(0);
  const [versions, setVersions] = useState<Version[]>([]);
  const [branches, setBranches] = useState<Branch[]>([mainBranch]);
  const [savedAt, setSavedAt] = useState(0);
  const [closed, setClosed] = useState(false);
  const [sampleNames, setSampleNames] = useState<Partial<Record<Row, string>>>({});
  const [refName, setRefName] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const hydrated = useRef(false);

  // Restore the last visit once, after hydration, so server and client markup match.
  useEffect(() => {
    const p = load();
    if (p) {
      setState(p.state);
      setVersions(p.versions ?? []);
      setBranches(p.branches?.length ? p.branches : [mainBranch]);
      setSavedAt(p.savedAt ?? 0);
      setSteps([{ id: 0, label: "Reopened Night Drive", grid: cloneGrid(p.state.grid), bpm: p.state.bpm, at: Date.now() }]);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    eng.update(state);
  }, [eng, state]);

  // Save after changes (debounced), so "close and reopen" is true.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const at = Date.now();
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, versions, branches, savedAt: at } satisfies Persisted));
        setSavedAt(at);
      } catch { /* private mode: the demo still works, it just won't be remembered */ }
    }, 400);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state, versions, branches]);

  const stateRef = useRef(state);
  stateRef.current = state;
  const sampleNamesRef = useRef(sampleNames);
  sampleNamesRef.current = sampleNames;
  const stepsRef = useRef({ steps, cursor });
  stepsRef.current = { steps, cursor };

  const record = useCallback((label: string, next: SessionState) => {
    const { steps: ss, cursor: c } = stepsRef.current;
    const kept = ss.slice(0, c + 1);
    kept.push({ id: stepId++, label, grid: cloneGrid(next.grid), bpm: next.bpm, at: Date.now() });
    const trimmed = kept.slice(-40);
    setSteps(trimmed);
    setCursor(trimmed.length - 1);
  }, []);

  const change = useCallback((fn: (s: SessionState) => SessionState, label?: string) => {
    const next = fn(stateRef.current);
    setState(next);
    if (label) record(label, next);
  }, [record]);

  const toggle = useCallback(async () => {
    if (eng.playing) {
      eng.stop();
      setPlaying(false);
      return;
    }
    const ok = await eng.ensure();
    if (!ok) { setAudio("unavailable"); return; }
    setAudio("on");
    await eng.start();
    setPlaying(eng.playing);
  }, [eng]);

  useEffect(() => () => eng.stop(), [eng]);

  // A hidden tab throttles timers, which would make the loop stutter: stop it, and save the work.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && eng.playing) { eng.stop(); setPlaying(false); }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [eng]);

  const goToStep = useCallback((i: number) => {
    const s = stepsRef.current.steps[i];
    if (!s) return;
    setState((prev) => ({ ...prev, grid: cloneGrid(s.grid), bpm: s.bpm }));
    setCursor(i);
  }, []);

  const saveVersion = useCallback((name: string, branch = "main") => {
    setVersions((vs) => {
      const parent = [...vs].reverse().find((v) => v.branch === branch)?.id ?? null;
      return [...vs, { id: Date.now(), name: name.trim() || `Version ${vs.length + 1}`, branch, parent, grid: cloneGrid(stateRef.current.grid), bpm: stateRef.current.bpm, at: Date.now() }];
    });
  }, []);

  const branchesRef = useRef<Branch[]>([mainBranch]);
  branchesRef.current = branches;
  const newBranch = useCallback((name: string) => {
    const bs = branchesRef.current;
    const id = `b${bs.length}`;
    const nb: Branch = { id, name: name.trim() || `Branch ${bs.length}`, color: BRANCH_COLORS[bs.length % BRANCH_COLORS.length] };
    setBranches([...bs, nb]);
    setVersions((vs) => [...vs, { id: Date.now(), name: nb.name, branch: id, parent: vs.length ? vs[vs.length - 1].id : null, grid: cloneGrid(stateRef.current.grid), bpm: stateRef.current.bpm, at: Date.now() }]);
  }, []);

  const versionsRef = useRef<Version[]>([]);
  versionsRef.current = versions;
  const restoreVersion = useCallback((id: number) => {
    const v = versionsRef.current.find((x) => x.id === id);
    if (!v) return;
    const next = { ...stateRef.current, grid: cloneGrid(v.grid), bpm: v.bpm };
    setState(next);
    record(`Went back to ${v.name}`, next);
  }, [record]);

  const reset = useCallback((grid: Grid, bpm: number, label: string) => {
    const next = { ...stateRef.current, grid: cloneGrid(grid), bpm };
    setState(next);
    record(label, next);
  }, [record]);

  const setVoice = useCallback((row: Row, id: string) => {
    const names = sampleNamesRef.current;
    change((s) => ({ ...s, voices: { ...s.voices, [row]: id } }), `Swapped ${row} to ${voiceLabel(row, id, names[row])}`);
    eng.preview(row, id);
  }, [change, eng]);

  const loadSample = useCallback(async (row: Row, file: File) => {
    setNotice("");
    const err = await eng.loadSample(row, file);
    if (err) { setNotice(err); return; }
    const name = file.name.replace(/\.[^.]+$/, "").slice(0, 18);
    setSampleNames((n) => ({ ...n, [row]: name }));
    change((s) => ({ ...s, voices: { ...s.voices, [row]: CUSTOM } }), `Dropped ${name} into ${row}`);
    eng.preview(row, CUSTOM);
  }, [change, eng]);

  const loadReference = useCallback(async (file: File) => {
    setNotice("");
    const err = await eng.loadReference(file);
    if (err) { setNotice(err); return; }
    setRefName(file.name.replace(/\.[^.]+$/, "").slice(0, 28));
  }, [eng]);

  const clearReference = useCallback(() => { eng.clearReference(); setRefName(null); }, [eng]);

  const value = useMemo<Ctx>(() => ({
    state, playing, audio, engine: eng, steps, cursor, versions, branches, savedAt, closed,
    change, toggle, goToStep, saveVersion, newBranch, restoreVersion, setClosed, reset,
    sampleNames, refName, notice, setVoice, loadSample, loadReference, clearReference,
  }), [state, playing, audio, eng, steps, cursor, versions, branches, savedAt, closed, change, toggle, goToStep, saveVersion, newBranch, restoreVersion, reset, sampleNames, refName, notice, setVoice, loadSample, loadReference, clearReference]);

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
};

/* The step sounding right now (-1 when stopped), re-rendering only when it changes. */
export const useStep = () => {
  const { engine, playing } = useSession();
  const subscribe = useCallback((notify: () => void) => {
    if (!playing) return () => {};
    let af = 0;
    let last = -2;
    const tick = () => {
      const s = engine.currentStep();
      if (s !== last) { last = s; notify(); }
      af = requestAnimationFrame(tick);
    };
    af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [engine, playing]);
  return useSyncExternalStore(subscribe, () => (playing ? engine.currentStep() : -1), () => -1);
};

export const toggleCell = (g: Grid, row: Row, i: number): Grid => ({ ...cloneGrid(g), [row]: g[row].map((v, k) => (k === i ? !v : v)) });
