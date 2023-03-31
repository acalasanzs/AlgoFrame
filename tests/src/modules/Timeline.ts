import { Preset, EasingFunctions, passPreset } from '../utils';

// Classes

class _keyframe {
  static instances = 0;
  readonly id: number;
  public duration!: number;
  constructor(
    public timing: number,
    public type: 'ratio' | 'miliseconds' = 'ratio',
    public delay?: number,
    public hold: boolean = false
  ) {
    this.id = _keyframe.instances++;
  }
  time(duration: number): number {
    if (this.delay) {
      if (!this.duration)
        throw new Error('Keyframe with delay has to have duration setted');
      this.timing =
        this.type === 'ratio'
          ? ratioAndMilisecons(this.timing, this.delay!, this.duration!)
          : this.timing + this.delay!;
    }
    if (!this.duration)
      throw new Error(
        'Need to set this.duration to each keyframe in the keyframes manager'
      );
    return this.type === 'miliseconds'
      ? this.timing / (this.duration / duration)
      : duration * this.timing;
  }
}

export class valueKeyframe extends _keyframe {
  constructor(
    public value: number,
    timing: number,
    type: 'ratio' | 'miliseconds' = 'miliseconds',
    delay?: number,
    hold: boolean = false
  ) {
    super(timing, type, delay, hold);
  }
}
// unknown now but maybe a special kind of AlgoFrame + Timeline for nested sequencees! And must fit in the timeline keyframe
export class nestedKeyframe extends _keyframe {
  constructor(
    public obj: Sequence,
    timing: number,
    type: 'ratio' | 'miliseconds' = 'miliseconds',
    delay?: number
  ) {
    super(timing, type, delay);
  }
}

export class ChannelBlock extends _keyframe {
  public duration!: number;
  constructor(
    public seq: Sequence,
    timing: number,
    type: 'ratio' | 'miliseconds',
    delay?: number
  ) {
    super(timing, type, delay);
    this.duration = seq.duration;
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
  duration?: number;
};
export type __valueKeyframe = {
  value: number;
  timing: number;
  type: 'ratio' | 'miliseconds';
  delay?: number;
  duration?: number;
};

abstract class KeyChanger {
  public duration: number;
  run: (nestedKeyframe | valueKeyframe)[];
  next: (valueKeyframe | nestedKeyframe) | null = null;
  current: (valueKeyframe | nestedKeyframe) | null = null;
  public adaptative: boolean = false;
  keyframes?: (
    | __valueKeyframe
    | __objectKeyframe
    | valueKeyframe
    | nestedKeyframe
  )[];
  easing: (t: number) => number;

