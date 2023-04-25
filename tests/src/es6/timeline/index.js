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
const utils_1 = require("../utils");
const utils_2 = require("./utils");
__exportStar(require("./utils"), exports);
// Classes
class KeyChanger {
    constructor(duration, easing = "linear", keyframes) {
        this.keyframes = keyframes;
        this.next = null;
        this.current = null;
        this.adaptative = false;
        this.object = Symbol();
        this.duration =
            typeof duration === "number"
                ? Math.floor(duration)
                : ((_) => {
                    this.adaptative = true;
                    return 1;
                })();
        this.run = [];
        this.easing = (0, utils_1.passPreset)(easing);
        this.init(keyframes);
    }
    nextTime() {
        var _a;
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
                    .filter((v) => v.time(this.duration) !== this.current.time(this.duration))
                    .reduce((previousValue, currentValue) => currentValue.time(this.duration) <
                    previousValue.time(this.duration)
                    ? currentValue
                    : previousValue) || this.current;
            // console.log(this.current?.time(1), this.next.time(1), this.run);
        }
        else {
            this.restart();
        }
        (_a = this.changer) === null || _a === void 0 ? void 0 : _a.call(this);
        this.run.shift();
    }
    restart() {
        while (this.run.length)
            this.run.pop();
        this.reset();
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
        if (progress < 0)
            debugger;
        progress = progress <= 1 ? progress : 1;
        let next = nextValue ? nextValue : this.next;
        if (this.adaptative && !runAdaptative) {
            throw new Error("Adaptitive timed sequences cannot be played in first place");
        }
        if (miliseconds && !runAdaptative)
            progress = progress * this.duration;
        else if (miliseconds)
            throw new Error("miliseconds mode not allowe when adaptative");
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
                const nextValueFromObj = new utils_2.valueKeyframe(this.getAbsoluteStartValue(next.obj), next.time(1), "ratio");
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
// TODO:
// 1. Nested Sequence instances DONE
//    Adaptative Sequence duration DONE
// P.D.: That's not the as AlgoFrame.timeline, which each timing 'sequence' has its own function rather a numeric value in a Sequence
class Sequence extends KeyChanger {
    constructor(duration, keyframes, easing = "linear", callback = null) {
        super(duration, easing, keyframes);
        this.keyframes = keyframes;
        this.callback = callback;
        this.type = "simple";
        this.taken = [];
        // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
    }
    init(keyframes) {
        // if (window['debug']) debugger;
        this.type = "simple";
        keyframes.forEach((k) => {
            if (k.type == "ratio") {
                k.timing = k.timing * this.duration;
                k.type = "miliseconds";
            }
        });
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
            const last = new utils_2.valueKeyframe(final.value, 1, "ratio");
            last.duration = this.duration;
            this.keyframes.push(last);
            this.run.push(last);
        }
        this.keyframes.forEach((k, i) => {
            k.duration = this.duration;
            k = k;
            const timing = k.time(this.duration);
            if (timing > this.duration)
                throw new Error("Keyframe timing overflow");
            if (this.taken.includes(timing))
                throw new Error("It must not have repeated times");
            this.taken.push(k.time(1));
            if (k instanceof utils_2.nestedKeyframe)
                this.type = "nested";
            this.run.push(k);
        });
        if (!this.type)
            throw new Error("No events/keyframes provided");
        if (this.keyframes[0] instanceof utils_2.valueKeyframe) {
        }
        try {
            this.nextTime();
        }
        catch (_a) {
            throw new Error("Identical time signatures on keyframes are not allowed on a single animation channel");
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
        return "val" in object;
    }
    addKeyframes(
    /**
     * Adds a new keyframe to the entire set,
     *
     * @remarks
     * To apply new keyframes, must do .reset() before
     *
     * @param keyframe - A valid AlgoFrame's keyframe object
     */
    method = "push", ...keyframes) {
        keyframes.forEach((keyframe) => {
            const nkeyframe = Sequence.passKeyframe(keyframe);
            this.keyframes[method](nkeyframe);
        });
        const { max: duration } = (0, utils_2.timeIntervals)(this.keyframes);
        this.keyframes.forEach((k) => {
            if (k.type == "ratio") {
                k.timing = k.timing * duration;
                k.type = "miliseconds";
            }
        });
        this.duration = duration;
        this.init(this.keyframes);
        return this;
    }
    extendToSequence(seq, safe) {
        if (seq.object === this.object)
            throw new Error("Cannot reextend to my own self");
        let safePad = safe.value * 2;
        safePad = safePad ? safePad : 0;
        if (safePad) {
            seq.duration += 1;
        }
        seq.keyframes.forEach((k, i) => {
            const safing = i < seq.keyframes.length - 1 ? 1 : 0;
            const safeOffset = safePad ? safing : 0;
            k.timing =
                k.timing +
                    (k.duration + this.duration + safeOffset * safePad) *
                        (k.duration / (this.duration + k.duration));
            k.duration += this.duration;
            if (!safing && safe) {
                k.timing += 1;
            }
        });
        if (safe && !safePad) {
            // safeShift
            this.keyframes.pop();
        }
        this.keyframes.forEach((k) => {
            k.duration += this.duration;
        });
        this.keyframes.forEach((k) => {
            console.log(k.duration);
        });
        /*     const display = (seq: Sequence) =>
          seq.keyframes.map(k => [k.time(k.duration), k.duration]);
        console.log(display(seq), display(this)); */
        this.addKeyframes("push", ...seq.keyframes);
        return this;
    }
    reset() {
        this.keyframes.forEach((k) => this.run.push(k));
    }
    clone() {
        const keyframes = this.keyframes.map((k) => {
            if ((0, utils_2.isComplex)(k)) {
                const copy = (0, utils_2.replicate)(k);
                copy.obj = copy.obj.clone();
                return copy;
            }
            return (0, utils_2.replicate)(k);
        });
        let copy = new Sequence(this.duration, keyframes, this.easing, this.callback);
        return copy;
    }
}
exports.Sequence = Sequence;
