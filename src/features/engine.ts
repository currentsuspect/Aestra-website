/* ─────────────────────────────────────────────────────────────────
   The audio behind the Features page: one small drum loop played with the
   Web Audio API, so every demo on the page touches the same, real sound.

   Nothing here is Aestra's engine. It is a browser stand-in used to show
   ideas (a step grid, swappable sounds, a routing map, listening profiles,
   an A/B reference, named versions), and the page says so where a demo
   leans on it.

   The AudioContext is only created after a click, which browsers require
   before they will make sound. Nothing here touches `window` at import.
   Any sample a visitor drops in is decoded in their browser and never
   leaves it.
   ───────────────────────────────────────────────────────────────── */

export const STEPS = 16;
export const ROWS = ["kick", "snare", "hat", "bass"] as const;
export type Row = (typeof ROWS)[number];
export type Grid = Record<Row, boolean[]>;
export type Route = "drums" | "master";
export type Profile = "studio" | "streaming" | "car" | "earbuds" | "phone";
export type AB = "mix" | "ref";

/* The sounds each row can play. "custom" is a sample the visitor dropped in. */
export const VOICE_BANK: Record<Row, { id: string; label: string }[]> = {
  kick: [{ id: "punch", label: "Punch" }, { id: "808", label: "808" }, { id: "soft", label: "Soft" }],
  snare: [{ id: "snare", label: "Snare" }, { id: "clap", label: "Clap" }, { id: "rim", label: "Rim" }],
  hat: [{ id: "closed", label: "Closed" }, { id: "open", label: "Open" }, { id: "shaker", label: "Shaker" }],
  bass: [{ id: "saw", label: "Saw" }, { id: "sub", label: "Sub" }, { id: "pluck", label: "Pluck" }],
};
export const CUSTOM = "custom";
export type Voices = Record<Row, string>;
export const defaultVoices = (): Voices => ({ kick: "punch", snare: "snare", hat: "closed", bass: "saw" });
export const voiceLabel = (row: Row, id: string, sample?: string) =>
  id === CUSTOM ? sample ?? "Your sound" : VOICE_BANK[row].find((v) => v.id === id)?.label ?? id;

export type SessionState = {
  grid: Grid;
  bpm: number;
  routes: Record<Row, Route>;
  muted: Row[];
  busLevel: number;
  profile: Profile;
  voices: Voices;
  ab: AB;
  refTrimDb: number;
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
  voices: defaultVoices(),
  ab: "mix",
  refTrimDb: 0,
});

/* The built-in reference: a different, tighter groove to flip against. */
const REF_GRID: Grid = {
  kick: on(0, 4, 8, 12),
  snare: on(4, 12),
  hat: on(2, 6, 10, 14),
  bass: on(0, 3, 8, 11),
};
const REF_VOICES: Voices = { kick: "punch", snare: "clap", hat: "open", bass: "sub" };

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

/* ── Voices ──────────────────────────────────────────────────────────── */
type Voice = (ctx: AudioContext, out: AudioNode, t: number, noise: AudioBuffer) => void;

const tone = (ctx: AudioContext, out: AudioNode, t: number, o: { type?: OscillatorType; f0: number; f1?: number; sweep?: number; peak: number; decay: number; lp?: [number, number] }) => {
  const osc = ctx.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.f0, t);
  if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + (o.sweep ?? 0.12));
  const g = ctx.createGain();
  g.gain.setValueAtTime(o.peak, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + o.decay);
  let node: AudioNode = osc;
  if (o.lp) {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(o.lp[0], t);
    lp.frequency.exponentialRampToValueAtTime(o.lp[1], t + o.decay * 0.8);
    osc.connect(lp);
    node = lp;
  }
  node.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + o.decay + 0.03);
};

