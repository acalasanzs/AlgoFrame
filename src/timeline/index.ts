import { FrameStats, Preset, passPreset } from '../utils';
import {
  _keyframe,
  IObjectKeyframe,
  nestedKeyframe,
  valueKeyframe,
  __objectKeyframe,
  __valueKeyframe,
  ISimpleKeyframe,
  isComplex,
  isSimple,
  timeIntervals,
  replicate,
  IBaseKeyframe,
  safePad,
  safeShift,
  normalKeyframes,
  // BaseKeyframe,
} from './utils';
export * from './utils';
// Classes

export abstract class KeyChanger<Keyframe extends _keyframe> {
  public duration: number;
  run: Keyframe[];
  next: Keyframe | null = null;
  current: Keyframe | null = null;
  public adaptative: boolean = false;
  easing: (t: number) => number;
  object = Symbol();
  changer!: () => any;
  constructor(
    duration: number | false,
    easing: Preset = 'linear',
    public keyframes: Keyframe[]
  ) {
    this.duration =
      typeof duration === 'number'
        ? Math.floor(duration)
        : (_ => {
            this.adaptative = true;
            return 1;
          })();
    this.run = [];
    this.easing = passPreset(easing);
    this.init(keyframes);
  }
  protected abstract callFinally(ts?: number): void;
  public nextTime(): void {
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
    this.changer?.();
    this.run.shift();
  }
  public abstract reset(): void;
  public restart() {
    while (this.run.length) {
      this.run.pop()!.triggered = false;
    }
    this.reset();
  }
  protected abstract init(keyframes: Keyframe[]): void;
  static rProgressValue(object: IBaseKeyframe, progress: number, end: number) {
    return (progress - object.time(1)) / (end - object.time(1));
  }
  static rProgress(object: IObjectKeyframe, progress: number, end: number) {
    let res = KeyChanger.rProgressValue(object, progress, end);
    object.obj.reset();
    object.obj.nextTime();
    return res;
  }
  // This is called when in this.test(), this.current is of type nestedKeyframe, so treat de return as a nested timeline call.
  protected currentAsSequence(
    object: IObjectKeyframe,
    progress: number,
    end: number
  ): number | undefined {
    // console.log((progress - object.time(1)) / (end - object.time(1)));
    const rProgress = KeyChanger.rProgress(object, progress, end);
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
    nextValue?: ISimpleKeyframe
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
      let past = (this.current as unknown as IObjectKeyframe).obj;
      let pastFinally = past?.callFinally.bind(past);
      let callPast: boolean = false;
      while (next!.time(1) <= progress && !(next!.time(1) === 1)) {
        this.nextTime(); //bug-proof
        next = this.next;
        callPast = true;
      }
      callPast && pastFinally?.();
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
        // if (lerp < 0) {
        //   debugger;
        // }
        // debugger;
        // console.log(this.current, next);
        return lerp;
      } else if (isComplex(next) && isSimple(this.current)) {
        // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
        const nextValueFromObj = new valueKeyframe(
          KeyChanger.getAbsoluteStartValue(next.obj as Sequence),
          next.time(1),
          'ratio'
        );
        nextValueFromObj.duration = this.duration;
        pastFinally?.();
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
  isLastKeyframe(time: number): boolean {
    return (
      (!this.current!.triggered &&
        time >= this.next!.time(1) - this.current!.time(1) &&
        this.run[this.run.length - 1].time(1) !== 1) ||
      (time >= this.run[this.run.length - 1].time(1) &&
        this.run[this.run.length - 1].time(1) === 1)
    );
  }
  getKeyframeForTime(
    time: number,
    miliseconds: boolean = false
  ): {
    keyframe: Keyframe | null;
    end: boolean;
  } {
    // Asegurarse de que el tiempo no sea negativo
    if (time < 0) throw new Error('Time cannot be negative');

    // Si el tiempo es mayor que 1, lo limitamos a 1
    time = time <= 1 ? time : 1;

    let next = this.next;

    // Si el tiempo está en milisegundos, lo convertimos a una escala de 0 a 1
    if (miliseconds) time = time * this.duration;

    // Si hay un keyframe siguiente y un keyframe actual
    if (next && this.current) {
      // Mientras el tiempo del keyframe siguiente sea menor o igual al tiempo dado
      // y el tiempo del keyframe siguiente no sea 1 (el final de la secuencia)
      while (next!.time(1) <= time && !(next!.time(1) === 1)) {
        // Avanzamos al siguiente keyframe
        this.nextTime();
        next = this.next;
      }

      // Comprobamos si el keyframe actual es el último de la secuencia
      let end = this.isLastKeyframe(time);

      // Si el tiempo dado es igual al tiempo del keyframe siguiente
      if (time === next?.time(miliseconds ? this.duration : 1)) {
        this.next!.triggered = true;
        // Devolvemos el keyframe siguiente y si es el final de la secuencia
        return {
          keyframe: next,
          end,
        };
      }
      this.current!.triggered = true;

      // Si el tiempo dado no es igual al tiempo del keyframe siguiente
      // Devolvemos el keyframe actual y si es el final de la secuencia
      return {
        keyframe: this.current,
        end,
      };
    } else {
      this.current!.triggered = true;
      // Si no hay un keyframe siguiente o un keyframe actual
      // Avanzamos al siguiente keyframe y devolvemos el keyframe actual
      // y false para indicar que no es el final de la secuencia
      this.nextTime();
      return {
        keyframe: this.current,
        end: false,
      };
    }
  }
  static getAbsoluteStartValue(sequence: KeyChanger<normalKeyframes>): number {
    let last = sequence.current;
    while (last instanceof nestedKeyframe) {
      last = sequence.current;
    }
    return last!.value;
  }
  static getAbsoluteEndKeyframe(
    sequence: KeyChanger<normalKeyframes>
  ): valueKeyframe {
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
export class Sequence extends KeyChanger<normalKeyframes> {
  type: 'nested' | 'simple' = 'simple';
  taken: number[] = [];
  callback: Function | null = null;
  finallyTriggered: boolean = false;

  constructor(
    duration: number | false,
    public keyframes: (valueKeyframe | nestedKeyframe)[],
    easing: Preset = 'linear',
    public Ocallback: Function | null = null,
    public ofinallyCallback: Function | null = null
  ) {
    super(duration, easing, keyframes);
    this.callback = (all: FrameStats) => {
      const { progress } = all;
      let { keyframe: currentKeyframe, end: next } =
        this.getKeyframeForTime(progress);

      if (!currentKeyframe) return;
      if (next && !this.finallyTriggered) {
        return requestAnimationFrame(this.callFinally.bind(this));
      }
      if (currentKeyframe instanceof nestedKeyframe) {
        // let rProg = KeyChanger.rProgress(currentKeyframe, progress, 1);
        return currentKeyframe.obj.callback?.(all);
      } else {
        return Ocallback?.bind(this)(all);
      }
    };

    // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
  }
  protected callFinally(ts?: number | undefined): void {
    if (this.finallyTriggered) return;
    this.finallyTriggered = true;
    let { keyframe: currentKeyframe } = this.getKeyframeForTime(1);
    if (currentKeyframe instanceof nestedKeyframe) {
      if (!currentKeyframe) return;
      currentKeyframe.obj.callFinally(ts);
    }
    this.ofinallyCallback?.();
  }
  protected init(keyframes: typeof this.keyframes) {
    // if (window['debug']) debugger;
    this.type = 'simple';
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
    } catch (e) {
      debugger;
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
    method: 'push' | 'unshift' = 'push',
    ...keyframes: normalKeyframes[]
  ): Sequence {
    keyframes.forEach(keyframe => {
      const nkeyframe = Sequence.passKeyframe(keyframe);
      this.keyframes[method as 'push' | 'unshift'](nkeyframe);
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
  public extendToSequence(
    seq: Sequence,
    safe: safePad | safeShift = {
      mode: 'shift',
    }
  ) {
    // i.e. concatanate sequences
    // You need to specify if you want to replace the last keyframe of the current this Sequence so the animation can make sense, or, in otherwise, add a apdding to the this animation finish
    if (seq.object === this.object)
      throw new Error('Cannot reextend to my own self');
    let safePad = (safe as any).value * 2;
    safePad = safePad ? safePad : 0;
    if (safePad) {
      seq.duration += 1;
    }
    seq.keyframes.forEach((k, i) => {
      const safing = i < seq.keyframes.length - 1 ? 1 : 0;
      const safeOffset = safePad ? safing : 0;
      if (k.type === 'ratio') {
        k.timing = k.time(seq.duration + this.duration);
        k.type = 'miliseconds';
      } else {
        const durationRatio = k.duration / (seq.duration + k.duration);
        const timingOffset =
          (k.duration + this.duration + safeOffset * safePad) * durationRatio;
        k.timing = k.timing + Math.ceil(timingOffset);
      }

      k.duration +=
        this.duration +
        Math.floor(safePad * (k.duration / (seq.duration + k.duration)));
      if (!safing && safe) {
        k.timing += 1;
      }
    });
    if (safe && !safePad) {
      // safeShift
      this.keyframes.pop();
    }
    this.keyframes.forEach((k, i) => {
      k.duration +=
        this.duration +
        Math.ceil(safePad * (k.duration / (seq.duration + k.duration)));
    });
    this.keyframes.forEach(k => {
      console.log(k.duration);
    });
    /*     const display = (seq: Sequence) =>
      seq.keyframes.map(k => [k.time(k.duration), k.duration]);
    console.log(display(seq), display(this)); */
    console.log(seq.keyframes);
    this.addKeyframes(
      'push',
      ...seq.keyframes.sort((a, b) => a.timing - b.timing)
    );
    console.log(this);
    return this;
  }
  public reset(): void {
    this.keyframes.forEach(k => this.run.push(k));
    this.finallyTriggered = false;
  }
  public clone(): Sequence {
    const keyframes = this.keyframes.map(k => {
      if (isComplex(k)) {
        const copy = replicate(
          k
        ) as Keyframe as IObjectKeyframe as nestedKeyframe;
        copy.obj = copy.obj.clone();
        return copy;
      }
      return replicate(k) as Keyframe;
    });
    let copy: Sequence = new Sequence(
      this.duration,
      keyframes as any,
      this.easing,
      this.callback,
      this.ofinallyCallback
    );

    return copy;
  }
  public reverseKeyframes(keyframes: normalKeyframes[] = this.keyframes) {
    return keyframes
      .map((kf, i) => {
        let replacement: normalKeyframes;
        if (kf instanceof nestedKeyframe) {
          replacement = new nestedKeyframe(
            kf.obj,
            this.duration - kf.timing,
            kf.type,
            kf.delay
          );
        } else {
          replacement = new valueKeyframe(
            kf.value,
            this.duration - kf.timing,
            kf.type,
            kf.delay
          );
        }
        // replacement.duration = kf.duration;
        return replacement;
      })
      .reverse();
  }
  public extendToReverse(safe: safePad | safeShift) {
    let copy: Sequence = new Sequence(
      this.duration + 1,
      this.reverseKeyframes(),
      this.easing,
      this.callback,
      this.ofinallyCallback
    );
    this.extendToSequence(copy, safe);
    return this;
  }
  // public reset(): void in abstract parent class
}
