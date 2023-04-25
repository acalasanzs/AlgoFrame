import { KeyChanger, Sequence } from '.';

export function timeIntervals(blocks: _keyframe[]) {
  let max = 1;
  let min = 0;
  const intervals = blocks.map((block, i) => {
    let kDuration = 0;
    function tstart(block: _keyframe) {
      return block.start ? block.start : 0 + block.time();
    }
    const time = tstart(block);
    if (i < blocks.length - 1) {
      kDuration = tstart(blocks[i + 1]) - time - 1;
      if (kDuration < block.delay) {
        throw new Error(
          'Sequences/_keyframe(s) overlapping on the same channel!'
        );
      }
    }
    const end = block.start ? block.start : 0 + time + kDuration;
    max = max < end ? end : max;
    min = min > time ? time : min;
    return [time, end];
  });
  return { max, min };
}
export function replicate(obj: object): object {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}
export function ratioAndMilisecons(
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
export interface IBaseKeyframe {
  time(duration: number): number;
}

export interface IObjectKeyframe extends IBaseKeyframe {
  [x: string]: any;
  obj: KeyChanger<any>;
}
export interface ISimpleKeyframe extends IBaseKeyframe {
  [x: string]: any;
  value: number;
}

export class _keyframe implements IBaseKeyframe {
  static instances = 0;
  readonly id: number;
  public duration!: number;
  constructor(
    public timing: number,
    public type: 'ratio' | 'miliseconds' = 'ratio',
    public delay: number = 0,
    public hold: boolean = false,
    public start: number = 0
  ) {
    if (start < 0) {
      throw new RangeError('Negative start times are not implemented yet');
    }
    this.id = _keyframe.instances++;
    if (this.type === 'miliseconds') {
      this.duration = 0;
    }
  }
  public time(duration: number = this.duration): number {
    let timing = this.timing;
    if (this.delay) {
      if (typeof this.duration !== 'number')
        throw new Error('Keyframe with delay has to have duration setted');
      timing =
        this.type === 'ratio'
          ? ratioAndMilisecons(timing, this.delay, this.duration)
          : timing + this.delay!;
    }
    if (typeof this.duration !== 'number')
      throw new Error(
        'Need to set this.duration to each keyframe in the keyframes manager'
      );
    // if (this.type === 'miliseconds' && !this.duration) console.log(this);
    return this.type === 'miliseconds'
      ? timing / (this.duration === 0 ? 1 : this.duration / duration)
      : duration * timing;
  }
}

export class valueKeyframe extends _keyframe implements ISimpleKeyframe {
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
export class nestedKeyframe extends _keyframe implements IObjectKeyframe {
  constructor(
    public obj: Sequence,
    timing: number,
    type: 'ratio' | 'miliseconds' = 'miliseconds',
    delay?: number
  ) {
    super(timing, type, delay);
  }
}

// Enumerables
// export type SimpleKeyframes = BaseKeyframe[];
// export type ComplexKeyframes = ObjectKeyframe[];

export function isSimple(object: any): object is ISimpleKeyframe {
  return 'value' in object && object instanceof _keyframe;
}
export function isComplex(object: any): object is IObjectKeyframe {
  return 'obj' in object && object instanceof _keyframe;
}

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
