(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AlgoFrame"] = factory();
	else
		root["AlgoFrame"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
(function (factory) {
    if ( true && typeof module.exports === "object") {
        var v = factory(__webpack_require__(387), exports);
        if (v !== undefined) module.exports = v;
    }
    else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(877), __webpack_require__(101)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const es6_1 = require("./es6");
    const global = {
        delay: 300,
    };
    const timeline_1 = require("./es6/timeline");
    const basic = new timeline_1.Sequence(false, [
        new timeline_1.valueKeyframe(2222, 0, 'ratio'),
        new timeline_1.valueKeyframe(4444, 0.5, 'ratio'),
        new timeline_1.valueKeyframe(6666, 1, 'ratio'),
    ]);
    const first = new timeline_1.Sequence(false, [
        new timeline_1.nestedKeyframe(basic.clone(), 0, 'ratio'),
        new timeline_1.nestedKeyframe(basic.clone(), 0.5, 'ratio'),
        new timeline_1.nestedKeyframe(basic.clone(), 1, 'ratio'),
    ]);
    const second = new timeline_1.Sequence(1000, [
        new timeline_1.nestedKeyframe(first.clone(), 0, 'ratio'),
        new timeline_1.nestedKeyframe(first.clone(), 0.5, 'ratio'),
        new timeline_1.nestedKeyframe(first.clone(), 1, 'ratio'),
    ]);
    function animate() {
        let number = 0;
        return function startAnimation(sequence) {
            number++;
            const animation = new es6_1.Animate({
                sequence,
                easing: 'linear',
                timing: {
                    delay: global.delay,
                },
            });
            animation.run((_a) => {
                var { value } = _a, other = __rest(_a, ["value"]);
                console.log('Animation ' + number);
                console.log(value, [...Object.values(other)]);
            });
        };
    }
    const start = animate();
    // console.log(new ChannelBlock(second, 100).end());
    console.log(second, second.duration, 'duration');
    const custom = 3 || 0;
    let time = 2;
    const getNewK = ({ duration }) => {
        time++;
        return new timeline_1.valueKeyframe(2222 * (((time % 3) / 3) * 3 + 1), duration + 1, 'miliseconds', 200);
    };
    for (let i = 0; i < custom; i++) {
        second.addKeyframes('push', getNewK(second));
    }
    // second.reset();
    console.log(second.duration, 'duration', second.keyframes.map(k => [k.time(1), k.duration]));
    console.log(second
        .addKeyframes('push', getNewK({ duration: second.duration + 200 }))
        .keyframes.map(k => [k.time(1), k.duration]));
    console.error('FROM HERE');
    // keyframes deep clone DONE
    const display = (seq) => seq.keyframes.map(k => [k.time(k.duration), k.duration, k]);
    // second.extendToSequence(second.clone(), { mode: 'shift' });
    console.log(display(second));
    // second.restart();
    start(second);
});
/* let val = 0;
while (++val < 1000) {
  console.log(second.test(val / 1000));
} */


/***/ }),

/***/ 877:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Animate": () => (/* binding */ Animate)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(344);

