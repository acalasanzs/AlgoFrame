import { Sequence } from './timeline';
import { Framer, Controller, Animator, Refresher, passPreset, } from './utils';
export const sensibility = 0.9;
export { Sequence };
export class Animate {
    constructor(options) {
        // Frame properties
        this.frame = new Framer();
        this.control = new Controller();
        this.progress = 0;
        // Engine
        this.engine = new Animator(this);
        const { sequence, easing, controls, timing } = options;
        this.engine.easing = passPreset(easing ? easing : 'linear');
        this.frame.sequence = sequence;
        if (controls === null || controls === void 0 ? void 0 : controls.FPS)
            this.frame.FPS = controls.FPS; // also implicitily declares Framer._precision
        if (controls === null || controls === void 0 ? void 0 : controls.loop)
            this.control.loop = controls.loop;
        this.frame.start.time = (timing === null || timing === void 0 ? void 0 : timing.delay) || 0;
        this.frame.duration = (timing === null || timing === void 0 ? void 0 : timing.duration) || sequence.duration;
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
        if (this.frame.sequence.duration !== this.frame.duration)
            this.frame.duration = this.frame.sequence.duration;
        let condition, seg;
        if (callback) {
            this.control.callback = callback;
        }
        if (!this.control.callback)
            throw new Error('Main callback is required for the animation');
        this.frame.last.time = new Refresher();
        this.frame.last.frameRate = this.frame.last.frameRate
            ? this.frame.last.frameRate
            : new Refresher(this.frame.precision);
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
            var _a, _b, _c, _d, _e, _f;
            refresh.call(this, timestamp);
            let runtime = null, relativeProgress = null, easedProgress = null;
            this.control.sent = false;
            const send = () => {
                var _a, _b;
                this.control.sent = true;
                this.frame.value = this.frame.sequence.test(Math.min(easedProgress, 1));
                // TODO: Add a recursvie callback inside Sequence
                (_b = (_a = this.frame.sequence).callback) === null || _b === void 0 ? void 0 : _b.call(_a, this.frame.stats());
                // console.log(this.frame.sequence)        // END
                this.control.callback(this.frame.stats());
            };
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
                    this.frame.start.time - last < last * sensibility
                        ? 0
                        : this.frame.start.time - last;
                requestAnimationFrame(animate.bind(this));
                return;
            }
            if (this.frame.start.animationTime) {
                // console.log(this.frame.start.animationTime - timestamp);
                runtime = timestamp - this.frame.start.animationTime;
                relativeProgress = runtime / this.frame.duration;
                easedProgress = this.engine.easing(relativeProgress);
                this.progress = Math.min(easedProgress, 1);
                this.frame.progress = Math.min(easedProgress, 1);
            }
            if (condition) {
                this.frame.count = seg;
                this.frame.frame++;
                this.frame.last.frameRate.refresh(timestamp);
                send();
            }
            if (!this.control.stop) {
                if (typeof runtime === 'number' && runtime < this.frame.duration) {
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
                    this.frame.sequence.reset();
                    this.frame.sequence.nextTime();
                    // this.frame.sequence.ofinallyCallback?.();
                }
                else if (!this.control.completed) {
                    this.control.completed = true;
                    if (this.control.loop)
                        requestAnimationFrame(animate.bind(this));
                    (_d = (_c = this.control).finally) === null || _d === void 0 ? void 0 : _d.call(_c);
                    (_f = (_e = this.frame.sequence).ofinallyCallback) === null || _f === void 0 ? void 0 : _f.call(_e);
                }
            }
            if (this.frame.frame === 0)
                this.control._start();
        }
        requestAnimationFrame(animate.bind(this));
        return this;
    }
}
