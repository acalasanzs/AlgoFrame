(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Animator = exports.Refresher = exports.Controller = exports.Initiator = exports.Framer = exports.passPreset = exports.EasingFunctions = void 0;
    class EasingFunctions {
    }
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
    exports.EasingFunctions = EasingFunctions;
    function passPreset(preset) {
        if (typeof preset !== 'function') {
            return EasingFunctions[preset];
        }
        else {
            return preset;
        }
    }
    exports.passPreset = passPreset;
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
                throw new Error('Not initialized');
            return 1000 / this._FPS;
        }
    }
    exports.Framer = Framer;
    class Initiator {
        constructor() {
            // Refers to this.start___ whatever
            this.time = 0;
            this.afterWait = null;
            this.animationTime = null;
        }
    }
    exports.Initiator = Initiator;
    class Controller {
        constructor() {
            this.stop = false;
            this.__start = new Promise(resolve => (this._start = resolve));
            this.loop = false;
        }
        get completed() {
            return this._completed || !this.stop;
        }
        set completed(value) {
            this._completed = value;
        }
    }
    exports.Controller = Controller;
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
                : this.history.reduce((prev, curr) => prev + curr) / this.history.length;
            this.currenttime = timestamp;
        }
    }
    exports.Refresher = Refresher;
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
                    typeof self.frame.start.animationTime === 'number'
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
    exports.Animator = Animator;
});
//# sourceMappingURL=utils.js.map