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

  // Engine
  engine: Animator = new Animator();

  constructor(
    sequence: Sequence,
    easing: Preset,
    controls: controls,
    timing: timeReferences
  ) {
    this.engine.easing = passPreset(easing);
    this.frame.sequence = sequence;
    this.frame.FPS = controls.FPS;
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
    if (callback) {
      this.control.callback = callback;
    }
    if (!this.control.callback)
      throw new Error('Main callback is required for the animation');
    this.frame.last = new Refresher();
  }
}
class AlgoFrame {
  constructor() {}
}
