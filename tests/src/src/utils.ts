import { Sequence } from './timeline';

export class EasingFunctions {
  // no easing; no acceleration
  static linear: (t: number) => number = t => t;
  // accelerating from zero velocity
  static easeInQuad: (t: number) => number = t => t * t;
  // decelerating to zero velocity
  static easeOutQuad: (t: number) => number = t => t * (2 - t);
  // acceleration until halfway; then deceleration
  static easeInOutQuad: (t: number) => number = t =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  // accelerating from zero velocity
  static easeInCubic: (t: number) => number = t => t * t * t;
  // decelerating to zero velocity
  static easeOutCubic: (t: number) => number = t => --t * t * t + 1;
  // acceleration until halfway; then deceleration
  static easeInOutCubic: (t: number) => number = t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  // accelerating from zero velocity
  static easeInQuart: (t: number) => number = t => t * t * t * t;
  // decelerating to zero velocity
  static easeOutQuart: (t: number) => number = t => 1 - --t * t * t * t;
  // acceleration until halfway; then deceleration
  static easeInOutQuart: (t: number) => number = t =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  // accelerating from zero velocity
  static easeInQuint: (t: number) => number = t => t * t * t * t * t;
  // decelerating to zero velocity
  static easeOutQuint: (t: number) => number = t => 1 + --t * t * t * t * t;
  // acceleration until halfway; then deceleration
  static easeInOutQuint: (t: number) => number = t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
export type Preset = string | ((x: number) => number);
export function passPreset(preset: Preset) {
  if (typeof preset !== 'function') {
    return EasingFunctions[
      preset as keyof typeof EasingFunctions
    ] as Preset as (t: number) => number;
  } else {
    return preset as (t: number) => number;
  }
}
export type callbackType = {
  value: number;
  FPS: number | null;
  progress: number;
  currentTime: number;
  frame: number;
  duration: number;
  startTime: number;
  frameRate: number | 'Calculating...';
  timeDelayed: number;
};
export type animationCallback = (frame: callbackType) => void;
export class Framer {
  _FPS: number | null = null;
  _delay!: number;
  count: number = -1; // this.frame
  frame: number = -1; // this.animationFrame
  _precision: number = 30;
  last: {
    time: Refresher;
    frameRate: Refresher;
  } = {
    time: undefined,
    frameRate: undefined,
  } as unknown as {
    time: Refresher;
    frameRate: Refresher;
  };
  value!: number;
  sequence!: Sequence;
  start: Initiator = new Initiator();
  duration!: number;
  progress: number = 0;
  constructor() {}
  set precision(value: number) {
    value = Math.abs(value);
    this._precision = value;
  }
  get precision(): number {
    return this._precision || (this._FPS as number);
  }
  set FPS(value: number | null) {
    try {
      value = Math.abs(value as number);
      this._FPS = value;
    } catch {}
  }
  get FPS(): number | null {
    return this._FPS ? 1000 / this._FPS : null;
  }
  get delay() {
    if (!this._FPS) throw new Error('Not initialized');
    return 1000 / this._FPS;
  }

  stats() {
    return {
      value: this.value,
      FPS: this.FPS,
      progress: this.progress,
      currentTime: this.last.frameRate.currenttime,
      frame: this.frame,
      duration: this.duration,
      startTime: this.start.animationTime!,
      timeDelayed: this.start.time,
      frameRate: this.last.frameRate.last,
    };
  }
}
export class Initiator {
  // Refers to this.start___ whatever
  time: number = 0;
  afterWait: number | null = null;
  animationTime: number | null = null;
}
export class Controller {
  stop: boolean = false;
  _start!: (value?: () => void | PromiseLike<() => void>) => void;
  __start: Promise<unknown> = new Promise(resolve => (this._start = resolve));
  _completed: boolean = false;
  get completed(): boolean {
    return this._completed || this.stop;
  }
  set completed(value: boolean) {
    this._completed = value;
  }
  finally!: () => void; // this.next
  loop: boolean = false;
  callback!: animationCallback;
  sent: boolean = false;
}
export class Refresher {
  history: number[];
  last: number | 'Calculating...';
  currenttime: number;
  constructor(precision: number = 1) {
    this.history = new Array(precision).fill(0);
    this.last = 0;
    this.currenttime = 0;
  }
  refresh(timestamp: number) {
    this.history.unshift(0);
    this.history.pop();
    this.history[0] = timestamp - this.currenttime;
    this.last = this.history.includes(0)
      ? 'Calculating...'
      : this.history.reduce((prev, curr) => prev + curr) / this.history.length;
    this.currenttime = timestamp;
  }
}
export type EngineTypes = {
  send: () => void;
  runtime: number;
  relativeProgress: number;
  easedProgress: number;
  timestamp: number;
  seg: number;
  requestAnimation: Function;
};
export class Animator {
  // And add Spring and other physics
  easing!: (x: number) => number;
  constructor(public origin: any) {}
  engine(parameters: EngineTypes) {
    const self = this.origin;
  }
}
