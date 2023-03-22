import { Preset, EasingFunctions } from '../utils';

// Classes
class _value {
  constructor(public value: number, public time: number) {}
}
class _object {
  constructor(public obj: unknown, public time: number) {} // unknown now but maybe a special kind of AlgoFrame + Timelinen for nested sequencees!
}

// Enumerables
type _simple = _value[];
type _sequence = _object[];

// Anonymous Interfaces
type __object = {
  obj: unknown;
  time: number;
};
type __value = {
  value: number;
  time: number;
};

export class Timeline {
  static readonly _value = class {
    constructor(public val: number, public time: number) {}
  };
  static readonly _object = class {
    constructor(public obj: unknown, public time: number) {}
  };

  readonly type!: 'sequence' | 'simple';
  run: (_object | _value)[];
  next: (_value | _object) | null = null;
  current: (_value | _object) | null = null;
  easing: (t: number) => number;
  constructor(public keyframes: [__value] | [__object], easing: Preset) {
    this.run = [];

    // Pushes and Checks if all events are of type _object or _keyframe
    this.keyframes.forEach(k => this.run.push(this.passKeyframe(k)));

    if (this.keyframes[0] instanceof Timeline._value) {
    }
    if (typeof easing !== 'function') {
      this.easing = EasingFunctions[
        easing as keyof typeof EasingFunctions
      ] as Preset as (t: number) => number;
    } else {
      this.easing = easing as (t: number) => number;
    }
    this.nextTime();
  }
  passKeyframe(k: any | _object | _value) {
    if (k instanceof _object || k instanceof _value) return k;
    return this.is_value(k)
      ? new _value(k.value, k.time)
      : new _object(k.obj, k.time);
  }
  private is_value(object: any): object is __value {
    return 'val' in object;
  }
  private nextTime(): void {
    if (!this.run.length) {
      this.next = null;
      return;
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
  test(progress: number): unknown | number | null {
    if (this.next && this.current) {
      if (this.next.time <= progress) this.nextTime(); //bug proof
      if (this.next instanceof _value && this.current instanceof _value) {
        progress = Math.min(this.easing(progress), 1);
        const dif = this.next.value - this.current.value;
        const a = this.next.time - this.current.time;
        const sum = dif * progress;
        return (this.current.value + sum) / a;
      } else {
        return (this.current as _object).obj;
      }
    }
  }
  clone() {
    let orig = this;
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
  }
}