const burst = (ctx: AudioContext, out: AudioNode, t: number, noise: AudioBuffer, o: { type: BiquadFilterType; f: number; q?: number; peak: number; decay: number; attack?: number }) => {
  const n = ctx.createBufferSource();
  n.buffer = noise;
  const filt = ctx.createBiquadFilter();
  filt.type = o.type;
  filt.frequency.value = o.f;
  if (o.q) filt.Q.value = o.q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(o.attack ? 0.001 : o.peak, t);
  if (o.attack) g.gain.linearRampToValueAtTime(o.peak, t + o.attack);
  g.gain.exponentialRampToValueAtTime(0.001, t + (o.attack ?? 0) + o.decay);
  n.connect(filt).connect(g).connect(out);
  n.start(t);
  n.stop(t + (o.attack ?? 0) + o.decay + 0.03);
};

const VOICES: Record<string, Voice> = {
  "kick:punch": (c, o, t) => tone(c, o, t, { f0: 150, f1: 42, sweep: 0.13, peak: 1, decay: 0.38 }),
  "kick:808": (c, o, t) => tone(c, o, t, { f0: 110, f1: 38, sweep: 0.22, peak: 1, decay: 0.95 }),
  "kick:soft": (c, o, t) => tone(c, o, t, { f0: 95, f1: 52, sweep: 0.09, peak: 0.8, decay: 0.26 }),
  "snare:snare": (c, o, t, n) => {
    burst(c, o, t, n, { type: "highpass", f: 1100, peak: 0.7, decay: 0.2 });
    tone(c, o, t, { type: "triangle", f0: 190, peak: 0.45, decay: 0.12 });
  },
  "snare:clap": (c, o, t, n) => {
    for (const d of [0, 0.011, 0.023]) burst(c, o, t + d, n, { type: "bandpass", f: 1500, q: 0.9, peak: 0.55, decay: 0.03 });
    burst(c, o, t + 0.03, n, { type: "bandpass", f: 1400, q: 0.8, peak: 0.5, decay: 0.2 });
  },
  "snare:rim": (c, o, t, n) => {
    tone(c, o, t, { type: "square", f0: 480, peak: 0.28, decay: 0.05 });
    burst(c, o, t, n, { type: "bandpass", f: 3200, q: 1.2, peak: 0.4, decay: 0.05 });
  },
  "hat:closed": (c, o, t, n) => burst(c, o, t, n, { type: "highpass", f: 7200, peak: 0.28, decay: 0.05 }),
  "hat:open": (c, o, t, n) => burst(c, o, t, n, { type: "highpass", f: 6200, peak: 0.26, decay: 0.24 }),
  "hat:shaker": (c, o, t, n) => burst(c, o, t, n, { type: "bandpass", f: 5600, q: 0.7, peak: 0.3, decay: 0.09, attack: 0.012 }),
  "bass:saw": (c, o, t) => tone(c, o, t, { type: "sawtooth", f0: 55, peak: 0.55, decay: 0.34, lp: [700, 140] }),
  "bass:sub": (c, o, t) => tone(c, o, t, { f0: 55, peak: 0.85, decay: 0.42 }),
  "bass:pluck": (c, o, t) => tone(c, o, t, { type: "square", f0: 110, peak: 0.32, decay: 0.16, lp: [1800, 220] }),
};

const LOOKAHEAD = 0.28; // seconds scheduled ahead, so a stalled screen never starves the audio
const TICK_MS = 25;
const MAX_SAMPLE_SECONDS = 2.5;
const MAX_FILE_BYTES = 12 * 1024 * 1024;

export class Engine {
  ctx: AudioContext | null = null;
  state: SessionState = defaultSession();
  playing = false;

  private rowGain = {} as Record<Row, GainNode>;
  private rowTap = {} as Record<Row, AnalyserNode>;
  private bus: GainNode | null = null;
  private mixSum: GainNode | null = null;
  private mixGain: GainNode | null = null;
  private mixTap: AnalyserNode | null = null;
  private refSum: GainNode | null = null;
  private refTrim: GainNode | null = null;
  private refGain: GainNode | null = null;
  private refTap: AnalyserNode | null = null;
  private masterIn: GainNode | null = null;
  private chainNodes: AudioNode[] = [];
  private chainEnd: AudioNode | null = null;
  private outGain: GainNode | null = null;
  private masterTap: AnalyserNode | null = null;
  private noise: AudioBuffer | null = null;
  private samples: Partial<Record<Row, AudioBuffer>> = {};
  private refBuffer: AudioBuffer | null = null;
  private refSource: AudioBufferSourceNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStep = 0;
  private nextTime = 0;
  private queue: { step: number; time: number }[] = [];
  private scratch = new Uint8Array(256);
  private floats = new Float32Array(2048);

