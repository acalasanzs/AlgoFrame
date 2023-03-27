import { Preset, EasingFunctions, passPreset } from '../utils';

// Classes

class _keyframe {
  static instances = 0;
  readonly id: number;
  constructor(
    public timing: number,
    public type: 'ratio' | 'miliseconds' = 'ratio',
    public delay?: number,
    public duration?: number
  ) {
    if (this.type === 'ratio' && this.delay && !this.duration)
      throw new Error(
        `If delay is specified and keyframe's type is 'ratio', it needs to be also with the duration of the sequence`
      );
    if ((this.delay || this.duration) && !(this.delay && this.duration))
      throw new Error('Both duration and delay must be specified');
    this.timing =
      this.type === 'ratio'
        ? ratioAndMilisecons(this.timing, this.delay!, this.duration!)
        : this.timing + this.delay!;
    this.id = _keyframe.instances++;
  }
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
  delay?: number;
};
export type __valueKeyframe = {
  value: number;
  timing: number;
  type: 'ratio' | 'miliseconds';
  delay?: number;
};

abstract class KeyChanger {
  protected duration: number;
  run: (nestedKeyframe | valueKeyframe)[];
  next: (valueKeyframe | nestedKeyframe) | null = null;
  current: (valueKeyframe | nestedKeyframe) | null = null;
  keyframes?: (
    | __valueKeyframe
    | __objectKeyframe
    | valueKeyframe
    | nestedKeyframe
  )[];
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
      this.next =
        this.run
          .filter(
            v => v!.time(this.duration) !== this.current!.time(this.duration)
          )
          .reduce((previousValue, currentValue) =>
            currentValue!.time(this.duration) <
            previousValue!.time(this.duration)
              ? currentValue
              : previousValue
          ) || this.current;
    } else {
      this.restart();
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
  static lerp(x: number, y: number, a: number) {
    const lerp = x * (1 - a) + y * a;
    return lerp;
  }
  public test(
    progress: number,
    miliseconds: boolean = false
  ): unknown | number | null {
    if (miliseconds) progress = progress * this.duration;
    if (this.next && this.current) {
      if (this.next.time(1) <= progress) {
        this.nextTime(); //bug-proof
      }
      if (
        this.next instanceof valueKeyframe &&
        this.current instanceof valueKeyframe
      ) {
        progress = Math.min(
          this.easing(progress),
          miliseconds ? this.duration : 1
        );
        const a = this.next.time(1) - this.current.time(1);
        const trace = progress / a;
        const lerp = KeyChanger.lerp(
          this.current.value,
          this.next.value,
          progress < a ? trace : (progress - a) / a
        );
        return lerp;
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
    public keyframes: (
      | __valueKeyframe
      | __objectKeyframe
      | valueKeyframe
      | nestedKeyframe
    )[],
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
  public addKeyframe(
    /**
     * Adds a new keyframe to the entire set,
     *
     * @remarks
     * To apply new keyframes, must do .restart() before
     *
     * @param keyframe - A valid AlgoFrame's keyframe object
     */
    keyframe:
      | __valueKeyframe
      | __objectKeyframe
      | valueKeyframe
      | nestedKeyframe
  ): void {
    const total = this.keyframes.push(keyframe);
  }
  protected asSequence(object: nestedKeyframe, progress: number) {
    // return object.obj.test(progress - this.current!.time);
  }
  protected reset(): void {
    this.keyframes.forEach(k => this.run.push(this.passKeyframe(k)));
  }
  // public restart(): void in abstract parent class
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

function ratioAndMilisecons(
  ratio: number,
  miliseconds: number,
  duration: number
): number {
  /**
   * @param ratio - The ratio of the basic measure, between 0 and 1
   * @param miliseconds - Miliseconds to delay on the ratio
   * @param duration - Total duration of the sequence
   * @returns The arithmetic sum with all parameters in miliseconds
   */
  return ratio * duration + miliseconds;
}
