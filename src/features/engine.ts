/* ─────────────────────────────────────────────────────────────────
   The audio behind the Features page: one small drum loop played with the
   Web Audio API, so every demo on the page touches the same, real sound.

   Nothing here is Aestra's engine. It is a browser stand-in used to show
   ideas (a step grid, a routing map, listening profiles, named takes), and
   the page says so wherever a demo leans on it.

   The AudioContext is only created after a click, which browsers require
   before they will make sound. Nothing here touches `window` at import.
   ───────────────────────────────────────────────────────────────── */

export const STEPS = 16;
export const ROWS = ["kick", "snare", "hat", "bass"] as const;
export type Row = (typeof ROWS)[number];
export type Grid = Record<Row, boolean[]>;
export type Route = "drums" | "master";
export type Profile = "studio" | "streaming" | "car" | "earbuds" | "phone";

export type SessionState = {
  grid: Grid;
  bpm: number;
  routes: Record<Row, Route>;
  muted: Row[];
  busLevel: number;
  profile: Profile;
};

const on = (...steps: number[]) => Array.from({ length: STEPS }, (_, i) => steps.includes(i));

export const defaultGrid = (): Grid => ({
  kick: on(0, 6, 10),
  snare: on(4, 12),
  hat: on(0, 2, 4, 6, 8, 10, 12, 14),
  bass: on(0, 3, 6, 11),
});

export const emptyGrid = (): Grid => ({
  kick: on(), snare: on(), hat: on(), bass: on(),
});

export const cloneGrid = (g: Grid): Grid => ({
  kick: [...g.kick], snare: [...g.snare], hat: [...g.hat], bass: [...g.bass],
});

export const defaultSession = (): SessionState => ({
  grid: defaultGrid(),
  bpm: 92,
  routes: { kick: "drums", snare: "drums", hat: "drums", bass: "master" },
  muted: [],
  busLevel: 0.85,
  profile: "studio",
});

/* ── Listening profiles ──────────────────────────────────────────────
   Plain filter chains that suggest how a mix changes on other speakers,
   named and described after the Audition "Listen on" design for v0.8.1.
   They illustrate the idea of auditioning; they are not a model of any
   real device. */
type Band = { type: BiquadFilterType; frequency: number; Q?: number; gain?: number };
export const PROFILE_ORDER: Profile[] = ["studio", "streaming", "car", "earbuds", "phone"];
export const PROFILES: Record<Profile, { label: string; note: string; gainDb: number; bands: Band[] }> = {
  studio: { label: "Studio", note: "Bypass. What you mixed.", gainDb: 0, bands: [] },
  streaming: {
    label: "Streaming, normalised",
    note: "Turned down to the streaming level, so a loud mix loses its edge.",
    gainDb: -4.2,
    bands: [],
  },
  car: {
    label: "Car",
    note: "More bass below 60 Hz, a softer top end above 10 kHz.",
    gainDb: 0,
    bands: [
      { type: "lowshelf", frequency: 60, gain: 4 },
      { type: "highshelf", frequency: 10000, gain: -3 },
    ],
  },
  earbuds: {
    label: "Earbuds",
    note: "Mild low lift, rolled-off top.",
    gainDb: 0,
    bands: [
      { type: "lowshelf", frequency: 120, gain: 2.5 },
      { type: "highshelf", frequency: 9000, gain: -3.5 },
    ],
  },
  phone: {
    label: "Phone speaker",
    note: "Nothing below 300 Hz.",
    gainDb: 0,
    bands: [
      { type: "highpass", frequency: 300, Q: 0.8 },
      { type: "lowpass", frequency: 7000, Q: 0.7 },
      { type: "peaking", frequency: 2200, Q: 1, gain: 2 },
    ],
  },
};

/* Magnitude response of a profile in dB at the given frequencies, computed
   from the same filter definitions the sound goes through. */
