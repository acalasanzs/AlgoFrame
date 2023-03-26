import { Preset, EasingFunctions, passPreset } from '../utils';

// Classes

class _keyframe {
  constructor(
    public timing: number,
    public type: 'ratio' | 'miliseconds' = 'ratio'
  ) {}
  time(duration: number): number {
    return this.type === 'miliseconds' ? this.timing : duration * this.timing;
  }
}

export class valueKeyframe extends _keyframe {
  constructor(
    public value: number,
    timing: number,
    type: 'ratio' | 'miliseconds' = 'miliseconds'
  ) {
    super(timing, type);
  }
}
// unknown now but maybe a special kind of AlgoFrame + Timeline for nested sequencees! And must fit in the timeline keyframe
export class nestedKeyframe extends _keyframe {
  constructor(
    public obj: Sequence,
    timing: number,
    type: 'ratio' | 'miliseconds' = 'miliseconds'
  ) {
    super(timing, type);
  }
}

// Enumerables
type _simple = valueKeyframe[];
type _nested = nestedKeyframe[];

// Anonymous Interfaces
export type __objectKeyframe = {
  obj: Sequence;
  timing: number;
  type: 'ratio' | 'miliseconds';
};
export type __valueKeyframe = {
  value: number;
  timing: number;
  type: 'ratio' | 'miliseconds';
};

abstract class KeyChanger {
  protected duration: number;
  run: (nestedKeyframe | valueKeyframe)[];
  next: (valueKeyframe | nestedKeyframe) | null = null;
  current: (valueKeyframe | nestedKeyframe) | null = null;
  keyframes?: (__valueKeyframe | __objectKeyframe)[];
  testType: 'ratio' | 'miliseconds' = 'ratio';
  easing: (t: number) => number;

  constructor(duration: number, easing: Preset = 'linear') {
    this.duration = Math.floor(duration);
    this.run = [];
    this.easing = passPreset(easing);
  }
  protected nextTime(): void {
    if (!this.run.length) {
      this.next = null;
      return;
    }

    if (this.run.length > 1) {
      this.current = this.run.reduce((previousValue, currentValue) => {
        return currentValue!.time(this.duration) <
          previousValue!.time(this.duration)
          ? currentValue
          : previousValue;
      });
      this.next = this.run
        .filter(
          v => v!.time(this.duration) !== this.current!.time(this.duration)
        )
        .reduce((previousValue, currentValue) =>
          currentValue!.time(this.duration) < previousValue!.time(this.duration)
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
  protected passKeyframe(k: any | nestedKeyframe | valueKeyframe) {
    if (k instanceof nestedKeyframe || k instanceof valueKeyframe) return k;
    return this.is_value(k)
      ? new valueKeyframe(k.value, k.timing, k.type)
      : new nestedKeyframe(k.obj, k.timing, k.type);
  }
  protected is_value(object: any): object is __valueKeyframe {
    return 'val' in object;
  }
  public restart() {
    while (this.run.length) this.run.pop();
    this.reset();
  }
  // This is called when in this.test(), this.current is of type nestedKeyframe, so treat de return as a nested timeline call.
  protected abstract asSequence(object: nestedKeyframe, progress: number): any;
  test(
    progress: number,
    miliseconds: boolean = false
  ): unknown | number | null {
    if (!miliseconds) progress = progress * this.duration;
    if (this.next && this.current) {
      if (this.next.time(this.duration) <= progress) this.nextTime(); //bug-proof
      if (
        this.next instanceof valueKeyframe &&
        this.current instanceof valueKeyframe
      ) {
        progress = Math.min(this.easing(progress), 1);
        const dif = this.next.value - this.current.value;
        const a =
          this.next.time(this.duration) - this.current.time(this.duration);
        const sum = dif * progress;
        return (this.current.value + sum) / a;
      } else {
        // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
        return this.asSequence(this.current as nestedKeyframe, progress);
      }
    }
  }
}

export class Sequence extends KeyChanger {
  type: 'nested' | 'simple' = 'simple';
  constructor(
    duration: number,
    public keyframes: (__valueKeyframe | __objectKeyframe)[],
    easing: Preset = 'linear'
  ) {
    super(duration, easing);
    // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
    this.keyframes.forEach((k: any, i) => {
      k = this.passKeyframe(k);
      if (k instanceof nestedKeyframe) this.type = 'nested';
      this.run.push(k);
    });
    if (!this.type) throw new Error('No events/keyframes provided');

    if (this.keyframes[0] instanceof valueKeyframe) {
    }
    try {
      this.nextTime();
    } catch {
      throw new Error(
        'Identical time signatures on keyframes are not allowed on a single animation channel'
      );
    }
  }
  protected asSequence(object: nestedKeyframe, progress: number) {
    // return object.obj.test(progress - this.current!.time);
  }
  protected reset(): void {
    this.keyframes.forEach(k => this.run.push(this.passKeyframe(k)));
  }
  clone() {
    let orig = this;
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
  }
}

export class ChannelsTimeline extends KeyChanger {
  //AllRun? to all channels simultaneously
  // Return a nested object of all the results in a given time?
  // So in that case, call every AlgoFrame Sequence/timeline better.
  constructor(
    duration: number,
    public channels: Sequence[], // Main sequences means a whole channel, but all must have the same length in miliseconds. If not, all will be extended to the largest one.
    easing: Preset = 'linear'
  ) {
    super(duration, easing);
  }
  protected asSequence(object: nestedKeyframe, progress: number) {}
  protected reset(): void {}
}
