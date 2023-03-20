import EasingFunctions from './utils';

type Preset = typeof EasingFunctions | ((x: number) => number);
class Animate {
  private readonly presets: typeof EasingFunctions = EasingFunctions;
  readonly Tduration: number;
  constructor(Tduration: number, public readonly Tinit: number, public readonly preset: Preset, public readonly keyframes: Keyframes) {
    this.Tduration = Math.floor(Tduration);
  }
}

type Ktimeline = [Keyframe];

namespace _Keyframes{
    type run = [_keyframe];
    type _keyframe = {
        time: number
    }

}
class Keyframes {
    keyframes: never[];
    run: never[];
    easing: any;
    next: ;
    current: any;
    constructor(keyframes: Ktimeline, easing: Preset) {
      this.keyframes = [];
      this.run = [];
      keyframes.every((keyframe, i) => {
        if (
          !(keyframe instanceof Keyframes.keyframe) ||
          this.keyframes.some(k => k.time === keyframe.time)
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
        this.easing = EasingFunctions[easing];
      } else {
        this.easing = easing;
      }
      this.nextTime();
    }
    nextTime() {
      if (!this.run.length) {
        return (this.next = null);
      }
  
      if (this.run.length > 1) {
        this.current = this.run.reduce((previousValue, currentValue) =>
          currentValue.time < previousValue.time ? currentValue : previousValue
        );
        this.next = this.run
          .filter(v => v.time !== this.current.time)
          .reduce((previousValue, currentValue) =>
            currentValue.time < previousValue ? currentValue : previousValue
          );
      } else {
        this.restart();
        this.next = this.run.reduce((previousValue, currentValue) =>
          currentValue.time < previousValue.time ? currentValue : previousValue
        );
      }
      this.run.shift();
    }
    restart() {
      while (this.run.length) this.run.pop();
      this.keyframes.forEach(k => this.run.push(k));
    }
    test(progress) {
      if (this.next.time <= progress) this.nextTime();
      progress = Math.min(this.easing(progress), 1);
      const dif = this.next.val - this.current.val;
      const a = this.next.time - this.current.time;
      const sum = dif * progress;
      return (this.current.val + sum) / a;
    }
    clone() {
      let orig = this;
      return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
    }
    static keyframe = class {
      constructor(public readonly time: number, public readonly val: number) {
      }
    };
  }

export {Animate, Keyframes};