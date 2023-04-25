import { Framer, Controller, Animator, Refresher, passPreset, } from './utils';
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
        this.frame.last.time = new Refresher();
        this.frame.last.frameRate = this.frame.last.frameRate
            ? this.frame.last.frameRate
            : new Refresher(this.frame.precision);
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
class AlgoFrame {
    constructor() { }
}
