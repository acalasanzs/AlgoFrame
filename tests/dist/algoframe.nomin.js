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
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 784:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelsTimeline = exports.Sequence = exports.nestedKeyframe = exports.valueKeyframe = void 0;
const utils_1 = __webpack_require__(626);
// Classes
class _keyframe {
    constructor(timing, type = 'ratio', delay) {
        this.timing = timing;
        this.type = type;
        this.delay = delay;
        this.id = _keyframe.instances++;
    }
    time(duration) {
        if (this.delay) {
            if (!this.duration)
                throw new Error('Keyframe with delay has to have duration setted');
            this.timing =
                this.type === 'ratio'
                    ? ratioAndMilisecons(this.timing, this.delay, this.duration)
                    : this.timing + this.delay;
        }
        if (!this.duration)
            throw new Error('Need to set this.duration to each keyframe in the keyframes manager');
        return this.type === 'miliseconds'
            ? this.timing / (this.duration / duration)
            : duration * this.timing;
    }
}
_keyframe.instances = 0;
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
                    .filter(v => v.time(this.duration) !== this.current.time(this.duration))
                    .reduce((previousValue, currentValue) => currentValue.time(this.duration) <
                    previousValue.time(this.duration)
                    ? currentValue
                    : previousValue) || this.current;
            console.log((_a = this.current) === null || _a === void 0 ? void 0 : _a.time(1), this.next.time(1), this.run);
        }
        else {
            this.restart();
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
            if (next instanceof valueKeyframe &&
                this.current instanceof valueKeyframe) {
                progress = Math.min(this.easing(progress), miliseconds ? this.duration : 1);
                const a = next.time(1) - this.current.time(1);
                const trace = progress / a;
                const lerp = KeyChanger.lerp(this.current.value, next.value, progress < progress - a
                    ? trace
                    : (progress - this.current.time(1)) / a);
                return lerp;
            }
            else if (next instanceof nestedKeyframe &&
                this.current instanceof valueKeyframe) {
                // return (this.current as nestedKeyframe).obj.test(progress - this.current.time);
                const nextValueFromObj = new valueKeyframe(this.getAbsoluteStartValue(next.obj), next.time(1), 'ratio');
                nextValueFromObj.duration = this.duration;
                return this.test(progress, undefined, undefined, nextValueFromObj
                // this.next.obj.run[0].value
                );
            }
            else if (this.current instanceof nestedKeyframe &&
                next instanceof nestedKeyframe) {
                this.nextTime();
                // debugger;
                const res = this.currentAsSequence(this.current, progress, this.next ? this.next.time(1) : 1);
                return res;
            }
            else if (this.current instanceof nestedKeyframe &&
                (next instanceof valueKeyframe || !next)) {
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
    constructor(duration, keyframes, easing = 'linear') {
        super(duration, easing);
        this.keyframes = keyframes;
        this.type = 'simple';
        // Pushes and Checks if all events are of type nestedKeyframe or _keyframe
        this.taken = [];
        const zero = this.passKeyframe(keyframes[0]);
        const final = this.passKeyframe(keyframes[keyframes.length - 1]);
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
            const last = new valueKeyframe(final.value, 1, 'ratio');
            last.duration = this.duration;
            this.keyframes.push(last);
            this.run.push(last);
        }
        this.keyframes.forEach((k, i) => {
            k.duration = this.duration;
            k = this.passKeyframe(k);
            const timing = k.time(this.duration);
            if (timing > this.duration)
                throw new Error('Keyframe timing overflow');
            if (this.taken.includes(timing))
                throw new Error('It must not have repeated times');
            this.taken.push(k.time(1));
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
        return this;
    }
    replaceKeyframe(keyframe) {
        return this;
    }
    currentAsSequence(object, progress, end) {
        // console.log((progress - object.time(1)) / (end - object.time(1)));
        const rProgress = (progress - object.time(1)) / (end - object.time(1));
        let res;
        if (rProgress <= 1.05) {
            res = object.obj.test(rProgress, undefined, true);
            return res;
        }
    }
    reset() {
        this.keyframes.forEach(k => this.run.push(this.passKeyframe(k)));
    }
    // public restart(): void in abstract parent class
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
    currentAsSequence(object, progress) { }
    reset() { }
}
exports.ChannelsTimeline = ChannelsTimeline;
function ratioAndMilisecons(ratio, miliseconds, duration) {
    /**
     * @param ratio - The ratio of the basic measure, between 0 and 1
     * @param miliseconds - Miliseconds to delay on the ratio
     * @param duration - Total duration of the sequence
     * @returns The arithmetic sum with all parameters in miliseconds
     */
    return ratio * duration + miliseconds;
}


/***/ }),

