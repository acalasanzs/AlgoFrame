"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsTimeline = exports.Sequence = exports.nestedKeyframe = exports.valueKeyframe = void 0;
const utils_1 = require("../utils");
// Classes
class _keyframe {
    constructor(timing, type = 'ratio') {
        this.timing = timing;
        this.type = type;
    }
    time(duration) {
        return this.type === 'miliseconds' ? this.timing : duration * this.timing;
    }
}
class valueKeyframe extends _keyframe {
    constructor(value, timing, type = 'miliseconds') {
        super(timing, type);
        this.value = value;
    }
}
exports.valueKeyframe = valueKeyframe;
// unknown now but maybe a special kind of AlgoFrame + Timeline for nested sequencees! And must fit in the timeline keyframe
class nestedKeyframe extends _keyframe {
    constructor(obj, timing, type = 'miliseconds') {
        super(timing, type);
        this.obj = obj;
    }
}
exports.nestedKeyframe = nestedKeyframe;
class KeyChanger {
    constructor(duration, easing = 'linear') {
        this.next = null;
        this.current = null;
        this.testType = 'ratio';
        this.duration = Math.floor(duration);
        this.run = [];
        this.easing = (0, utils_1.passPreset)(easing);
    }
    nextTime() {
        if (!this.run.length) {
            this.next = null;
            return;
        }
        if (this.run.length > 1) {
            this.current = this.run.reduce((previousValue, currentValue) => {
                return currentValue.time(this.duration) <
                    previousValue.time(this.duration)
                    ? currentValue
                    : previousValue;
            });
            this.next = this.run
                .filter(v => v.time(this.duration) !== this.current.time(this.duration))
                .reduce((previousValue, currentValue) => currentValue.time(this.duration) < previousValue.time(this.duration)
                ? currentValue
                : previousValue);
        }
        else {
            this.restart();
            this.next = this.run.reduce((previousValue, currentValue) => currentValue.time < previousValue.time ? currentValue : previousValue);
        }
        this.run.shift();
    }
    passKeyframe(k) {
        if (k instanceof nestedKeyframe || k instanceof valueKeyframe)
            return k;
        return this.is_value(k)
            ? new valueKeyframe(k.value, k.timing, k.type)
            : new nestedKeyframe(k.obj, k.timing, k.type);
    }
    is_value(object) {
        return 'val' in object;
    }
    restart() {
        while (this.run.length)
            this.run.pop();
        this.reset();
    }
    test(progress, miliseconds = false) {
        if (!miliseconds)
            progress = progress * this.duration;
        if (this.next && this.current) {
            if (this.next.time(this.duration) <= progress)
                this.nextTime(); //bug-proof
            if (this.next instanceof valueKeyframe &&
                this.current instanceof valueKeyframe) {
                progress = Math.min(this.easing(progress), 1);
                const dif = this.next.value - this.current.value;
                const a = this.next.time(this.duration) - this.current.time(this.duration);
                const sum = dif * progress;
                return (this.current.value + sum) / a;
            }
            else {
                // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
                return this.asSequence(this.current, progress);
            }
        }
    }
}
class Sequence extends KeyChanger {
    constructor(duration, keyframes, easing = 'linear') {
        super(duration, easing);
        this.keyframes = keyframes;
        this.type = 'simple';
        // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
        this.keyframes.forEach((k, i) => {
            k = this.passKeyframe(k);
            if (k instanceof nestedKeyframe)
                this.type = 'nested';
            this.run.push(k);
        });
        if (!this.type)
            throw new Error('No events/keyframes provided');
        if (this.keyframes[0] instanceof valueKeyframe) {
        }
        try {
            this.nextTime();
        }
        catch (_a) {
            throw new Error('Identical time signatures on keyframes are not allowed on a single animation channel');
        }
    }
    asSequence(object, progress) {
        // return object.obj.test(progress - this.current!.time);
    }
    reset() {
        this.keyframes.forEach(k => this.run.push(this.passKeyframe(k)));
    }
    clone() {
        let orig = this;
        return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
    }
}
exports.Sequence = Sequence;
class ChannelsTimeline extends KeyChanger {
    //AllRun? to all channels simultaneously
    // Return a nested object of all the results in a given time?
    // So in that case, call every AlgoFrame Sequence/timeline better.
    constructor(duration, channels, // Main sequences means a whole channel, but all must have the same length in miliseconds. If not, all will be extended to the largest one.
    easing = 'linear') {
        super(duration, easing);
        this.channels = channels;
    }
    asSequence(object, progress) { }
    reset() { }
}
exports.ChannelsTimeline = ChannelsTimeline;
//# sourceMappingURL=Timeline.js.map