  constructor(duration: number | false, easing: Preset = 'linear') {
    this.duration =
      typeof duration === 'number'
        ? Math.floor(duration)
        : (_ => {
            this.adaptative = true;
            return 1;
          })();
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
      // console.log(this.current?.time(1), this.next.time(1), this.run);
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
  protected abstract currentAsSequence(
    object: nestedKeyframe,
    progress: number,
    end: number
  ): any;
  static lerp(x: number, y: number, a: number) {
    const lerp = x * (1 - a) + y * a;
    return lerp;
  }
  public test(
    progress: number,
    miliseconds: boolean = false,
    runAdaptative: boolean = false,
    nextValue?: valueKeyframe
  ): number | undefined {
    progress = progress <= 1 ? progress : 1;
    let next = nextValue ? nextValue : this.next;
    if (this.adaptative && !runAdaptative) {
      throw new Error(
        'Adaptitive timed sequences cannot be played in first place'
      );
    }
    if (miliseconds && !runAdaptative) progress = progress * this.duration;
    else if (miliseconds)
      throw new Error('miliseconds mode not allowe when adaptative');
    if (next && this.current) {
      while (next!.time(1) <= progress && !(next!.time(1) === 1)) {
        this.nextTime(); //bug-proof
        next = this.next;
      }
      if (
        next instanceof valueKeyframe &&
        this.current instanceof valueKeyframe
      ) {
        progress = Math.min(
          this.easing(progress),
          miliseconds ? this.duration : 1
        );
        const a = next.time(1) - this.current.time(1);
        const trace = progress / a;
        const kProgress =
          progress < progress - a
            ? trace
            : (progress - this.current.time(1)) / a;
        console.log(String([this.current.time(1), next.time(1)]));
        const lerp = KeyChanger.lerp(
          this.current.value,
          next.value,
          next.hold ? kProgress : 0
        );
        // debugger;
        // console.log(this.current, next);
        return lerp;
      } else if (
        next instanceof nestedKeyframe &&
        this.current instanceof valueKeyframe
      ) {
        // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
        const nextValueFromObj = new valueKeyframe(
          this.getAbsoluteStartValue(next.obj),
          next.time(1),
          'ratio'
        );
        nextValueFromObj.duration = this.duration;
        return this.test(
          progress,
          undefined,
          undefined,
          nextValueFromObj
          // this.next.obj.run[0].value
        );
      } else if (
        this.current instanceof nestedKeyframe &&
        next instanceof nestedKeyframe
      ) {
        // this.nextTime();
        // debugger;
        const res = this.currentAsSequence(
          this.current as nestedKeyframe,
          progress,
          this.next ? this.next.time(1) : 1
        );
        return res;
      } else if (
        this.current instanceof nestedKeyframe &&
        (next instanceof valueKeyframe || !next)
      ) {
        // console.log(progress.toFixed(2));
        return this.currentAsSequence(
          this.current as nestedKeyframe,
          progress,
          next ? next.time(1) : 1
        );
      }
    }
  }
  getAbsoluteStartValue(sequence: Sequence): number {
    let last = sequence.current;
    while (last instanceof nestedKeyframe) {
      last = sequence.current;
    }
    return last!.value;
  }
  getAbsoluteEndKeyframe(sequence: Sequence): valueKeyframe {
    let last = sequence.run[sequence.run.length - 1];
    while (last instanceof nestedKeyframe) {
      last = sequence.run[sequence.run.length - 1];
    }
    return last;
  }
}

// TODO:
// 1. Nested Sequence instances DONE
//    Adaptative Sequence duration DONE
// P.D.: That's not the as AlgoFrame.timeline, which each timing 'sequence' has its own function rather a numeric value in a Sequence
export class Sequence extends KeyChanger {
  type: 'nested' | 'simple' = 'simple';
  taken: number[];
  constructor(
    duration: number | false,
    public keyframes: (
      | __valueKeyframe
      | __objectKeyframe
      | valueKeyframe
      | nestedKeyframe
    )[],
    easing: Preset = 'linear',
    public callback: Function | null = null
  ) {
    super(duration, easing);
    // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
    this.taken = [];
    const zero = this.passKeyframe(keyframes[0]);
    const final = this.passKeyframe(keyframes[keyframes.length - 1]);
    zero.duration = this.duration;
    final.duration = this.duration;
    if (zero.time(1) > 0) {
      // this.taken.push(0);
      const first =
        zero instanceof valueKeyframe
          ? new valueKeyframe(zero.value, 0)
          : new nestedKeyframe(zero.obj, 0);
      first.duration = this.duration;
      this.keyframes.unshift(first);
      this.run.push(first);
    }
    if (final.time(1) < 1) {
      if (final instanceof nestedKeyframe)
        throw new Error(
          "Cannot set last keyframe as nested sequence, it's impossible"
        );
      const last = new valueKeyframe(final.value, 1, 'ratio');
      last.duration = this.duration;
      this.keyframes.push(last);
      this.run.push(last);
    }
    this.keyframes.forEach((k: any, i) => {
      k.duration = this.duration;
      k = this.passKeyframe(k);
      const timing = k.time(this.duration);
      if (timing > this.duration) throw new Error('Keyframe timing overflow');
      if (this.taken.includes(timing))
        throw new Error('It must not have repeated times');
      this.taken.push(k.time(1));
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
  ): Sequence {
    return this;
  }
  public replaceKeyframe(
    keyframe:
      | __valueKeyframe
      | __objectKeyframe
      | valueKeyframe
      | nestedKeyframe
  ) {
    return this;
  }
  protected currentAsSequence(
    object: nestedKeyframe,
    progress: number,
    end: number
  ): number | undefined {
    // console.log((progress - object.time(1)) / (end - object.time(1)));
    const rProgress = (progress - object.time(1)) / (end - object.time(1));
    let res!: number;
    if (rProgress <= 1) {
      // console.log(object.obj);
      res = object.obj.test(rProgress, undefined, true) as number;
      return res;
    }
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
    public channels: ChannelBlock[], // Main sequences means a whole channel, but all must have the same length in miliseconds. If not, all will be extended to the largest one.
    easing: Preset = 'linear'
  ) {
    super(duration, easing);
    // All sequences, if not overlaping, return that: undefined, which won't be called on its own Sequence.callback
    //
    const toMaxDuration: Sequence[] = [];
    const maxDuration = channels.reduce((prev: number, cur: ChannelBlock) => {
      if (cur.seq.adaptative) {
        toMaxDuration.push(cur.seq);
        return prev;
      }
      return prev < cur.seq.duration ? cur.seq.duration : prev;
    }, 1);

    // All channels with the same length
    channels.forEach(channel => {
      if (channel.duration < maxDuration) {
        channel.enlarge(maxDuration - channel.duration);
      }
    });
  }
  protected currentAsSequence(object: nestedKeyframe, progress: number) {}
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
