import { Sequence } from './timeline';
import {
  Framer,
  Controller,
  Animator,
  animationCallback,
  Refresher,
  Preset,
  passPreset,
} from './utils';
export const sensibility: number = 0.9;
type timeReferences = {
  duration?: number;
  delay?: number;
};
type controls = {
  FPS?: number;
  loop?: boolean;
};
type options = {
  sequence: Sequence;
  easing?: Preset;
  controls?: controls;
  timing?: timeReferences;
};
export { Sequence };
export class Animate {
  // Frame properties
  frame: Framer = new Framer();
  control: Controller = new Controller();
  progress: number = 0;
  // Engine
  engine: Animator = new Animator(this);

  constructor(options: options) {
    const { sequence, easing, controls, timing } = options;
    this.engine.easing = passPreset(easing ? easing : 'linear');
    this.frame.sequence = sequence;
    if (controls?.FPS) this.frame.FPS = controls.FPS; // also implicitily declares Framer._precision
    if (controls?.loop) this.control.loop = controls.loop;
    this.frame.start.time = timing?.delay || 0;
    this.frame.duration = timing?.duration || sequence.duration;
  }
  public finally(callback: () => void) {
    this.control.finally = callback;
    return this;
  }
  public break() {
    this.control.stop = false;
    return this;
  }
  public precision(value: number) {
    this.frame.precision = value;
    return this;
  }
  public run(callback?: animationCallback) {
    let condition: boolean, seg: number;
    if (callback) {
      this.control.callback = callback;
    }
    if (!this.control.callback)
      throw new Error('Main callback is required for the animation');
    this.frame.last.time = new Refresher();
    this.frame.last.frameRate = this.frame.last.frameRate
      ? this.frame.last.frameRate
      : new Refresher(this.frame.precision);

    function refresh(this: Animate, timestamp: number): void {
      if (this.control.completed) {
        this.frame.frame = -1;
        this.frame.start.animationTime = timestamp;
        this.control.completed = false;
      }
      if (this.frame._FPS) {
        seg = Math.floor(
          (timestamp - this.frame.start.time) / this.frame.delay
          );
          condition = Boolean(seg > this.frame.count);
        } else {
          condition = true;
        }
        this.frame.last.time.refresh(timestamp);
      }

    function animate(this: Animate, timestamp: number) {
      refresh.call(this, timestamp);
      let runtime: number | null = null,
        relativeProgress: number | null = null,
        easedProgress: number | null = null;
      this.control.sent = false;
      const send = () => {
        this.control.sent = true;
        this.frame.value = this.frame.sequence.test(
          Math.min(easedProgress!, 1)
        ) as number;
        // TODO: Add a recursvie callback inside Sequence
        this.frame.sequence.callback?.(this.frame.stats());
        // END
        this.control.callback(this.frame.stats());
      };
      // console.log(this.frame.start.time);
      if (!this.frame.start.animationTime && this.frame.start.time === 0) {
        this.frame.start.animationTime = timestamp;
        
      } else if (this.frame.start.time > 0) {
        this.frame.start.animationTime = timestamp;
        
        let last: number = 0;
        if (typeof this.frame.last.time.last === 'number') {
          last = this.frame.last.time.last;
        }
        this.frame.start.time =
        this.frame.start.time - last < last * sensibility
        ? 0
        : this.frame.start.time - last;
        requestAnimationFrame(animate.bind(this));
        return;
      }
      if (this.frame.start.animationTime) {
        // console.log(this.frame.start.animationTime - timestamp);
        runtime = timestamp - this.frame.start.animationTime;
        relativeProgress = runtime / this.frame.duration;
        easedProgress = this.engine.easing(relativeProgress);
        this.progress = Math.min(easedProgress, 1);
        this.frame.progress = Math.min(easedProgress, 1);
      }
      if (condition) {
        this.frame.count = seg;
        this.frame.frame++;
        this.frame.last.frameRate.refresh(timestamp);
        send();
      }
      if (!this.control.stop) {
        if (typeof runtime === 'number' && runtime < this.frame.duration) {
          requestAnimationFrame(animate.bind(this));
        } else if (
          runtime &&
          runtime +
            (typeof this.frame.last.time.last === 'number'
              ? this.frame.last.time.last
              : 0) >
            this.frame.duration
        ) {
          this.frame.frame++;

          send();
          this.control.completed = true;
          if (this.control.loop) requestAnimationFrame(animate.bind(this));
          this.control.finally?.();
          this.frame.sequence.finallyCallback?.();
        } else if (!this.control.completed) {
          this.control.completed = true;
          if (this.control.loop) requestAnimationFrame(animate.bind(this));
          this.control.finally?.();
          this.frame.sequence.finallyCallback?.();
        }
      }
      if (this.frame.frame === 0) this.control._start();
    }
    requestAnimationFrame(animate.bind(this));
    return this;
  }
}
class AlgoFrame {
  constructor() {}
}
