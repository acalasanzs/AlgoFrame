const EasingFunctions = {
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t * t,
  // decelerating to zero velocity
  easeOutQuad: t => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: t => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: t => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: t => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: t => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  // accelerating from zero velocity
  easeInQuint: t => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: t => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
}; // CONCATENATED MODULE: ./index.js

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
    this.starttime = starttime;
    this._starttime = starttime;
    this.duration = duration;
    this.startafterwait = null;
    this.startanimationtime = null;
    this.stop = false;
    this._start = new Promise(res => (this.__start = res));
    if (!(keyframes instanceof Keyframes)) {
      throw new Error('Invalid Keyframes Object!');
    }
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
  nextTime() {
    if (!this._running.length) {
      this._next = null;
      this.timelineEnd = !false;
    }
    if (this.timelineEnd) return;
    this._next = this._running.reduce((previousValue, currentValue) =>
      currentValue.time < previousValue ? currentValue : previousValue
    );
  }
  save(callback, precision) {
    this.callback = callback;
    this.precision = precision;
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
          event.keyframes ? event.keyframes : this.keyframes,
          this._FPS
        ).finally(event.finally),
        time: event.time,
        callback: event.run,
      });
    });
    let all = array.reduce((p, c, i) => {
      return p + c.duration || 0 + c.delay || 0;
    }, 0);
    if (this.duration !== all) {
      this.duration = all;
    }
    this._timeline.forEach(x => this._running.push(x));
    this.nextTime();
    this.callback = function (X, easedProgress, params) {
      real(X, easedProgress, params);
      if (this._next) {
        if (easedProgress >= this._next.time) {
          this._next._.startanimationtime =
            params.timestamp + this._next._._starttime;
          this._next._.starttime += !isNaN(this.starttime) ? 0 : this.delay;
          this._next._.waiting = true;
          this._next._.run(this._next.callback);
          this._running.shift();
          this.nextTime();
        }
      }
    };
    return this;
  }
  run(callback, precision = this._FPS) {
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
        this.starttime = this._starttime;
        if (this._timeline) {
          this.timelineEnd = false;
          this._timeline.forEach(x => this._running.push(x));
          this.nextTime();
          this._running.forEach(t => {
            t._.keyframes.restart();
            t._.keyframes.nextTime();
          });
        }
        this.done = false;
      }
      if (this._FPS) {
        seg = Math.floor((timestamp - this.starttime) / this.frameDelay); // calc frame no.
        condition = Boolean(seg > this.frame);
      } else {
        condition = true;
      }
      this.last.refresh(timestamp);
      const runtime = timestamp - this.startanimationtime;
      let relativeProgress = runtime / this.duration;
      const easedProgress = this.easing(relativeProgress);
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
          easedProgress,
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
          this.callback(this.keyframes.test(1), 1, {
            lastFrame: this.lastFrameRate.last,
            currentTime: this.lastFrameRate.currenttime,
            frame: this.animationFrame,
            timestamp,
          });
          this.done = true;
          this.keyframes.restart();
          if (this.loop) this.run(callback, precision);
          this.next?.();
        } else {
          this.done = true;
          this.keyframes.restart();
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
    // console.log(a, this.current.val + sum);
    return (this.current.val + sum) / a;
  }
  static keyframe = class {
    constructor(totalProgress, value) {
      this.time = totalProgress;
      this.val = value;
    }
  };
}
