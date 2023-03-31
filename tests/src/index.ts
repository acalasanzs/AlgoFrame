import { passPreset, EasingFunctions, Preset } from './utils';
import { Channels, Sequence } from './modules/Timeline';

//Remove this and replace by Timeline
// module Animate {
//   export interface event {
//     id: number; // UID for every event in a Algoframe's timeline
//     time: number; // Time in
//     duration: number;
//     delay: number;
//     easing: Preset;
//     keyframes: Sequence;

//     callback: () => void;
//   }
// }
// * this.duration will be replaced by the duration of the Sequence
class Animate {
  private _starttime: number;
  private startafterwait?: number;
  private startanimationtime?: number;
  stop: boolean;
  private _start: Promise<unknown>;
  private __start!: (value: unknown) => void;
  private done: boolean;
  next?: () => void;
  private _FPS?: number;
  frameDelay?: number;
  frameRate: number;
  frame: number;
  animationFrame: number;
  loop: boolean;
  callback!: Function;

  last!: unknown;
  lastFrameRate!: unknown;
  precision!: number;

  // * TIMELINE FEATURES
  private _running: Animate.event[] = [];

  constructor(
    public readonly starttime: number = 0,
    public readonly preset: Preset,
    public readonly keyframes: Sequence,
    FPS: undefined | number = undefined,
    loop: boolean = false
  ) {
    this.preset = passPreset(preset);
    this._starttime = this.starttime;
    this.stop = false;
    this._start = new Promise(res => (this.__start = res));
    this.keyframes = keyframes;
    this.done = false;

    if (typeof FPS === 'number') {
      this._FPS = FPS;
      this.frameDelay = 1000 / this._FPS;
    }
    this.frameRate = 0;
    this.frame = -1;
    this.animationFrame = -1;

    this.loop = loop;
  }
  get FPS() {
    return this._FPS ? 1000 / this._FPS : null;
  }
  set FPS(value: number | null) {
    const FPS = value;
    if (FPS) {
      this._FPS = FPS;
      this.frameDelay = 1000 / FPS;
      // this.frame = -1;
      // this.starttime = null;
    } else console.warn(new Error('Not a valid Number'));
  }
  nextTime(arr: typeof this._running = this._running) {
    if (!arr.length) {
      console.log(new Error());
    }
    return arr.reduce((previousValue, currentValue) =>
      currentValue.time < previousValue.time ? currentValue : previousValue
    );
  }
  save(callback, precision) {
    this.callback = callback;
    this.precision = precision;
  }
  restartKeyframes(t) {
    this._timeline.forEach(t => {
      if (t.id === this._current.id) return;
      t._.keyframes.restart();
      t._.keyframes.nextTime();
      t.running = false;
    });
  }
  restartTimeline() {
    this._timeline.forEach(x => this._running.push(x));
    this._next = this.nextTime();
  }
  timeline(array, real, reverseLoop) {
    this._timeline = [];
    this._running = [];
    let data = [];
    array.forEach(event => {
      if (event.time >= 1 || event.time < 0 || isNaN(event.time)) {
        throw new Error('Not valid');
      }
      data.push({
        _: new AlgoFrame(
          event.duration,
          event.delay ? event.delay : 0,
          event.easing ? event.easing : this.easing,
          event.keyframes ? event.keyframes.clone() : this.keyframes.clone(),
          this._FPS
        ).finally(event.finally),
        time: event.time,
        callback: event.run,
      });
    });
    let all = array.reduce((p, c) => {
      return p + c.duration || 0 + c.delay || 0;
    }, 0);
    if (all / array[array.length - 1].time < array[array.length - 1].duration) {
      this.duration +=
        array[array.length - 1].duration - all / array[array.length - 1].time;
    }
    if (this.duration < all) {
      this.duration = all;
    }
    const len = data.length;
    for (let i = 0; i < len; i++) {
      const cur = this.nextTime(data);
      cur.id = i + 1;
      cur._.id = i + 1;
      this._timeline.push(cur);
      data.splice(data.indexOf(this._timeline[i]), 1);
    }
    this.saved_timeline = this._timeline.map(l => l.time);
    this.restartTimeline();
    let first = this._next;
    let last = this._timeline.reduce((previousValue, currentValue) =>
      currentValue.time > previousValue.time ? currentValue : previousValue
    );
    this.reversed = false;
    this.callback = function (X, easedProgress, params) {
      real(X, easedProgress, params);
      const next = () => {
        this._next._.startanimationtime =
          params.timestamp + this._next._._starttime;
        this._next._.waiting = true;

        //Parent info
        this._next._.time = this._next.time;

        this._next._.run(this._next.callback);
        this._next.running = true;
        this._current = this._next;
        this._running.shift();
        console.log(
          this._next.time,
          this._running.map(l => l.time)
        );
        if (this._running.length) {
          this._next = this.nextTime();
        }
      };
      if (this._next) {
        if (easedProgress >= this._next.time && !this._next.running) {
          next();
        }
      } else {
        console.log('REVERSED');
        if (reverseLoop && !this.reversed) {
          this._timeline.forEach((l, i) => {
            l.time =
              this.saved_timeline[this.saved_timeline.length - (i + 1)] -
              this.nextTime(this.saved_timeline);
          });
        } else if (reverseLoop) {
          this._timeline.forEach((l, i) => (l.time = this.saved_timeline[i]));
        }

        while (this._running.length) this._running.shift();
        this.restartTimeline();
        this.restartKeyframes();
        if (reverseLoop && !this.reversed) this._running.reverse();
        this.reversed = !this.reversed;
        first = this._next;
        last = this._timeline.reduce((previousValue, currentValue) =>
          currentValue.time > previousValue.time ? currentValue : previousValue
        );
        this._running.shift();
        this._next = this.nextTime();
        next();
      }
    };
    return this;
  }
  protected static Refresher = class {
    history: number[];
    last: number | 'Calculating...';
    currenttime: number;
    constructor(precision = 1) {
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
        : this.history.reduce((prev, curr) => prev + curr) /
          this.history.length;
      this.currenttime = timestamp;
    }
  };
  run(callback: typeof this.callback, precision = this._FPS) {
    let condition: boolean, seg;
    this.callback = callback ? callback : this.callback;

    this.last = new Animate.Refresher();
    if (typeof precision === 'number' && isNaN(precision)) {
      console.log(new Error(`${precision} is NaN`));
      precision = this._FPS;
      if (!isNaN(this.precision)) precision = this.precision;
    }
    this.lastFrameRate = this.lastFrameRate
      ? this.lastFrameRate
      : new Animate.Refresher(precision);

    const animate = (timestamp: number) => {
      if (this.done) {
        this.frame = -1;
        this.startanimationtime = timestamp;
        this.done = false;
        this._next = null;
      }
      if (this._FPS) {
        seg = Math.floor((timestamp - this.starttime) / this.frameDelay);
        condition = Boolean(seg > this.frame);
      } else {
        condition = true;
      }
      this.last.refresh(timestamp);
      const runtime = timestamp - this.startanimationtime;
      let relativeProgress = runtime / this.duration;
      const easedProgress = this.easing(relativeProgress);
      this.progress = easedProgress;
      if (!this.startanimationtime && this.starttime === 0) {
        this.startanimationtime = timestamp;
      } else if (this.starttime > 0) {
        this.startanimationtime = timestamp;
        this.starttime =
          this.starttime - this.last.last < this.last.last * 0.7
            ? 0
            : this.starttime - this.last.last;
        requestAnimationFrame(animate.bind(this));
        return;
      }
      let sent = false;
      if (condition) {
        this.frame = seg;
        this.animationFrame++;
        this.lastFrameRate.refresh(timestamp);
        sent = true;
        this.callback(
          this.waiting ? 0 : this.keyframes.test(Math.min(easedProgress, 1)),
          Math.min(easedProgress, 1),
          {
            lastFrame: this.lastFrameRate.last,
            currentTime: this.lastFrameRate.currentTime,
            frame: this.animationFrame,
            timestamp,
          }
        );
        this.waiting = false;
      }
      if (!this.stop) {
        if (runtime < this.duration) {
          requestAnimationFrame(animate.bind(this));
        } else if (runtime + this.last.last > this.duration) {
          this.animationFrame++;
          this.keyframes.nextTime();
          this.callback(this.keyframes.test(1), 1, {
            lastFrame: this.lastFrameRate.last,
            currentTime: this.lastFrameRate.currenttime,
            frame: this.animationFrame,
            timestamp,
          });
          this.done = true;
          this.keyframes.restart();
          if (this.loop) requestAnimationFrame(animate.bind(this));
          this.next?.();
        } else {
          this.done = true;
          this.keyframes.restart();
          if (this.loop) requestAnimationFrame(animate.bind(this));
          this.next?.();
        }
      }
      if (this.animationFrame === 0) this.__start();
    };
    requestAnimationFrame(animate.bind(this));
    return this;
  }
  finally(callback) {
    this.next = callback;
    return this;
  }
  break() {
    this.stop = false;
    return this;
  }
  listen(type, callback) {
    switch (type) {
      case 'start':
        this._start.then(callback);
        break;
    }
  }
}

export { Animate, Timeline };
