import { Preset, passPreset } from '../../utils';
import {
  _keyframe,
  ObjectKeyframe,
  nestedKeyframe,
  valueKeyframe,
  __objectKeyframe,
  __valueKeyframe,
  SimpleKeyframe,
  isComplex,
  isSimple,
  timeIntervals,
  propertyOf,
  BaseKeyframe,
} from './utils';
export * from './utils';
// Classes

export abstract class KeyChanger<Keyframe extends _keyframe> {
  public duration: number;
  run: Keyframe[];
  keyframes!: Keyframe[];
  next: Keyframe | null = null;
  current: Keyframe | null = null;
  public adaptative: boolean = false;
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
      this.reset();
    }
    this.run.shift();
  }
  public abstract reset(): void;
  protected abstract init(keyframes: Keyframe[]): void;
  // This is called when in this.test(), this.current is of type nestedKeyframe, so treat de return as a nested timeline call.
  protected currentAsSequence(
    object: ObjectKeyframe,
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
  static lerp(x: number, y: number, a: number) {
    const lerp = x * (1 - a) + y * a;
    return lerp;
  }
  public test(
    progress: number,
    miliseconds: boolean = false,
    runAdaptative: boolean = false,
    nextValue?: SimpleKeyframe
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
      if (isSimple(next) && isSimple(this.current)) {
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
        // console.log(String([this.current.time(1), next.time(1)]));
        const lerp = KeyChanger.lerp(
          this.current.value,
          next.value,
          next.hold ? 0 : kProgress
        );
        // debugger;
        // console.log(this.current, next);
        return lerp;
      } else if (isComplex(next) && isSimple(this.current)) {
        // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
        const nextValueFromObj = new valueKeyframe(
          this.getAbsoluteStartValue(next.obj as Sequence),
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
      } else if (isComplex(this.current) && isComplex(next)) {
        // this.nextTime();
        // debugger;
        const res = this.currentAsSequence(
          this.current,
          progress,
          this.next ? this.next.time(1) : 1
        );
        return res;
      } else if (isComplex(this.current) && (isSimple(next) || !next)) {
        // console.log(progress.toFixed(2));
        return this.currentAsSequence(
          this.current,
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
  protected clone(keyframes_property: keyof this): any {
    const clone = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    const keyframes = clone[keyframes_property].map((k: Keyframe) => {
      if (isComplex(k)) (k.obj as typeof this).clone(keyframes_property);
      return k;
    });
    clone.keyframes = keyframes;
    clone.reset();
    return clone;
  }
}

// TODO:
// 1. Nested Sequence instances DONE
//    Adaptative Sequence duration DONE
// P.D.: That's not the as AlgoFrame.timeline, which each timing 'sequence' has its own function rather a numeric value in a Sequence

export type normalKeyframes = valueKeyframe | nestedKeyframe;
export class Sequence extends KeyChanger<normalKeyframes> {
  type: 'nested' | 'simple' = 'simple';
  taken: number[] = [];
  constructor(
    duration: number | false,
    public keyframes: (valueKeyframe | nestedKeyframe)[],
    easing: Preset = 'linear',
    public callback: Function | null = null
  ) {
    super(duration, easing);
    this.init(keyframes);
    // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
  }
  protected init(keyframes: typeof this.keyframes) {
    keyframes.forEach(k => {
      if (k.type == 'ratio') {
        k.timing = k.timing * this.duration;
        k.type = 'miliseconds';
      }
    });
    this.taken = [];
    const zero = keyframes[0];
    const final = keyframes[keyframes.length - 1];
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
      k = k;
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
  static passKeyframe(k: any | nestedKeyframe | valueKeyframe) {
    if (k instanceof nestedKeyframe || k instanceof valueKeyframe) return k;
    return this.is_value(k)
      ? new valueKeyframe(k.value, k.timing, k.type)
      : new nestedKeyframe(k.obj, k.timing, k.type);
  }
  static is_value(object: any): object is __valueKeyframe {
    return 'val' in object;
  }
  public addKeyframes(
    /**
     * Adds a new keyframe to the entire set,
     *
     * @remarks
     * To apply new keyframes, must do .reset() before
     *
     * @param keyframe - A valid AlgoFrame's keyframe object
     */
    ...keyframes: normalKeyframes[]
  ): Sequence {
    keyframes.forEach(keyframe => {
      const nkeyframe = Sequence.passKeyframe(keyframe);
      this.keyframes.push(nkeyframe);
    });
    const { max: duration } = timeIntervals(this.keyframes);
    this.keyframes.forEach(k => {
      if (k.type == 'ratio') {
        k.timing = k.timing * duration;
        k.type = 'miliseconds';
      }
    });
    this.duration = duration;
    this.init(this.keyframes);
    return this;
  }
  public extendToSequence(seq: Sequence) {
    seq.keyframes.forEach(k => {
      k.timing = (k.timing * this.duration) / k.duration;
      k.duration += this.duration;
    });
    console.log(seq.keyframes.map(k => [k.time(1), k.duration]));
    this.addKeyframes(...seq.keyframes);
    return this;
  }
  public reset(): void {
    this.keyframes.forEach(k => this.run.push(k));
  }
  // public reset(): void in abstract parent class
  public clone(): Sequence {
    return super.clone(propertyOf<this>('keyframes'));
  }
}