class Animate {
    constructor(options) {
        // Frame properties
        this.frame = new _utils__WEBPACK_IMPORTED_MODULE_0__/* .Framer */ .DM();
        this.control = new _utils__WEBPACK_IMPORTED_MODULE_0__/* .Controller */ .Qr();
        this.progress = 0;
        // Engine
        this.engine = new _utils__WEBPACK_IMPORTED_MODULE_0__/* .Animator */ .LH(this);
        const { sequence, easing, controls, timing } = options;
        this.engine.easing = (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .passPreset */ .dq)(easing ? easing : "linear");
        this.frame.sequence = sequence;
        if (controls === null || controls === void 0 ? void 0 : controls.FPS)
            this.frame.FPS = controls.FPS; // also implicitily declares Framer._precision
        if (controls === null || controls === void 0 ? void 0 : controls.loop)
            this.control.loop = controls.loop;
        this.frame.start.time = timing.delay;
        this.frame.duration = timing.duration || sequence.duration;
    }
    finally(callback) {
        this.control.finally = callback;
        return this;
    }
    break() {
        this.control.stop = false;
        return this;
    }
    precision(value) {
        this.frame.precision = value;
        return this;
    }
    run(callback) {
        let condition, seg;
        if (callback) {
            this.control.callback = callback;
        }
        if (!this.control.callback)
            throw new Error("Main callback is required for the animation");
        this.frame.last.time = new _utils__WEBPACK_IMPORTED_MODULE_0__/* .Refresher */ .q1();
        this.frame.last.frameRate = this.frame.last.frameRate
            ? this.frame.last.frameRate
            : new _utils__WEBPACK_IMPORTED_MODULE_0__/* .Refresher */ .q1(this.frame.precision);
        function refresh(timestamp) {
            if (this.control.completed) {
                this.frame.frame = -1;
                this.frame.start.animationTime = timestamp;
                this.control.completed = !this.control.completed;
            }
            if (this.frame._FPS) {
                seg = Math.floor((timestamp - this.frame.start.time) / this.frame.delay);
                condition = Boolean(seg > this.frame.count);
            }
            else {
                condition = true;
            }
            this.frame.last.time.refresh(timestamp);
        }
        function animate(timestamp) {
            refresh.call(this, timestamp);
            let runtime, relativeProgress, easedProgress;
            if (this.frame.start.animationTime) {
                runtime = timestamp - this.frame.start.animationTime;
                relativeProgress = runtime / this.frame.duration;
                easedProgress = this.engine.easing(relativeProgress);
                this.progress = easedProgress;
                this.engine.engine({
                    relativeProgress,
                    easedProgress,
                    runtime,
                    timestamp,
                    seg,
                    condition,
                    requestAnimation: animate,
                });
            }
            else if (this.frame.start.time > 0) {
                this.frame.start.animationTime = timestamp;
                let last = 0;
                if (typeof this.frame.last.time.last === "number") {
                    last = this.frame.last.time.last;
                }
                this.frame.start.time =
                    this.frame.start.time - last < last * 0.7
                        ? 0
                        : this.frame.start.time - last;
                requestAnimationFrame(animate.bind(this));
                return;
            }
        }
        requestAnimationFrame(animate.bind(this));
        return this;
    }
}
class AlgoFrame {
    constructor() { }
}


/***/ }),

/***/ 101:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "KeyChanger": () => (/* binding */ KeyChanger),
  "Sequence": () => (/* binding */ Sequence),
  "_keyframe": () => (/* reexport */ _keyframe),
  "isComplex": () => (/* reexport */ isComplex),
  "isSimple": () => (/* reexport */ isSimple),
  "nestedKeyframe": () => (/* reexport */ nestedKeyframe),
  "ratioAndMilisecons": () => (/* reexport */ ratioAndMilisecons),
  "replicate": () => (/* reexport */ replicate),
  "timeIntervals": () => (/* reexport */ timeIntervals),
  "valueKeyframe": () => (/* reexport */ valueKeyframe)
});

