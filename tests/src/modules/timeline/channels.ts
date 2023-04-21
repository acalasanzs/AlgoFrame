import {
  _keyframe,
  ObjectKeyframe,
  Sequence,
  KeyChanger,
  nestedKeyframe,
} from '.';
import { Preset } from '../../utils';

//                                            seq   seq   seq
//.repeat(times:number) in sequence |---------****-****---***----------|
export class ChannelBlock extends _keyframe implements ObjectKeyframe {
  public size!: number;
  // public timing: number = 0;
  constructor(
    public obj: Sequence,
    delay?: number,
    type: 'miliseconds' = 'miliseconds'
  ) {
    super(0, type, delay);
    this.duration = obj.duration;
  }
  public end() {
    return this.time() + this.duration;
  }
  public time() {
    return super.time(this.duration);
  }
}
export class ChannelSequence extends KeyChanger<ChannelBlock> {
  size: number;
  start: number;
  end: number;

  constructor(public blocks: ChannelBlock[], easing: Preset = 'linear') {
    let max = 1;
    let min = 0;
    const intervals = blocks.map(block => {
      max = max < block.end() ? block.end() : max;
      min = min > block.time() ? block.time() : min;
      return [block.time(), block.end()];
    });
    let taken: [number, number][];
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
    super(max, easing);
    this.size = max - min;
    this.start = min;
    this.end = max;
  }
  protected currentAsSequence(
    object: nestedKeyframe,
    progress: number,
    end: number
  ) {}
  protected reset(): void {}
}
export class ChannelsTimeline extends KeyChanger<ChannelSequence> {
  //AllRun? to all channels simultaneously
  // Return a nested object of all the results in a given time?
  // So in that case, call every AlgoFrame Sequence/timeline better.
  constructor(
    duration: number,
    public channels: ChannelSequence[], // Main sequences means a whole channel, but all must have the same length in miliseconds. If not, all will be extended to the largest one.
    easing: Preset = 'linear'
  ) {
    super(duration, easing);
    // All sequences, if not overlaping, return that: undefined, which won't be called on its own Sequence.callback
    //
    const toMaxDuration: Sequence[] = [];
    const maxDuration = channels.reduce(
      (prev: number, cur: ChannelSequence) => {
        if (cur.seq.adaptative) {
          toMaxDuration.push(cur.seq);
          return prev;
        }
        return prev < cur.seq.duration ? cur.seq.duration : prev;
      },
      1
    );

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