let offline: OfflineAudioContext | null = null;
export const profileCurve = (profile: Profile, freqs: Float32Array): Float32Array => {
  const out = new Float32Array(freqs.length).fill(PROFILES[profile].gainDb);
  const bands = PROFILES[profile].bands;
  if (!bands.length || typeof OfflineAudioContext === "undefined") return out;
  offline ??= new OfflineAudioContext(1, 1, 44100);
  const mag = new Float32Array(freqs.length);
  const phase = new Float32Array(freqs.length);
  for (const b of bands) {
    const f = offline.createBiquadFilter();
    f.type = b.type;
    f.frequency.value = b.frequency;
    if (b.Q !== undefined) f.Q.value = b.Q;
    if (b.gain !== undefined) f.gain.value = b.gain;
    f.getFrequencyResponse(freqs, mag, phase);
    for (let i = 0; i < out.length; i++) out[i] += 20 * Math.log10(Math.max(mag[i], 1e-4));
  }
  return out;
};

/* ── The engine ──────────────────────────────────────────────────────── */
type Voice = (ctx: AudioContext, out: AudioNode, t: number, noise: AudioBuffer) => void;

const VOICES: Record<Row, Voice> = {
  kick(ctx, out, t) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + 0.4);
  },
  snare(ctx, out, t, noise) {
    const n = ctx.createBufferSource();
    n.buffer = noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1100;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    n.connect(hp).connect(g).connect(out);
    n.start(t);
    n.stop(t + 0.25);
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(190, t);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.45, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o.connect(og).connect(out);
    o.start(t);
    o.stop(t + 0.15);
  },
  hat(ctx, out, t, noise) {
    const n = ctx.createBufferSource();
    n.buffer = noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.28, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(hp).connect(g).connect(out);
    n.start(t);
    n.stop(t + 0.07);
  },
  bass(ctx, out, t) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = 55;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(700, t);
    lp.frequency.exponentialRampToValueAtTime(140, t + 0.28);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
    o.connect(lp).connect(g).connect(out);
    o.start(t);
    o.stop(t + 0.36);
  },
};

const LOOKAHEAD = 0.28; // seconds scheduled ahead, so a stalled screen never starves the audio
const TICK_MS = 25;

export class Engine {
  ctx: AudioContext | null = null;
  state: SessionState = defaultSession();
  playing = false;

  private rowGain = {} as Record<Row, GainNode>;
  private rowTap = {} as Record<Row, AnalyserNode>;
  private bus: GainNode | null = null;
  private masterIn: GainNode | null = null;
  private chainNodes: AudioNode[] = [];
  private masterTap: AnalyserNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStep = 0;
  private nextTime = 0;
  private queue: { step: number; time: number }[] = [];
  private scratch = new Uint8Array(256);

  get available() {
    return typeof window !== "undefined" && (typeof AudioContext !== "undefined" || "webkitAudioContext" in window);
  }

  /** Create the audio graph. Must be called from a click or key press. */
  async ensure(): Promise<boolean> {
    if (!this.available) return false;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      this.ctx = ctx;

      const len = ctx.sampleRate;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = buf;

      this.masterIn = ctx.createGain();
      this.bus = ctx.createGain();
      this.bus.connect(this.masterIn);

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 6;
      const out = ctx.createGain();
      out.gain.value = 0.7;
      this.outGain = out;
      this.masterTap = ctx.createAnalyser();
      this.masterTap.fftSize = 2048;
      this.masterTap.minDecibels = -78;
      this.masterTap.maxDecibels = -8;
      this.masterTap.smoothingTimeConstant = 0.8;
      comp.connect(out);
      out.connect(this.masterTap);
      this.masterTap.connect(ctx.destination);
      this.chainEnd = comp;

      for (const row of ROWS) {
        const g = ctx.createGain();
        const tap = ctx.createAnalyser();
        tap.fftSize = 256;
        g.connect(tap);
        this.rowGain[row] = g;
        this.rowTap[row] = tap;
      }
      this.applyRouting();
      this.applyProfile();
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
    return true;
  }
  private chainEnd: AudioNode | null = null;
  private outGain: GainNode | null = null;

