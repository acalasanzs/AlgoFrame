import { passPreset, EasingFunctions, Preset } from './utils';
import { /* Channels, */ Sequence } from './modules/timeline';

class Framer {
  _FPS: number | null = null;
  rate: number = 0;
  _delay!: number;
  count: number = -1; // this.frame
  frame: number = -1; // this.animationFrame

  constructor() {}
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
}
class Initiator {
  // Refers to this.start___ whatever
  time: number = 0;
}
class Controller {
  stop: boolean = false;
  _start!: (value?: () => void | PromiseLike<() => void>) => void;
  __start: Promise<unknown> = new Promise(resolve => (this._start = resolve));
  completed: boolean = false;
}
class Animate {
  // Frame properties
  frame: Framer = new Framer();
  start: Initiator = new Initiator();
  duration!: number;

  constructor() {}
}
class AlgoFrame {
  constructor() {}
}
