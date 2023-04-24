"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsTimeline = exports.ChannelSequence = exports.ChannelBlock = void 0;
const _1 = require(".");
const utils_1 = require("./utils");
//                                            seq   seq   seq
//.repeat(times:number) in sequence |---------****-****---***----------|
class ChannelBlock extends _1._keyframe {
    // public timing: number = 0;
    constructor(obj, start, delay, type = 'miliseconds') {
        super(0, type, delay, undefined, start);
        this.obj = obj;
        this.duration = obj.duration;
    }
    end() {
        return this.time() + this.start;
    }
    time() {
        return super.time(this.duration);
    }
}
exports.ChannelBlock = ChannelBlock;
class ChannelSequence extends _1.KeyChanger {
    constructor(blocks, easing = 'linear') {
        const { max, min } = (0, utils_1.timeIntervals)(blocks);
        blocks.forEach(b => this.run.push(b));
        super(max, easing);
        this.blocks = blocks;
        this.size = max - min;
        this.start = min;
        this.end = max;
    }
    reset() {
        this.blocks.forEach(k => this.run.push(k));
    }
    clone() {
        let orig = this;
        return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
    }
}
exports.ChannelSequence = ChannelSequence;
class ChannelsTimeline {
    //AllRun? to all channels simultaneously
    // Return a nested object of all the results in a given time?
    // So in that case, call every AlgoFrame Sequence/timeline better.
    constructor(duration, channels, // Main sequences means a whole channel, but all must have the same length in miliseconds. If not, all will be extended to the largest one.
    easing = 'linear') {
        this.duration = duration;
        this.channels = channels;
        this.easing = easing;
        // All sequences, if not overlaping, return that: undefined, which won't be called on its own Sequence.callback
        //
        const toMaxDuration = [];
        const maxDuration = channels.reduce((prev, cur) => {
            if (cur.adaptative) {
                toMaxDuration.push(cur);
                return prev;
            }
            return prev < cur.duration ? cur.duration : prev;
        }, 1);
        // All channels with the same length
        channels.forEach(channel => {
            if (channel.duration < maxDuration) {
                channel.enlarge(maxDuration - channel.duration);
            }
        });
    }
    currentAsSequence(object, progress) { }
    reset() { }
}
exports.ChannelsTimeline = ChannelsTimeline;
//# sourceMappingURL=channels.js.map