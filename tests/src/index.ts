import { Sequence } from './modules/timeline';
import { Framer, Initiator, Controller, Animator } from './utils';

type animationCallback = (frame: Framer) => void;

class Animate {
  // Frame properties
  frame: Framer = new Framer();
  start: Initiator = new Initiator();
  control: Controller = new Controller();
  engine: Animator = new Animator();
  sequence!: Sequence;
  duration!: number;

  constructor() {}
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
  public run(callback: animationCallback) {}
}
class AlgoFrame {
  constructor() {}
}
