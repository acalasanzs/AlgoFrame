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

class AlgoFrame {
  constructor(duration, starttime, easing, startX, endX) {
    if (typeof easing !== "function") {
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
  }
  run(callback) {
    let left;
    let currenttime = 0;
    let last = 0;
    function animate(timestamp) {
      last = last + (timestamp - last) - currenttime;
      currenttime = timestamp;

      if (!this.startanimationtime && this.starttime === 0) {
        this.startanimationtime = timestamp;
      } else if (this.starttime > 0) {
        this.starttime =
          this.starttime - last < last * 0.7 ? 0 : this.starttime - last;
        requestAnimationFrame(animate.bind(this));
        return;
      }
      const runtime = timestamp - this.startanimationtime;
      const relativeProgress = runtime / this.duration;

      const easedProgress = this.easing(relativeProgress);

      left = (this.endX - this.startX) * Math.min(easedProgress, 1);
      callback(left + this.startX, easedProgress, last, currenttime);

      if (!this.stop) {
        if (runtime < this.duration) {
          requestAnimationFrame(animate.bind(this));
        } else if (runtime - last * 0.7 < this.duration) {
          callback(this.endX, 1, last, currenttime);
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