  /** Push a new session state into the running graph. */
  update(next: SessionState) {
    const prev = this.state;
    this.state = next;
    if (!this.ctx) return;
    if (prev.routes !== next.routes || prev.muted !== next.muted || prev.busLevel !== next.busLevel) this.applyRouting();
    if (prev.profile !== next.profile) this.applyProfile();
  }

  private applyRouting() {
    const ctx = this.ctx;
    if (!ctx || !this.bus || !this.masterIn) return;
    const { routes, muted, busLevel } = this.state;
    this.bus.gain.setTargetAtTime(busLevel, ctx.currentTime, 0.02);
    for (const row of ROWS) {
      const g = this.rowGain[row];
      const tap = this.rowTap[row];
      tap.disconnect();
      tap.connect(routes[row] === "drums" ? this.bus : this.masterIn);
      g.gain.setTargetAtTime(muted.includes(row) ? 0 : 1, ctx.currentTime, 0.015);
    }
  }

  private applyProfile() {
    const ctx = this.ctx;
    if (!ctx || !this.masterIn || !this.chainEnd) return;
    this.masterIn.disconnect();
    for (const n of this.chainNodes) n.disconnect();
    this.chainNodes = [];
    let node: AudioNode = this.masterIn;
    for (const b of PROFILES[this.state.profile].bands) {
      const f = ctx.createBiquadFilter();
      f.type = b.type;
      f.frequency.value = b.frequency;
      if (b.Q !== undefined) f.Q.value = b.Q;
      if (b.gain !== undefined) f.gain.value = b.gain;
      node.connect(f);
      this.chainNodes.push(f);
      node = f;
    }
    node.connect(this.chainEnd);
    if (this.outGain) this.outGain.gain.setTargetAtTime(0.7 * 10 ** (PROFILES[this.state.profile].gainDb / 20), ctx.currentTime, 0.03);
  }

  async start() {
    if (!(await this.ensure()) || !this.ctx || this.playing) return;
    this.playing = true;
    this.nextStep = 0;
    this.nextTime = this.ctx.currentTime + 0.06;
    this.queue = [];
    this.timer = setInterval(() => this.pump(), TICK_MS);
    this.pump();
  }

  stop() {
    this.playing = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.queue = [];
  }

  private pump() {
    const ctx = this.ctx;
    if (!ctx || !this.playing || !this.noise) return;
    const stepLen = 60 / this.state.bpm / 4;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
      const step = this.nextStep;
      for (const row of ROWS) {
        if (this.state.grid[row][step]) VOICES[row](ctx, this.rowGain[row], this.nextTime, this.noise);
      }
      this.queue.push({ step, time: this.nextTime });
      this.nextStep = (step + 1) % STEPS;
      this.nextTime += stepLen;
    }
    if (this.queue.length > 64) this.queue.splice(0, this.queue.length - 64);
  }

  /** The step that is sounding right now, or -1 when stopped. */
  currentStep(): number {
    if (!this.ctx || !this.playing) return -1;
    const now = this.ctx.currentTime;
    let cur = -1;
    for (const q of this.queue) if (q.time <= now) cur = q.step;
    return cur;
  }

  /** Output level of one row, 0..1, read after its mute. */
  level(row: Row): number {
    const tap = this.rowTap[row];
    if (!tap || !this.playing) return 0;
    tap.getByteTimeDomainData(this.scratch);
    let peak = 0;
    for (let i = 0; i < tap.fftSize; i++) peak = Math.max(peak, Math.abs(this.scratch[i] - 128));
    return Math.min(1, peak / 90);
  }

  /** Spectrum of what comes out of the speakers, as 0..255 values. */
  spectrum(into: Uint8Array): boolean {
    if (!this.masterTap) return false;
    this.masterTap.getByteFrequencyData(into);
    return true;
  }
  get spectrumBins() {
    return this.masterTap?.frequencyBinCount ?? 0;
  }
  get sampleRate() {
    return this.ctx?.sampleRate ?? 44100;
  }
}