  get available() {
    return typeof window !== "undefined" && (typeof AudioContext !== "undefined" || "webkitAudioContext" in window);
  }
  get hasReferenceFile() {
    return this.refBuffer !== null;
  }
  hasSample(row: Row) {
    return Boolean(this.samples[row]);
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

      const tap = (size: number) => {
        const a = ctx.createAnalyser();
        a.fftSize = size;
        return a;
      };

      this.masterIn = ctx.createGain();
      this.bus = ctx.createGain();
      this.mixSum = ctx.createGain();
      this.mixGain = ctx.createGain();
      this.mixTap = tap(2048);
      this.refSum = ctx.createGain();
      this.refTrim = ctx.createGain();
      this.refGain = ctx.createGain();
      this.refTap = tap(2048);

      this.bus.connect(this.mixSum);
      this.mixSum.connect(this.mixTap);
      this.mixSum.connect(this.mixGain).connect(this.masterIn);
      this.refSum.connect(this.refTap);
      this.refSum.connect(this.refTrim).connect(this.refGain).connect(this.masterIn);

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
        const t = tap(256);
        g.connect(t);
        this.rowGain[row] = g;
        this.rowTap[row] = t;
      }
      this.applyRouting();
      this.applyProfile();
      this.applyAB(true);
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
    return true;
  }

  /** Push a new session state into the running graph. */
  update(next: SessionState) {
    const prev = this.state;
    this.state = next;
    if (!this.ctx) return;
    if (prev.routes !== next.routes || prev.muted !== next.muted || prev.busLevel !== next.busLevel) this.applyRouting();
    if (prev.profile !== next.profile) this.applyProfile();
    if (prev.ab !== next.ab || prev.refTrimDb !== next.refTrimDb) this.applyAB(false);
  }

  private applyRouting() {
    const ctx = this.ctx;
    if (!ctx || !this.bus || !this.mixSum) return;
    const { routes, muted, busLevel } = this.state;
    this.bus.gain.setTargetAtTime(busLevel, ctx.currentTime, 0.02);
    for (const row of ROWS) {
      const tap = this.rowTap[row];
      tap.disconnect();
      tap.connect(routes[row] === "drums" ? this.bus : this.mixSum);
      this.rowGain[row].gain.setTargetAtTime(muted.includes(row) ? 0 : 1, ctx.currentTime, 0.015);
    }
  }

  private applyAB(immediate: boolean) {
    const ctx = this.ctx;
    if (!ctx || !this.mixGain || !this.refGain || !this.refTrim) return;
    const t = immediate ? 0.001 : 0.015;
    this.mixGain.gain.setTargetAtTime(this.state.ab === "mix" ? 1 : 0, ctx.currentTime, t);
    this.refGain.gain.setTargetAtTime(this.state.ab === "ref" ? 1 : 0, ctx.currentTime, t);
    this.refTrim.gain.setTargetAtTime(10 ** (this.state.refTrimDb / 20), ctx.currentTime, 0.02);
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

  /* ── Samples and reference files (decoded locally, never uploaded) ── */
  private async decode(data: ArrayBuffer): Promise<AudioBuffer | null> {
    if (!(await this.ensure()) || !this.ctx) return null;
    try {
      return await this.ctx.decodeAudioData(data.slice(0));
    } catch {
      return null;
    }
  }

  /** Use an audio file as the sound for one row. Returns an error message or null. */
  async loadSample(row: Row, file: File): Promise<string | null> {
    if (file.size > MAX_FILE_BYTES) return "That file is too big for the demo (12 MB max).";
    const buf = await this.decode(await file.arrayBuffer());
    if (!buf || !this.ctx) return "That doesn't look like an audio file this browser can play.";
    const frames = Math.min(buf.length, Math.floor(MAX_SAMPLE_SECONDS * buf.sampleRate));
    const out = this.ctx.createBuffer(1, frames, buf.sampleRate);
    const dst = out.getChannelData(0);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const src = buf.getChannelData(c);
      for (let i = 0; i < frames; i++) dst[i] += src[i] / buf.numberOfChannels;
    }
    let peak = 0;
    for (let i = 0; i < frames; i++) peak = Math.max(peak, Math.abs(dst[i]));
    const k = peak > 0 ? 0.85 / peak : 1;
    for (let i = 0; i < frames; i++) dst[i] *= k;
    const fade = Math.min(frames, 220);
    for (let i = 0; i < fade; i++) dst[frames - 1 - i] *= i / fade;
    this.samples[row] = out;
    return null;
  }

  /** Use an audio file as the reference track to flip against. */
  async loadReference(file: File): Promise<string | null> {
    if (file.size > MAX_FILE_BYTES) return "That file is too big for the demo (12 MB max).";
    const buf = await this.decode(await file.arrayBuffer());
    if (!buf) return "That doesn't look like an audio file this browser can play.";
    this.refBuffer = buf;
    if (this.playing) this.startRefSource(this.ctx!.currentTime + 0.05);
    return null;
  }

  clearReference() {
    this.refBuffer = null;
    this.stopRefSource();
  }

  private startRefSource(at: number) {
    this.stopRefSource();
    if (!this.ctx || !this.refBuffer || !this.refSum) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.refBuffer;
    src.loop = true;
    src.connect(this.refSum);
    src.start(at);
    this.refSource = src;
  }
  private stopRefSource() {
    try { this.refSource?.stop(); } catch { /* already stopped */ }
    this.refSource?.disconnect();
    this.refSource = null;
  }

  /** Play one hit of a row's current sound, so a swap can be heard straight away. */
  preview(row: Row, voice: string = this.state.voices[row]) {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return;
    this.hit(row, voice, this.rowGain[row], ctx.currentTime + 0.01);
  }

  private hit(row: Row, voice: string, out: AudioNode, t: number) {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return;
    if (voice === CUSTOM && this.samples[row]) {
      const s = ctx.createBufferSource();
      s.buffer = this.samples[row]!;
      s.connect(out);
      s.start(t);
      return;
    }
    (VOICES[`${row}:${voice}`] ?? VOICES[`${row}:${VOICE_BANK[row][0].id}`])(ctx, out, t, this.noise);
  }

  async start() {
    if (!(await this.ensure()) || !this.ctx || this.playing) return;
    this.playing = true;
    this.nextStep = 0;
    this.nextTime = this.ctx.currentTime + 0.06;
    this.queue = [];
    if (this.refBuffer) this.startRefSource(this.nextTime);
    this.timer = setInterval(() => this.pump(), TICK_MS);
    this.pump();
  }

  stop() {
    this.playing = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.queue = [];
    this.stopRefSource();
  }

  private pump() {
    const ctx = this.ctx;
    if (!ctx || !this.playing || !this.noise || !this.refSum) return;
    const stepLen = 60 / this.state.bpm / 4;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
      const step = this.nextStep;
      for (const row of ROWS) {
        if (this.state.grid[row][step]) this.hit(row, this.state.voices[row], this.rowGain[row], this.nextTime);
        if (!this.refBuffer && REF_GRID[row][step]) this.hit(row, REF_VOICES[row], this.refSum, this.nextTime);
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

  /** RMS of the mix or the reference, before the A/B switch, as a linear value. */
  rms(which: AB): number {
    const tap = which === "mix" ? this.mixTap : this.refTap;
    if (!tap || !this.playing) return 0;
    tap.getFloatTimeDomainData(this.floats);
    let sum = 0;
    for (let i = 0; i < this.floats.length; i++) sum += this.floats[i] * this.floats[i];
    return Math.sqrt(sum / this.floats.length);
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
