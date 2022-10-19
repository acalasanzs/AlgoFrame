import { EasingFunctions } from "./utils";
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
  }
  then(callback) {
    this.next = callback;
  }
  break() {
    this.stop = true;
  }
}
const anim = new AlgoFrame(2500, 2000, "easeInQuad", 50, 150);
anim.run((x) => console.log(x));

export default AlgoFrame;