// EXTERNAL MODULE: ./es6/utils.js
var utils = __webpack_require__(344);
;// CONCATENATED MODULE: ./es6/timeline/utils.js
function timeIntervals(blocks) {
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
function replicate(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}
function ratioAndMilisecons(ratio, miliseconds, duration) {
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

class valueKeyframe extends _keyframe {
    constructor(value, timing, type = 'miliseconds', delay, hold = false) {
        super(timing, type, delay, hold);
        this.value = value;
    }
}
// unknown now but maybe a special kind of AlgoFrame + Timeline for nested sequencees! And must fit in the timeline keyframe
class nestedKeyframe extends _keyframe {
    constructor(obj, timing, type = 'miliseconds', delay) {
        super(timing, type, delay);
        this.obj = obj;
    }
}
// Enumerables
// export type SimpleKeyframes = BaseKeyframe[];
// export type ComplexKeyframes = ObjectKeyframe[];
function isSimple(object) {
    return 'value' in object && object instanceof _keyframe;
}
function isComplex(object) {
    return 'obj' in object && object instanceof _keyframe;
}

;// CONCATENATED MODULE: ./es6/timeline/index.js



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
        this.easing = (0,utils/* passPreset */.dq)(easing);
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
            if (isSimple(next) && isSimple(this.current)) {
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
            else if (isComplex(next) && isSimple(this.current)) {
                // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
                const nextValueFromObj = new valueKeyframe(this.getAbsoluteStartValue(next.obj), next.time(1), "ratio");
                nextValueFromObj.duration = this.duration;
                return this.test(progress, undefined, undefined, nextValueFromObj
                // this.next.obj.run[0].value
                );
            }
            else if (isComplex(this.current) && isComplex(next)) {
                // this.nextTime();
                // debugger;
                const res = this.currentAsSequence(this.current, progress, this.next ? this.next.time(1) : 1);
                return res;
            }
            else if (isComplex(this.current) && (isSimple(next) || !next)) {
                // console.log(progress.toFixed(2));
                return this.currentAsSequence(this.current, progress, next ? next.time(1) : 1);
            }
        }
    }
    getAbsoluteStartValue(sequence) {
        let last = sequence.current;
        while (last instanceof nestedKeyframe) {
            last = sequence.current;
        }
        return last.value;
    }
    getAbsoluteEndKeyframe(sequence) {
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
            const first = zero instanceof valueKeyframe
                ? new valueKeyframe(zero.value, 0)
                : new nestedKeyframe(zero.obj, 0);
            first.duration = this.duration;
            this.keyframes.unshift(first);
            this.run.push(first);
        }
        if (final.time(1) < 1) {
            if (final instanceof nestedKeyframe)
                throw new Error("Cannot set last keyframe as nested sequence, it's impossible");
            const last = new valueKeyframe(final.value, 1, "ratio");
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
            if (k instanceof nestedKeyframe)
                this.type = "nested";
            this.run.push(k);
        });
        if (!this.type)
            throw new Error("No events/keyframes provided");
        if (this.keyframes[0] instanceof valueKeyframe) {
        }
        try {
            this.nextTime();
        }
        catch (_a) {
            throw new Error("Identical time signatures on keyframes are not allowed on a single animation channel");
        }
    }
    static passKeyframe(k) {
        if (k instanceof nestedKeyframe || k instanceof valueKeyframe)
            return k;
        return this.is_value(k)
            ? new valueKeyframe(k.value, k.timing, k.type)
            : new nestedKeyframe(k.obj, k.timing, k.type);
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
        const { max: duration } = timeIntervals(this.keyframes);
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
            if (isComplex(k)) {
                const copy = replicate(k);
                copy.obj = copy.obj.clone();
                return copy;
            }
            return replicate(k);
        });
        let copy = new Sequence(this.duration, keyframes, this.easing, this.callback);
        return copy;
    }
}


/***/ }),

