import EasingFunctions from './utils';

type Preset = string | ((x: number) => number);
class Animate {
  readonly Tduration: number;
  starttime: any;
  _starttime: any;
  duration: any;
  startafterwait: null;
  startanimationtime: null;
  stop: boolean;
  _start: Promise<unknown>;
  __start!: (value: unknown) => void;
  done: boolean;
  next: undefined;
  _FPS: any;
  frameDelay: number;
  frameRate: number;
  frame: number;
  animationFrame: number;
  loop: any;
  constructor(
    Tduration: number,
    public readonly Tinit: number,
    public readonly preset: Preset,
    public readonly keyframes: Keyframes
  ) {
    this.Tduration = Math.floor(Tduration);
    if (typeof preset !== 'function') {
      this.preset = EasingFunctions[
        preset as keyof typeof EasingFunctions
      ] as Preset as (t: number) => number;
    } else {
      this.preset = preset as (t: number) => number;
    }
    this.starttime = starttime ? starttime : 0;
    this._starttime = this.starttime;
    this.duration = duration;
    this.startafterwait = null;
    this.startanimationtime = null;
    this.stop = false;
    this._start = new Promise(res => (this.__start = res));
    if (!(keyframes instanceof Keyframes)) {
      throw new Error('Invalid Keyframes Object!');
    }
    this.keyframes = keyframes;
    this.done = false;
    this.next = undefined;

    this._FPS = FPS;
    this.frameDelay = 1000 / this._FPS;
    this.frameRate = 0;
    this.frame = -1;
    this.animationFrame = -1;

    this.loop = loop;
  }
}

type Ktimeline = [Keyframe];

namespace _Keyframes {
  export type keyframes = _keyframe[];
  export type _keyframe = {
    val: any;
    time: number;
  } | null;
}
class Keyframes {
  keyframes: _Keyframes.keyframes;
  run: _Keyframes.keyframes;
  easing: any;
  next: _Keyframes._keyframe = null;
  current: _Keyframes._keyframe = null;
  constructor(keyframes: Ktimeline, easing: Preset) {
    this.keyframes = [];
    this.run = [];
    keyframes.every((keyframe, i) => {
      if (
        !(keyframe instanceof Keyframes.keyframe) ||
        this.keyframes.some(function (k): k is _Keyframes._keyframe {
          return k!.time === keyframe.time;
        })
      ) {
        console.error(new Error(`Invalid Keyframe ${i + 1}!`));
        return false;
      } else {
        this.keyframes.push(keyframe);
        return true;
      }
    });
    this.keyframes.forEach(k => this.run.push(k));
    if (typeof easing !== 'function') {
      this.easing = EasingFunctions[
        easing as keyof typeof EasingFunctions
      ] as Preset as (t: number) => number;
    } else {
      this.easing = easing as (t: number) => number;
    }
    this.nextTime();
  }
  nextTime() {
    if (!this.run.length) {
      return (this.next = null);
    }

    if (this.run.length > 1) {
      this.current = this.run.reduce((previousValue, currentValue) =>
        currentValue!.time < previousValue!.time ? currentValue : previousValue
      );
      this.next = this.run
        .filter(v => v!.time !== this.current!.time)
        .reduce((previousValue, currentValue) =>
          currentValue!.time < previousValue!.time
            ? currentValue
            : previousValue
        );
    } else {
      this.restart();
      this.next = this.run.reduce((previousValue, currentValue) =>
        currentValue!.time < previousValue!.time ? currentValue : previousValue
      );
    }
    this.run.shift();
  }
  restart() {
    while (this.run.length) this.run.pop();
    this.keyframes.forEach(k => this.run.push(k));
  }
  test(progress: number) {
    if (this.next!.time <= progress) this.nextTime();
    progress = Math.min(this.easing(progress), 1);
    const dif = this.next!.val - this.current!.val;
    const a = this.next!.time - this.current!.time;
    const sum = dif * progress;
    return (this.current!.val + sum) / a;
  }
  clone() {
    let orig = this;
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
  }
  static keyframe = class {
    constructor(public readonly time: number, public readonly val: number) {}
  };
}

export { Animate, Keyframes };
