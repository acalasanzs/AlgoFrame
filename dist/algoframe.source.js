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
    const nextTime = () => {
      if (!this._timeline.length) return;
      this._next = this._timeline.reduce((previousValue, currentValue) =>
        currentValue < previousValue ? currentValue : previousValue
      );
    };
    array.forEach(event => {
      this._timeline.push({
        _: new AlgoFrame(
          event.duration,
          0,
          event.easing ? event.easing : this.easing,
          event.startX ? event.startX : this.startX,
          event.endX ? event.endX : this.endX
        ).finally(event.finally),
        time: event.time,
        callback: event.run,
      });
    });
    nextTime();
    this.callback = function (X, easedProgress, ...params) {
      real(X, easedProgress, ...params);
      if (easedProgress >= this._next.time) {
        this._next._.run(this._next.callback);
        this._timeline.shift();
        nextTime();
      }
    };
    return this;
  }
  run(callback, precision = this._FPS) {
    let left;
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