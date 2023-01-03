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
    this._start = new Promise(res => (this.__start = res));
    this.startX = startX;
    this.endX = endX;
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
  nextTime() {
    if (!this._running.length) {
      this._next = null;
      this.timelineEnd = !false;
    }
    if (this.timelineEnd) return;
    this._next = this._running.reduce((previousValue, currentValue) =>
      currentValue < previousValue ? currentValue : previousValue
    );
  }
  timeline(array, real) {
    this._timeline = [];
    this._running = [];
    this.timelineEnd = false;
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
    this.nextTime();
    this.callback = function (X, easedProgress, params) {
      real(X, easedProgress, params);
      if (this._next) {
        if (easedProgress >= this._next.time) {
          this._next._.startanimationtime =
            params.timestamp + this._next._._starttime;
          console.log(this._next._.starttime, params.timestamp);
          this._next._.run(this._next.callback);
          this._running.shift();
          this.nextTime();
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

    function animate(timestamp) {
      if (this.done) {
        this.frame = -1;
        this.starttime = this._starttime;
        if (this._timeline) {
          this._timeline.forEach(x => this._running.push(x));
          this.nextTime();
        }
        this.done = false;
      }
      if (this._FPS) {
        seg = Math.floor((timestamp - this.starttime) / this.frameDelay); // calc frame no.
        condition = Boolean(seg > this.frame);
      } else {
        condition = true;
      }
      last.refresh(timestamp);

      const runtime = timestamp - this.startanimationtime;
      let relativeProgress = runtime / this.duration;
      if (relativeProgress > 1) {
        relativeProgress = 1;
      }
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
      let sent = false;
      if (condition) {
        this.frame = seg;
        this.animationFrame++;
        lastFrameRate.refresh(timestamp);
        sent = true;
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
        } else if (runtime - last.last * 0.9 < this.duration && !sent) {
          this.animationFrame++;
          this.callback(this.endX, 1, {
            lastFrame: lastFrameRate.last,
            currentTime: lastFrameRate.currenttime,
            frame: this.animationFrame,
            timestamp,
          });
          this.done = !this.done;
          if (this.loop) this.run(callback, precision);
          this.next?.();
        } else {
          this.done = !this.done;
          if (this.loop) this.run(callback, precision);
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
// const anim = new AlgoFrame(2500, 2000, "easeInQuad", 50, 150);
// anim.run((x) => console.log(x));

export default AlgoFrame;