/***/ 344:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DM": () => (/* binding */ Framer),
/* harmony export */   "LH": () => (/* binding */ Animator),
/* harmony export */   "Qr": () => (/* binding */ Controller),
/* harmony export */   "dq": () => (/* binding */ passPreset),
/* harmony export */   "q1": () => (/* binding */ Refresher)
/* harmony export */ });
/* unused harmony exports EasingFunctions, Initiator */
class EasingFunctions {
}
// no easing; no acceleration
EasingFunctions.linear = (t) => t;
// accelerating from zero velocity
EasingFunctions.easeInQuad = (t) => t * t;
// decelerating to zero velocity
EasingFunctions.easeOutQuad = (t) => t * (2 - t);
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// accelerating from zero velocity
EasingFunctions.easeInCubic = (t) => t * t * t;
// decelerating to zero velocity
EasingFunctions.easeOutCubic = (t) => --t * t * t + 1;
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
// accelerating from zero velocity
EasingFunctions.easeInQuart = (t) => t * t * t * t;
// decelerating to zero velocity
EasingFunctions.easeOutQuart = (t) => 1 - --t * t * t * t;
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutQuart = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
// accelerating from zero velocity
EasingFunctions.easeInQuint = (t) => t * t * t * t * t;
// decelerating to zero velocity
EasingFunctions.easeOutQuint = (t) => 1 + --t * t * t * t * t;
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutQuint = (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;

function passPreset(preset) {
    if (typeof preset !== "function") {
        return EasingFunctions[preset];
    }
    else {
        return preset;
    }
}
class Framer {
    constructor() {
        this._FPS = null;
        this.rate = 0;
        this.count = -1; // this.frame
        this.frame = -1; // this.animationFrame
        this._precision = 30;
        this.start = new Initiator();
    }
    set precision(value) {
        value = Math.abs(value);
        this._precision = value;
    }
    get precision() {
        return this._precision || this._FPS;
    }
    set FPS(value) {
        try {
            value = Math.abs(value);
            this._FPS = value;
        }
        catch (_a) { }
    }
    get FPS() {
        return this._FPS ? 1000 / this._FPS : null;
    }
    get delay() {
        if (!this._FPS)
            throw new Error("Not initialized");
        return 1000 / this._FPS;
    }
}
class Initiator {
    constructor() {
        // Refers to this.start___ whatever
        this.time = 0;
        this.afterWait = null;
        this.animationTime = null;
    }
}
class Controller {
    constructor() {
        this.stop = false;
        this.__start = new Promise((resolve) => (this._start = resolve));
        this.loop = false;
    }
    get completed() {
        return this._completed || !this.stop;
    }
    set completed(value) {
        this._completed = value;
    }
}
class Refresher {
    constructor(precision = 1) {
        this.history = new Array(precision).fill(0);
        this.last = 0;
        this.currenttime = 0;
    }
    refresh(timestamp) {
        this.history.unshift(0);
        this.history.pop();
        this.history[0] = timestamp - this.currenttime;
        this.last = this.history.includes(0)
            ? "Calculating..."
            : this.history.reduce((prev, curr) => prev + curr) / this.history.length;
        this.currenttime = timestamp;
    }
}
class Animator {
    constructor(origin) {
        this.origin = origin;
    }
    engine(parameters) {
        var _a, _b, _c, _d;
        let sent = false;
        function send() {
            sent = true;
            self.frame.value = self.frame.sequence.test(Math.min(parameters.easedProgress, 1));
            self.control.callback(self.frame);
        }
        let self = this.origin;
        if (parameters.condition) {
            self.frame.count = parameters.seg;
            self.frame.start.animationTime =
                typeof self.frame.start.animationTime === "number"
                    ? self.frame.start.animationTime + 1
                    : self.frame.start.animationTime;
            self.frame.last.frameRate.refresh(parameters.timestamp);
            send();
        }
        if (!self.stop) {
            if (parameters.runtime < self.duration) {
                requestAnimationFrame(parameters.requestAnimation.bind(self));
            }
            else if (parameters.runtime + self.last.last > self.duration) {
                self.animationFrame++;
                send();
                self.control.completed = true;
                // debugger;
                if (self.loop)
                    requestAnimationFrame(parameters.requestAnimation.bind(self));
                (_b = (_a = self.control).finally) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            else if (!self.done) {
                self.control.completed = true;
                if (self.loop)
                    requestAnimationFrame(parameters.requestAnimation.bind(self));
                (_d = (_c = self.control).finally) === null || _d === void 0 ? void 0 : _d.call(_c);
            }
        }
        if (self.animationFrame === 0)
            self.__start();
    }
}


/***/ }),

/***/ 387:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 387;
module.exports = webpackEmptyContext;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(503);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});