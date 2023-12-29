export {};
//                                            seq   seq   seq
//.repeat(times:number) in sequence |---------****-****---***----------|
/* export class ChannelBlock extends _keyframe implements IObjectKeyframe {
  public size!: number;
  // public timing: number = 0;
  constructor(
    public obj: Sequence,
    start: number,
    delay?: number,
    type: 'miliseconds' = 'miliseconds'
  ) {
    super(0, type, delay, undefined, start);
    this.duration = obj.duration;
  }
  public end() {
    return this.time() + this.start;
  }
  public time() {
    return super.time(this.duration);
  }
} */
/* export class ChannelSequence extends KeyChanger<nestedKeyframe> {
  size: number;
  start: number;
  end: number;

  constructor(public blocks: nestedKeyframe[], easing: Preset = 'linear') {
    const { max, min } = timeIntervals(blocks);
    blocks.forEach(b => this.run.push(b));
    super(max, easing, blocks);
    this.size = max - min;
    this.start = min;
    this.end = max;
  }
  init() {
    
  }
  reset(): void {
    this.blocks.forEach(k => this.run.push(k));
  }
  clone() {
    let orig = this;
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
  }
} */
/* export class Timeline {
  //AllRun? to all channels simultaneously
  // Return a nested object of all the results in a given time?
  // So in that case, call every AlgoFrame Sequence/timeline better.
  constructor(
    public duration: number,
    public channels: ChannelSequence[], // Main sequences means a whole channel, but all must have the same length in miliseconds. If not, all will be extended to the largest one.
    public easing: Preset = 'linear'
  ) {
    // All sequences, if not overlaping, return that: undefined, which won't be called on its own Sequence.callback
    //
    const toMaxDuration: Sequence[] = [];
    const maxDuration = channels.reduce(
      (prev: number, cur: ChannelSequence) => {
        if (cur.adaptative) {
          toMaxDuration.push(cur);
          return prev;
        }
        return prev < cur.duration ? cur.duration : prev;
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
} */
