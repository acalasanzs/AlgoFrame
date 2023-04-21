import { KeyChanger, Sequence } from '.';

export function timeIntervals(blocks: _keyframe[]) {
  let max = 1;
  let min = 0;
  const intervals = blocks.map(block => {
    max = max < block.end() ? block.end() : max;
    min = min > block.time() ? block.time() : min;
    return [block.time(), block.end()];
  });
  let taken: number[][] = [intervals[0]];
  intervals.shift();
  function inIntervals(val: number, intervals = taken) {
    return intervals.some(interval => {
      return val - interval[0] <= interval[1];
    });
  }
  intervals.forEach(block => {
    if (inIntervals(block[0], taken) && inIntervals(block[1], taken)) {
      throw new Error('Sequences overlapping on the same channel!');
    }
  });
  return { max, min };
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
export interface BaseKeyframe {
  time(duration: number): number;
  end(duration: number): number;
}

export interface ObjectKeyframe extends BaseKeyframe {
  [x: string]: any;
  obj: KeyChanger<any>;
}
export interface SimpleKeyframe extends BaseKeyframe {
  [x: string]: any;
  value: number;
}

export class _keyframe implements BaseKeyframe {
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
    if (this.type === 'miliseconds') {
      this.duration = 0;
    }
  }
  public time(duration: number = this.duration): number {
    if (this.delay) {
      if (typeof this.duration !== 'number')
        throw new Error('Keyframe with delay has to have duration setted');
      this.timing =
        this.type === 'ratio'
          ? ratioAndMilisecons(this.timing, this.delay!, this.duration!)
          : this.timing + this.delay!;
    }
    if (typeof this.duration !== 'number')
      throw new Error(
        'Need to set this.duration to each keyframe in the keyframes manager'
      );
    return this.type === 'miliseconds'
      ? this.timing / (this.duration / duration)
      : duration * this.timing;
  }
  public end(duration: number = this.duration) {
    return this.time(duration) + this.duration;
  }
}

export class valueKeyframe extends _keyframe implements SimpleKeyframe {
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
export class nestedKeyframe extends _keyframe implements ObjectKeyframe {
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

export function isSimple(object: any): object is SimpleKeyframe {
  return 'value' in object && object instanceof _keyframe;
}
export function isComplex(object: any): object is ObjectKeyframe {
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
