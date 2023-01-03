import { EasingFunctions } from './utils';
class AlgoFrame {
  constructor(
    duration,
    starttime,
    easing,
    startX,
    endX,
    FPS = null,
    loop = false
  ) {
    if (typeof easing !== 'function') {
      this.easing = EasingFunctions[easing];
    } else {
      this.easing = easing;
    }
    this.starttime = starttime;
    this._starttime = starttime;
    this.duration = duration;
    this.startafterwait = null;
    this.startanimationtime = null;
    this.stop = false;
    this.startX = startX;
    this.endX = endX;
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
  restart(callback) {
    this.frame = -1;
    this.starttime = null;
    return this.run(callback);
  }
  timeline(array, real) {
    this._timeline = [];
    this._running = [];
    this.timelineEnd = false;
    const nextTime = () => {
      if (!this._running.length) {
        this._next = null;
        this.timelineEnd = !false;
      }
      if (this.timelineEnd) return;
      this._next = this._running.reduce((previousValue, currentValue) =>
        currentValue < previousValue ? currentValue : previousValue
      );
    };
    array.forEach(event => {
      this._timeline.push({
        _: new AlgoFrame(
          event.duration,
          event.delay ? event.delay : 0,
          event.easing ? event.easing : this.easing,
          event.startX ? event.startX : this.startX,
          event.endX ? event.endX : this.endX,
          this._FPS
        ).finally(event.finally),
        time: event.time,
        callback: event.run,
      });
    });
    this._timeline.forEach(x => this._running.push(x));
    nextTime();
    this.callback = function (X, easedProgress, params) {
      real(X, easedProgress, params);
      if (this._next) {
        if (easedProgress >= this._next.time) {
          this._next._.startanimationtime =
            params.timestamp + this._next._._starttime;
          console.log(this._next._.starttime, params.timestamp);
          this._next._.run(this._next.callback);
          this._running.shift();
          nextTime();
        }
      }
    };
    return this;
  }
  run(callback, precision = this._FPS) {
    let left;
    let condition, seg;
    this.callback = callback ? callback : this.callback;
    this.timelineEnd = false;
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

    const last = new Refresher();
    if (isNaN(precision)) {
      console.log(new Error(`${precision} is NaN`));
      precision = this._FPS;
    }
    const lastFrameRate = new Refresher(precision);

    if (this.loop) {
      this.next = this.restart.bind(this, callback);
    }
    function animate(timestamp) {
      if (this._FPS) {
        seg = Math.floor((timestamp - this.starttime) / this.frameDelay); // calc frame no.
        condition = Boolean(seg > this.frame);
      } else {
        condition = true;
      }
      last.refresh(timestamp);

      const runtime = timestamp - this.startanimationtime;
      const relativeProgress = runtime / this.duration;

      const easedProgress = this.easing(relativeProgress);
      if (!this.startanimationtime && this.starttime === 0) {
        this.starttimeBefore = timestamp;
        this.startanimationtime = timestamp;
      } else if (this.starttime > 0) {
        this.startanimationtime = timestamp;
        this.starttime =
          this.starttime - last.last < last.last * 0.7
            ? 0
            : this.starttime - last.last;
        requestAnimationFrame(animate.bind(this));
        return;
      }

      if (condition) {
        this.frame = seg;
        this.animationFrame++;
        lastFrameRate.refresh(timestamp);

        left = (this.endX - this.startX) * Math.min(easedProgress, 1);
        this.callback(left + this.startX, easedProgress, {
          lastFrame: lastFrameRate.last,
          currentTime: lastFrameRate.currentTime,
          frame: this.animationFrame,
          timestamp,
        });
      }
      if (!this.stop) {
        if (runtime < this.duration) {
          requestAnimationFrame(animate.bind(this));
        } else if (runtime - last.last * 0.7 < this.duration) {
          this.animationFrame++;
          this.callback(this.endX, 1, {
            lastFrame: lastFrameRate.last,
            currentTime: lastFrameRate.currenttime,
            frame: this.animationFrame,
            timestamp,
          });
          this.next?.();
        } else {
          this.next?.();
        }
      }
    }
    requestAnimationFrame(animate.bind(this));
    return this;
  }
  finally(callback) {
    this.next = callback;
    return this;
  }
  break() {
    this.stop = true;
  }
}
// const anim = new AlgoFrame(2500, 2000, "easeInQuad", 50, 150);
// anim.run((x) => console.log(x));

export default AlgoFrame;
