export function timeIntervals(blocks) {
    let max = 1;
    let min = 0;
    const intervals = blocks.map((block, i) => {
        let kDuration = 0;
        function tstart(block) {
            return block.start ? block.start : 0 + block.time();
        }
        const time = tstart(block);
        if (i < blocks.length - 1) {
            kDuration = tstart(blocks[i + 1]) - time - 1;
            if (kDuration < block.delay) {
                throw new Error('Sequences/_keyframe(s) overlapping on the same channel!');
            }
        }
        const end = block.start ? block.start : 0 + time + kDuration;
        max = max < end ? end : max;
        min = min > time ? time : min;
        return [time, end];
    });
    return { max, min };
}
export function replicate(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}
export function ratioAndMilisecons(ratio, miliseconds, duration) {
    /**
     * @param ratio - The ratio of the basic measure, between 0 and 1
     * @param miliseconds - Miliseconds to delay on the ratio
     * @param duration - Total duration of the sequence
     * @returns The arithmetic sum with all parameters in miliseconds
     */
    return ratio * duration + miliseconds;
}
class _keyframe {
    constructor(timing, type = 'ratio', delay = 0, hold = false, start = 0) {
        this.timing = timing;
        this.type = type;
        this.delay = delay;
        this.hold = hold;
        this.start = start;
        this.triggered = false;
        if (start < 0) {
            throw new RangeError('Negative start times are not implemented yet');
        }
        this.id = _keyframe.instances++;
        if (this.type === 'miliseconds') {
            this.duration = 0;
        }
    }
    time(duration = this.duration) {
        let timing = this.timing;
        if (this.delay) {
            if (typeof this.duration !== 'number')
                throw new Error('Keyframe with delay has to have duration setted');
            timing =
                this.type === 'ratio'
                    ? ratioAndMilisecons(timing, this.delay, this.duration)
                    : timing + this.delay;
        }
        if (typeof this.duration !== 'number')
            throw new Error('Need to set this.duration to each keyframe in the keyframes manager');
        // if (this.type === 'miliseconds' && !this.duration) console.log(this);
        return this.type === 'miliseconds'
            ? timing / (this.duration === 0 ? 1 : this.duration / duration)
            : duration * timing;
    }
}
_keyframe.instances = 0;
export { _keyframe };
export class valueKeyframe extends _keyframe {
    constructor(value, timing, type = 'miliseconds', delay, hold = false) {
        super(timing, type, delay, hold);
        this.value = value;
    }
}
// unknown now but maybe a special kind of AlgoFrame + Timeline for nested sequencees! And must fit in the timeline keyframe
export class nestedKeyframe extends _keyframe {
    constructor(obj, timing, type = 'miliseconds', delay) {
        super(timing, type, delay);
        this.obj = obj;
    }
}
// Enumerables
// export type SimpleKeyframes = BaseKeyframe[];
// export type ComplexKeyframes = ObjectKeyframe[];
export function isSimple(object) {
    return 'value' in object && object instanceof _keyframe;
}
export function isComplex(object) {
    return 'obj' in object && object instanceof _keyframe;
}
