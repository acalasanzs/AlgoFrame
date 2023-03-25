import { Preset, EasingFunctions } from '../utils';

// Classes
export class _value {
  constructor(public value: number, public time: number) {}
}
export class _object {
  constructor(public obj: Sequence, public time: number) {} // unknown now but maybe a special kind of AlgoFrame + Timelinen for nested sequencees!
}

// Enumerables
type _simple = _value[];
type _sequence = _object[];

// Anonymous Interfaces
export type __object = {
  obj: Sequence;
  time: number;
};
export type __value = {
  value: number;
  time: number;
};

abstract class KeyChanger {
  run: (__object | __value)[];
  next: (_value | _object) | null = null;
  current: (_value | _object) | null = null;
  keyframes?: (__value | __object)[];
  easing: (t: number) => number;

  constructor(easing: Preset = 'linear') {
    this.run = [];
    if (typeof easing !== 'function') {
      this.easing = EasingFunctions[
        easing as keyof typeof EasingFunctions
      ] as Preset as (t: number) => number;
    } else {
      this.easing = easing as (t: number) => number;
    }
  }
  protected nextTime(): void {
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
  protected abstract reset(): void;
  public restart() {
    while (this.run.length) this.run.pop();
    this.reset();
  }
  protected abstract asSequence(object: _object, progress: number): any;
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
        // return (this.current as _object).obj.test(progress - this.current.time);
        return this.asSequence(this.current as _object, progress);
      }
    }
  }
}

export class Sequence extends KeyChanger {
  type!: 'nested' | 'simple';
  constructor(
    public keyframes: __value[] | __object[],
    easing: Preset = 'linear'
  ) {
    super(easing);
    // Pushes and Checks if all events are of type _object or _keyframe
    this.keyframes.forEach((k, i) => {
      k = this.passKeyframe(k);
      if (i === 0) this.type = k instanceof _value ? 'simple' : 'nested';
      this.run.push(k);
    });
    if (!this.type) throw new Error('No events/keyframes provided');

    if (this.keyframes[0] instanceof _value) {
    }
    try {
      this.nextTime();
    } catch {
      throw new Error(
        'Identical time signatures on keyframes are not allowed on a single animation channel'
      );
    }
  }
  protected asSequence(object: _object, progress: number) {
    return object.obj.test(progress - this.current!.time);
  }
  protected reset(): void {
    this.keyframes.forEach(k => this.run.push(k));
  }
  private passKeyframe(k: any | _object | _value) {
    if (k instanceof _object || k instanceof _value) return k;
    return this.is_value(k)
      ? new _value(k.value, k.time)
      : new _object(k.obj, k.time);
  }
  private is_value(object: any): object is __value {
    return 'val' in object;
  }
  clone() {
    let orig = this;
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
  }
}

export class Timeline extends KeyChanger {
  constructor(public channels: Sequence[], easing: Preset = 'linear') {
    super(easing);
  }
  protected asSequence(object: _object, progress: number) {
    return object.obj.test(progress - this.current!.time);
  }
}
