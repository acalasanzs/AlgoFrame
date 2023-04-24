"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = exports.KeyChanger = void 0;
const utils_1 = require("../../utils");
const utils_2 = require("./utils");
__exportStar(require("./utils"), exports);
// Classes
class KeyChanger {
    constructor(duration, easing = 'linear') {
        this.next = null;
        this.current = null;
        this.adaptative = false;
        this.duration =
            typeof duration === 'number'
                ? Math.floor(duration)
                : (_ => {
                    this.adaptative = true;
                    return 1;
                })();
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
            this.next =
                this.run
                    .filter(v => v.time(this.duration) !== this.current.time(this.duration))
                    .reduce((previousValue, currentValue) => currentValue.time(this.duration) <
                    previousValue.time(this.duration)
                    ? currentValue
                    : previousValue) || this.current;
            // console.log(this.current?.time(1), this.next.time(1), this.run);
        }
        else {
            this.restart();
        }
        this.run.shift();
    }
    restart() {
        while (this.run.length)
            this.run.pop();
        this.reset();
        this.init(this.run);
    }
    // This is called when in this.test(), this.current is of type nestedKeyframe, so treat de return as a nested timeline call.
    currentAsSequence(object, progress, end) {
        // console.log((progress - object.time(1)) / (end - object.time(1)));
        const rProgress = (progress - object.time(1)) / (end - object.time(1));
        let res;
        if (rProgress <= 1) {
            // console.log(object.obj);
            res = object.obj.test(rProgress, undefined, true);
            return res;
        }
    }
    static lerp(x, y, a) {
        const lerp = x * (1 - a) + y * a;
        return lerp;
    }
    test(progress, miliseconds = false, runAdaptative = false, nextValue) {
        progress = progress <= 1 ? progress : 1;
        let next = nextValue ? nextValue : this.next;
        if (this.adaptative && !runAdaptative) {
            throw new Error('Adaptitive timed sequences cannot be played in first place');
        }
        if (miliseconds && !runAdaptative)
            progress = progress * this.duration;
        else if (miliseconds)
            throw new Error('miliseconds mode not allowe when adaptative');
        if (next && this.current) {
            while (next.time(1) <= progress && !(next.time(1) === 1)) {
                this.nextTime(); //bug-proof
                next = this.next;
            }
            if ((0, utils_2.isSimple)(next) && (0, utils_2.isSimple)(this.current)) {
                progress = Math.min(this.easing(progress), miliseconds ? this.duration : 1);
                const a = next.time(1) - this.current.time(1);
                const trace = progress / a;
                const kProgress = progress < progress - a
                    ? trace
                    : (progress - this.current.time(1)) / a;
                // console.log(String([this.current.time(1), next.time(1)]));
                const lerp = KeyChanger.lerp(this.current.value, next.value, next.hold ? 0 : kProgress);
                // debugger;
                // console.log(this.current, next);
                return lerp;
            }
            else if ((0, utils_2.isComplex)(next) && (0, utils_2.isSimple)(this.current)) {
                // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
                const nextValueFromObj = new utils_2.valueKeyframe(this.getAbsoluteStartValue(next.obj), next.time(1), 'ratio');
                nextValueFromObj.duration = this.duration;
                return this.test(progress, undefined, undefined, nextValueFromObj
                // this.next.obj.run[0].value
                );
            }
            else if ((0, utils_2.isComplex)(this.current) && (0, utils_2.isComplex)(next)) {
                // this.nextTime();
                // debugger;
                const res = this.currentAsSequence(this.current, progress, this.next ? this.next.time(1) : 1);
                return res;
            }
            else if ((0, utils_2.isComplex)(this.current) && ((0, utils_2.isSimple)(next) || !next)) {
                // console.log(progress.toFixed(2));
                return this.currentAsSequence(this.current, progress, next ? next.time(1) : 1);
            }
        }
    }
    getAbsoluteStartValue(sequence) {
        let last = sequence.current;
        while (last instanceof utils_2.nestedKeyframe) {
            last = sequence.current;
        }
        return last.value;
    }
    getAbsoluteEndKeyframe(sequence) {
        let last = sequence.run[sequence.run.length - 1];
        while (last instanceof utils_2.nestedKeyframe) {
            last = sequence.run[sequence.run.length - 1];
        }
        return last;
    }
}
exports.KeyChanger = KeyChanger;
class Sequence extends KeyChanger {
    constructor(duration, keyframes, easing = 'linear', callback = null) {
        super(duration, easing);
        this.keyframes = keyframes;
        this.callback = callback;
        this.type = 'simple';
        this.taken = [];
        this.init(keyframes);
        // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
    }
    init(keyframes) {
        this.taken = [];
        const zero = keyframes[0];
        const final = keyframes[keyframes.length - 1];
        zero.duration = this.duration;
        final.duration = this.duration;
        if (zero.time(1) > 0) {
            // this.taken.push(0);
            const first = zero instanceof utils_2.valueKeyframe
                ? new utils_2.valueKeyframe(zero.value, 0)
                : new utils_2.nestedKeyframe(zero.obj, 0);
            first.duration = this.duration;
            this.keyframes.unshift(first);
            this.run.push(first);
        }
        if (final.time(1) < 1) {
            if (final instanceof utils_2.nestedKeyframe)
                throw new Error("Cannot set last keyframe as nested sequence, it's impossible");
            const last = new utils_2.valueKeyframe(final.value, 1, 'ratio');
            last.duration = this.duration;
            this.keyframes.push(last);
            this.run.push(last);
        }
        this.keyframes.forEach((k, i) => {
            k.duration = this.duration;
            k = k;
            const timing = k.time(this.duration);
            if (timing > this.duration)
                throw new Error('Keyframe timing overflow');
            if (this.taken.includes(timing))
                throw new Error('It must not have repeated times');
            this.taken.push(k.time(1));
            if (k instanceof utils_2.nestedKeyframe)
                this.type = 'nested';
            this.run.push(k);
        });
        if (!this.type)
            throw new Error('No events/keyframes provided');
        if (this.keyframes[0] instanceof utils_2.valueKeyframe) {
        }
        try {
            this.nextTime();
        }
        catch (_a) {
            throw new Error('Identical time signatures on keyframes are not allowed on a single animation channel');
        }
    }
    static passKeyframe(k) {
        if (k instanceof utils_2.nestedKeyframe || k instanceof utils_2.valueKeyframe)
            return k;
        return this.is_value(k)
            ? new utils_2.valueKeyframe(k.value, k.timing, k.type)
            : new utils_2.nestedKeyframe(k.obj, k.timing, k.type);
    }
    static is_value(object) {
        return 'val' in object;
    }
    addKeyframe(
    /**
     * Adds a new keyframe to the entire set,
     *
     * @remarks
     * To apply new keyframes, must do .restart() before
     *
     * @param keyframe - A valid AlgoFrame's keyframe object
     */
    keyframe) {
        this.keyframes.push(Sequence.passKeyframe(keyframe));
        const { max: duration } = (0, utils_2.timeIntervals)(this.keyframes);
        this.duration = duration;
        return this;
    }
    replaceKeyframe(keyframe) {
        return this;
    }
    reset() {
        this.keyframes.forEach(k => this.run.push(k));
    }
    // public restart(): void in abstract parent class
    clone() {
        let orig = this;
        return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
    }
}
exports.Sequence = Sequence;
//# sourceMappingURL=index.js.map