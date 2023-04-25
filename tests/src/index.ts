import { Sequence } from './modules/timeline';
import {
  Framer,
  Controller,
  Animator,
  animationCallback,
  Refresher,
  Preset,
  passPreset,
} from './utils';

type timeReferences = {
  duration: number;
  delay: number;
};
type controls = {
  FPS: number;
  loop: boolean;
};
class Animate {
  // Frame properties
  frame: Framer = new Framer();
  control: Controller = new Controller();
  progress: number = 0;
  // Engine
  engine: Animator = new Animator(this);

  constructor(
    sequence: Sequence,
    easing: Preset,
    controls: controls,
    timing: timeReferences
  ) {
    this.engine.easing = passPreset(easing);
    this.frame.sequence = sequence;
    this.frame.FPS = controls.FPS; // also implicitily declares Framer._precision
    this.control.loop = controls.loop;
    this.frame.start.time = timing.delay;
    this.frame.duration = timing.duration;
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
        this.control.completed = !this.control.completed;
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
      let runtime: number, relativeProgress: number, easedProgress: number;
      if (this.frame.start.animationTime) {
        runtime = timestamp - this.frame.start.animationTime;
        relativeProgress = runtime / this.frame.duration;
        easedProgress = this.engine.easing(relativeProgress);
        this.progress = easedProgress;
        this.engine.engine({
          relativeProgress,
          easedProgress,
          runtime,
          timestamp,
          seg,
          condition,
          requestAnimation: animate,
        });
      } else if (this.frame.start.time > 0) {
        this.frame.start.animationTime = timestamp;

        let last: number = 0;
        if (typeof this.frame.last.time.last === 'number') {
          last = this.frame.last.time.last;
        }
        this.frame.start.time =
          this.frame.start.time - last < last * 0.7
            ? 0
            : this.frame.start.time - last;
        requestAnimationFrame(animate.bind(this));
        return;
      }
    }
    requestAnimationFrame(animate.bind(this));
    return this;
  }
}
class AlgoFrame {
  constructor() {}
}
