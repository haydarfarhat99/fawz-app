/**
 * Lightweight Web Audio synthesizer. No external assets.
 * Generates the FAWZ sound palette: digit ticks, drum rolls, win fanfare, gentle lose tone.
 *
 * Sounds respect a user-controlled mute flag persisted to localStorage and `prefers-reduced-motion`.
 */

const STORAGE_KEY = 'fawz.sound.enabled';

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let soundEnabled = readEnabledFromStorage();
const prefersReducedMotion = readReducedMotion();

function readEnabledFromStorage(): boolean {
  if (typeof localStorage === 'undefined') return true;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === null ? true : v === 'true';
}

function readReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function shouldPlay(): boolean {
  return soundEnabled && !prefersReducedMotion;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, String(enabled));
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

interface ToneOpts {
  freq: number;
  duration: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  volume?: number;
  freqEnd?: number;
}

function tone({ freq, duration, type = 'sine', attack = 0.005, release = 0.05, volume = 0.5, freqEnd }: ToneOpts) {
  const c = ensureCtx();
  if (!c || !masterGain || !shouldPlay()) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(0.01, freqEnd), c.currentTime + duration);
  }
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(volume, c.currentTime + attack);
  g.gain.linearRampToValueAtTime(volume, c.currentTime + duration - release);
  g.gain.linearRampToValueAtTime(0, c.currentTime + duration);
  osc.connect(g);
  g.connect(masterGain);
  osc.start();
  osc.stop(c.currentTime + duration + 0.05);
}

function noiseBurst(duration: number, volume = 0.3): void {
  const c = ensureCtx();
  if (!c || !masterGain || !shouldPlay()) return;
  const buffer = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = volume;
  src.buffer = buffer;
  src.connect(g);
  g.connect(masterGain);
  src.start();
}

/** Subtle tick when a digit slot fills */
export function playDigitTick(): void {
  tone({ freq: 880, duration: 0.06, type: 'triangle', volume: 0.15 });
}

/** Drum-roll-style anticipation (5-pulse rumble) */
export function playDrumRoll(): void {
  if (!shouldPlay()) return;
  const c = ensureCtx();
  if (!c) return;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => noiseBurst(0.08, 0.18), i * 80);
  }
}

/** Soft swelling "drumroll-into-reveal" for the moment a digit lands */
export function playDigitReveal(): void {
  tone({ freq: 660, duration: 0.18, type: 'sine', volume: 0.22, freqEnd: 880 });
}

/** Big fanfare arpeggio for a win */
export function playWinFanfare(): void {
  if (!shouldPlay()) return;
  // C-E-G-C arpeggio with shimmer
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    setTimeout(() => tone({ freq: f, duration: 0.45, type: 'triangle', volume: 0.3 }), i * 110);
  });
  setTimeout(() => {
    tone({ freq: 1046.5, duration: 0.6, type: 'sine', volume: 0.35 });
    tone({ freq: 1318.5, duration: 0.6, type: 'sine', volume: 0.25 });
  }, 480);
}

/**
 * "Crowd ohhh" disappointment — 4 detuned sawtooth voices through a low-pass
 * filter with vibrato, gliding down. Mimics a stadium "ohhh" reaction.
 */
export function playLoseTone(): void {
  if (!shouldPlay()) return;
  const c = ensureCtx();
  if (!c || !masterGain) return;

  const now = c.currentTime;
  const duration = 1.4;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, now);
  filter.frequency.exponentialRampToValueAtTime(380, now + duration);
  filter.Q.value = 4;

  const env = c.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.45, now + 0.12);
  env.gain.linearRampToValueAtTime(0.4, now + duration - 0.5);
  env.gain.linearRampToValueAtTime(0, now + duration);

  filter.connect(env);
  env.connect(masterGain);

  const detunes = [-9, -3, 4, 11];
  detunes.forEach((cents) => {
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + duration);
    osc.detune.value = cents;

    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = 6;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);

    const voiceGain = c.createGain();
    voiceGain.gain.value = 0.22;
    osc.connect(voiceGain);
    voiceGain.connect(filter);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + duration + 0.05);
    lfo.stop(now + duration + 0.05);
  });

  // Soft breathy noise for vocal character
  const noiseBuffer = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    const t = i / noiseData.length;
    noiseData[i] = (Math.random() * 2 - 1) * (1 - t) * 0.08;
  }
  const noiseSrc = c.createBufferSource();
  noiseSrc.buffer = noiseBuffer;
  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 600;
  noiseFilter.Q.value = 1.2;
  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(env);
  noiseSrc.start(now);
  noiseSrc.stop(now + duration);
}

/** Subtle whoosh for splash screen */
export function playSplashWhoosh(): void {
  if (!shouldPlay()) return;
  const c = ensureCtx();
  if (!c) return;
  noiseBurst(0.5, 0.08);
  tone({ freq: 220, duration: 0.6, type: 'sine', volume: 0.18, freqEnd: 880 });
}
