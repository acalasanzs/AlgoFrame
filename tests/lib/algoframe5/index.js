(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Animate = void 0;
    const utils_1 = require("./utils");
    class Animate {
        constructor(options) {
            // Frame properties
            this.frame = new utils_1.Framer();
            this.control = new utils_1.Controller();
            this.progress = 0;
            // Engine
            this.engine = new utils_1.Animator(this);
            const { sequence, easing, controls, timing } = options;
            this.engine.easing = (0, utils_1.passPreset)(easing ? easing : 'linear');
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
                throw new Error('Main callback is required for the animation');
            this.frame.last.time = new utils_1.Refresher();
            this.frame.last.frameRate = this.frame.last.frameRate
                ? this.frame.last.frameRate
                : new utils_1.Refresher(this.frame.precision);
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
                    if (typeof this.frame.last.time.last === 'number') {
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
    exports.Animate = Animate;
    class AlgoFrame {
        constructor() { }
    }
});
//# sourceMappingURL=index.js.map