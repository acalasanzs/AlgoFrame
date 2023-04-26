"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animate = exports.sensibility = void 0;
const utils_1 = require("./utils");
exports.sensibility = 0.9;
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
                this.control.completed = false;
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
            var _a, _b, _c, _d;
            refresh.call(this, timestamp);
            let runtime = null, relativeProgress = null, easedProgress = null;
            this.control.sent = false;
            const send = () => {
                this.control.sent = true;
                this.frame.value = this.frame.sequence.test(Math.min(easedProgress, 1));
                this.control.callback(this.frame.stats());
            };
            if (this.frame.start.animationTime) {
                // console.log(this.frame.start.animationTime - timestamp);
                runtime = timestamp - this.frame.start.animationTime;
                relativeProgress = runtime / this.frame.duration;
                easedProgress = this.engine.easing(relativeProgress);
                this.progress = Math.min(easedProgress, 1);
                this.frame.progress = Math.min(easedProgress, 1);
            }
            // console.log(this.frame.start.time);
            if (!this.frame.start.animationTime && this.frame.start.time === 0) {
                this.frame.start.animationTime = timestamp;
            }
            else if (this.frame.start.time > 0) {
                this.frame.start.animationTime = timestamp;
                let last = 0;
                if (typeof this.frame.last.time.last === 'number') {
                    last = this.frame.last.time.last;
                }
                this.frame.start.time =
                    this.frame.start.time - last < last * exports.sensibility
                        ? 0
                        : this.frame.start.time - last;
                requestAnimationFrame(animate.bind(this));
                return;
            }
            if (condition) {
                this.frame.count = seg;
                this.frame.frame++;
                this.frame.last.frameRate.refresh(timestamp);
                send();
            }
            if (!this.control.stop) {
                if (runtime && runtime < this.frame.duration) {
                    requestAnimationFrame(animate.bind(this));
                }
                else if (runtime &&
                    runtime +
                        (typeof this.frame.last.time.last === 'number'
                            ? this.frame.last.time.last
                            : 0) >
                        this.frame.duration) {
                    this.frame.frame++;
                    send();
                    this.control.completed = true;
                    if (this.control.loop)
                        requestAnimationFrame(animate.bind(this));
                    (_b = (_a = this.control).finally) === null || _b === void 0 ? void 0 : _b.call(_a);
                }
                else if (!this.control.completed) {
                    this.control.completed = true;
                    if (this.control.loop)
                        requestAnimationFrame(animate.bind(this));
                    (_d = (_c = this.control).finally) === null || _d === void 0 ? void 0 : _d.call(_c);
                }
            }
            if (this.frame.frame === 0)
                this.control._start();
        }
        requestAnimationFrame(animate.bind(this));
        return this;
    }
}
exports.Animate = Animate;
class AlgoFrame {
    constructor() { }
}