/***/ 494:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// @ts-ignore
const AF = __importStar(__webpack_require__(100)); // * AlgoFrame 4.4.4
const AFT = __importStar(__webpack_require__(784));
// Animation engine
// Falta la transición entre nested y value;
const delay = 500;
let unitLinearAnimation = new AF.Keyframes([new AF.Keyframes.keyframe(0, 0), new AF.Keyframes.keyframe(1, 1)], 'linear');
const keyframes = new AFT.Sequence(1000, [
    new AFT.valueKeyframe(0, 0.2, 'ratio'),
    new AFT.valueKeyframe(10, 0.5, 'ratio'),
    new AFT.valueKeyframe(50, 1, 'ratio'),
]);
unitLinearAnimation = new AFT.Sequence(1000, [
    new AFT.valueKeyframe(100, 0, 'ratio'),
    new AFT.nestedKeyframe(keyframes, 0.5, 'ratio'),
    new AFT.valueKeyframe(50, 0.75, 'ratio'),
    new AFT.valueKeyframe(100, 0.9, 'ratio'),
]);
window['anim'] = new AFT.Sequence(1000, [
    new AFT.valueKeyframe(100, 0, 'ratio'),
    new AFT.nestedKeyframe(keyframes, 0.5, 'ratio'),
    new AFT.valueKeyframe(50, 0.75, 'ratio'),
    new AFT.valueKeyframe(100, 0.9, 'ratio'),
]);
// Invalid Keyframes Object AlgoFrame 4.4.4 if(!keyframes instanceof Keyframes) throw
const animation = new AF.AlgoFrame(1000, delay, 'linear', unitLinearAnimation);
// Keyframes
// Needs to allow ratios and miliseconds values on duration
/* const keyframes = new AFT.Sequence(500, [
  new AFT.valueKeyframe(0, 0.2, 'ratio'),
  new AFT.valueKeyframe(1, 100, 'miliseconds'),
  
  => Uncaught Error: Invalid Keyframes Object!
]); */
// keyframes.addKeyframe(new AFT.valueKeyframe(0, 0, 'ratio'));
animation.run((x, y) => {
    // tslint:disable-next-line:no-debugger
    console.log(x, (y * 100).toFixed(1));
});
// animation.run((x: number) => console.log(keyframes.test(x)));


/***/ }),

/***/ 626:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.passPreset = exports.EasingFunctions = void 0;
class EasingFunctions {
}
exports.EasingFunctions = EasingFunctions;
// no easing; no acceleration
EasingFunctions.linear = t => t;
// accelerating from zero velocity
EasingFunctions.easeInQuad = t => t * t;
// decelerating to zero velocity
EasingFunctions.easeOutQuad = t => t * (2 - t);
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// accelerating from zero velocity
EasingFunctions.easeInCubic = t => t * t * t;
// decelerating to zero velocity
EasingFunctions.easeOutCubic = t => --t * t * t + 1;
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
// accelerating from zero velocity
EasingFunctions.easeInQuart = t => t * t * t * t;
// decelerating to zero velocity
EasingFunctions.easeOutQuart = t => 1 - --t * t * t * t;
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
// accelerating from zero velocity
EasingFunctions.easeInQuint = t => t * t * t * t * t;
// decelerating to zero velocity
EasingFunctions.easeOutQuint = t => 1 + --t * t * t * t * t;
// acceleration until halfway; then deceleration
EasingFunctions.easeInOutQuint = t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
function passPreset(preset) {
    if (typeof preset !== 'function') {
        return EasingFunctions[preset];
    }
    else {
        return preset;
    }
}
exports.passPreset = passPreset;


/***/ }),

/***/ 100:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "AlgoFrame": () => (/* binding */ AlgoFrame),
  "Keyframes": () => (/* binding */ Keyframes)
});

;// CONCATENATED MODULE: ./algoframe/utils.js
const EasingFunctions = {
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  easeInQuad: (t) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // accelerating from zero velocity
  easeInQuint: (t) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

;// CONCATENATED MODULE: ./algoframe/index.js

class AlgoFrame {
  constructor(
    duration,
    starttime,
    easing,
    keyframes,
    FPS = null,
    loop = false
  ) {
    if (typeof easing !== 'function') {
      this.easing = EasingFunctions[easing];
    } else {
      this.easing = easing;
    }
    this.starttime = starttime ? starttime : 0;
    this._starttime = this.starttime;
    this.duration = duration;
    this.startafterwait = null;
    this.startanimationtime = null;
    this.stop = false;
    this._start = new Promise(res => (this.__start = res));
    // if (!(keyframes instanceof Keyframes)) {
    //   throw new Error('Invalid Keyframes Object!');
    // }
    this.keyframes = keyframes;
    this.done = false;
    this.next = undefined;

    this._FPS = FPS;
    this.frameDelay = 1000 / this._FPS;
    this.frameRate = 0;
    this.frame = -1;
    this.animationFrame = -1;

    this.loop = loop;
  }
  get FPS() {
    return this._FPS ? 1000 / this._FPS : null;
  }
  set FPS(value) {
    const FPS = parseFloat(value);
    if (FPS) {
      this._FPS = FPS;
      this.frameDelay = 1000 / FPS;
      // this.frame = -1;
      // this.starttime = null;
    } else throw new Error('Not a valid Number');
  }
  nextTime(arr = this._running) {
    if (!arr.length) {
      console.log(new Error());
    }
    return arr.reduce((previousValue, currentValue) =>
      currentValue.time < previousValue.time ? currentValue : previousValue
    );
  }
  save(callback, precision) {
    this.callback = callback;
    this.precision = precision;
  }
  restartKeyframes(t) {
    this._timeline.forEach(t => {
      if (t.id === this._current.id) return;
      t._.keyframes.restart();
      t._.keyframes.nextTime();
      t.running = false;
    });
  }
  restartTimeline() {
    this._timeline.forEach(x => this._running.push(x));
    this._next = this.nextTime();
  }
  timeline(array, real, reverseLoop) {
    this._timeline = [];
    this._running = [];
    let data = [];
    array.forEach(event => {
      if (event.time >= 1 || event.time < 0 || isNaN(event.time)) {
        throw new Error('Not valid');
      }
      data.push({
        _: new AlgoFrame(
          event.duration,
          event.delay ? event.delay : 0,
          event.easing ? event.easing : this.easing,
          event.keyframes ? event.keyframes.clone() : this.keyframes.clone(),
          this._FPS
        ).finally(event.finally),
        time: event.time,
        callback: event.run,
      });
    });
    let all = array.reduce((p, c) => {
      return p + c.duration || 0 + c.delay || 0;
    }, 0);
    if (all / array[array.length - 1].time < array[array.length - 1].duration) {
      this.duration +=
        array[array.length - 1].duration - all / array[array.length - 1].time;
    }
    if (this.duration < all) {
      this.duration = all;
    }
    const len = data.length;
    for (let i = 0; i < len; i++) {
      const cur = this.nextTime(data);
      cur.id = i + 1;
      cur._.id = i + 1;
      this._timeline.push(cur);
      data.splice(data.indexOf(this._timeline[i]), 1);
    }
    this.saved_timeline = this._timeline.map(l => l.time);
    this.restartTimeline();
    let first = this._next;
    let last = this._timeline.reduce((previousValue, currentValue) =>
      currentValue.time > previousValue.time ? currentValue : previousValue
    );
    this.reversed = false;
    this.callback = function (X, easedProgress, params) {
      real(X, easedProgress, params);
      const next = () => {
        this._next._.startanimationtime =
          params.timestamp + this._next._._starttime;
        this._next._.waiting = true;

        //Parent info
        this._next._.time = this._next.time;

        this._next._.run(this._next.callback);
        this._next.running = true;
        this._current = this._next;
        this._running.shift();
        console.log(
          this._next.time,
          this._running.map(l => l.time)
        );
        if (this._running.length) {
          this._next = this.nextTime();
        }
      };
      if (this._next) {
        if (easedProgress >= this._next.time && !this._next.running) {
          next();
        }
      } else {
        console.log('REVERSED');
        if (reverseLoop && !this.reversed) {
          this._timeline.forEach((l, i) => {
            l.time =
              this.saved_timeline[this.saved_timeline.length - (i + 1)] -
              this.nextTime(this.saved_timeline);
          });
        } else if (reverseLoop) {
          this._timeline.forEach((l, i) => (l.time = this.saved_timeline[i]));
        }

        while (this._running.length) this._running.shift();
        this.restartTimeline();
        this.restartKeyframes();
        if (reverseLoop && !this.reversed) this._running.reverse();
        this.reversed = !this.reversed;
        first = this._next;
        last = this._timeline.reduce((previousValue, currentValue) =>
          currentValue.time > previousValue.time ? currentValue : previousValue
        );
        this._running.shift();
        this._next = this.nextTime();
        next();
      }
    };
    return this;
  }
  run(callback, precision = this._FPS) {
    let condition, seg;
    this.callback = callback ? callback : this.callback;

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
          ? 'Calculating...'
          : this.history.reduce((prev, curr) => prev + curr) /
            this.history.length;
        this.currenttime = timestamp;
      }
    }

    this.last = new Refresher();
    if (isNaN(precision)) {
      console.log(new Error(`${precision} is NaN`));
      precision = this._FPS;
      if (!isNaN(this.precision)) precision = this.precision;
    }
    this.lastFrameRate = this.lastFrameRate
      ? this.lastFrameRate
      : new Refresher(precision);

    function animate(timestamp) {
      if (this.done) {
        this.frame = -1;
        this.startanimationtime = timestamp;
        this.done = false;
        this._next = null;
      }
      if (this._FPS) {
        seg = Math.floor((timestamp - this.starttime) / this.frameDelay);
        condition = Boolean(seg > this.frame);
      } else {
        condition = true;
      }
      this.last.refresh(timestamp);
      const runtime = timestamp - this.startanimationtime;
      let relativeProgress = runtime / this.duration;
      const easedProgress = this.easing(relativeProgress);
      this.progress = easedProgress;
      if (!this.startanimationtime && this.starttime === 0) {
        this.startanimationtime = timestamp;
      } else if (this.starttime > 0) {
        this.startanimationtime = timestamp;
        this.starttime =
          this.starttime - this.last.last < this.last.last * 0.7
            ? 0
            : this.starttime - this.last.last;
        requestAnimationFrame(animate.bind(this));
        return;
      }
      let sent = false;
      if (condition) {
        this.frame = seg;
        this.animationFrame++;
        this.lastFrameRate.refresh(timestamp);
        sent = true;
        this.callback(
          this.waiting ? 0 : this.keyframes.test(Math.min(easedProgress, 1)),
          Math.min(easedProgress, 1),
          {
            lastFrame: this.lastFrameRate.last,
            currentTime: this.lastFrameRate.currentTime,
            frame: this.animationFrame,
            timestamp,
          }
        );
        this.waiting = false;
      }
      if (!this.stop) {
        if (runtime < this.duration) {
          requestAnimationFrame(animate.bind(this));
        } else if (runtime + this.last.last > this.duration) {
          this.animationFrame++;
          // this.keyframes.nextTime();
          this.callback(this.keyframes.test(1), 1, {
            lastFrame: this.lastFrameRate.last,
            currentTime: this.lastFrameRate.currenttime,
            frame: this.animationFrame,
            timestamp,
          });
          this.done = true;
          // this.keyframes.restart();
          debugger;
          if (this.loop) requestAnimationFrame(animate.bind(this));
          this.next?.();
        } else if(!this.done) {
          this.done = true;
          // this.keyframes.restart();
          if (this.loop) requestAnimationFrame(animate.bind(this));
          this.next?.();
        }
      }
      if (this.animationFrame === 0) this.__start();
    }
    requestAnimationFrame(animate.bind(this));
    return this;
  }
  finally(callback) {
    this.next = callback;
    return this;
  }
  break() {
    this.stop = false;
    return this;
  }
  listen(type, callback) {
    switch (type) {
      case 'start':
        this._start.then(callback);
        break;
    }
  }
}
class Keyframes {
  constructor(keyframes, easing) {
    this.keyframes = [];
    this.run = [];
    keyframes.every((keyframe, i) => {
      if (
        !(keyframe instanceof Keyframes.keyframe) ||
        this.keyframes.some(k => k.time === keyframe.time)
      ) {
        console.error(new Error(`Invalid Keyframe ${i + 1}!`));
        return false;
      } else {
        this.keyframes.push(keyframe);
        return true;
      }
    });
    this.keyframes.forEach(k => this.run.push(k));
    if (typeof easing !== 'function') {
      this.easing = EasingFunctions[easing];
    } else {
      this.easing = easing;
    }
    this.nextTime();
  }
  nextTime() {
    if (!this.run.length) {
      return (this.next = null);
    }

    if (this.run.length > 1) {
      this.current = this.run.reduce((previousValue, currentValue) =>
        currentValue.time < previousValue.time ? currentValue : previousValue
      );
      this.next = this.run
        .filter(v => v.time !== this.current.time)
        .reduce((previousValue, currentValue) =>
          currentValue.time < previousValue ? currentValue : previousValue
        );
    } else {
      this.restart();
      this.next = this.run.reduce((previousValue, currentValue) =>
        currentValue.time < previousValue.time ? currentValue : previousValue
      );
    }
    this.run.shift();
  }
  restart() {
    while (this.run.length) this.run.pop();
    this.keyframes.forEach(k => this.run.push(k));
  }
  test(progress) {
    if (this.next.time <= progress) this.nextTime();
    progress = Math.min(this.easing(progress), 1);
    const dif = this.next.val - this.current.val;
    const a = this.next.time - this.current.time;
    const sum = dif * progress;
    return (this.current.val + sum) / a;
  }
  clone() {
    let orig = this;
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
  }
  static keyframe = class {
    constructor(totalProgress, value) {
      this.time = totalProgress;
      this.val = value;
    }
  };
}

// const anim = new AlgoFrame(2500, 2000, "easeInQuad", 50, 150);
// anim.run((x) => console.log(x));




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
/******/ 	var __webpack_exports__ = __webpack_require__(494);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});