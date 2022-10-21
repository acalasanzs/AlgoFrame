import { EasingFunctions } from "./utils";
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

    this._FPS = FPS;
    this.frameDelay = 1000 / this._FPS;
    this.frameRate = 0;
    this.frame = -1;

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
    } else throw new Error("Not a valid Number");
  }
  restart(callback) {
    this.frame = -1;
    this.starttime = null;
    return this.run(callback);
  }
  run(callback) {
    let left;
    let currenttime = 0;
    let last = 0;

    if (this.loop) {
      this.next = this.restart.bind(this, callback);
    }
    function animate(timestamp) {
      last = last + (timestamp - last) - currenttime;
      currenttime = timestamp;
      let condition, seg;
      if (this._FPS) {
        seg = Math.floor((timestamp - this.starttime) / this.frameDelay); // calc frame no.
        condition = Boolean(seg > this.frame);
      } else {
        condition = true;
        this.frame++;
        seg = this.frame;
      }

      const runtime = timestamp - this.startanimationtime;
      const relativeProgress = runtime / this.duration;

      const easedProgress = this.easing(relativeProgress);
      if (!this.startanimationtime && this.starttime === 0) {
        this.startanimationtime = timestamp;
      } else if (this.starttime > 0) {
        this.startanimationtime = timestamp;
        this.starttime =
          this.starttime - last < last * 0.7 ? 0 : this.starttime - last;
        requestAnimationFrame(animate.bind(this));
        return;
      }

      if (condition) {
        this.frame = seg;

        left = (this.endX - this.startX) * Math.min(easedProgress, 1);
        callback(left + this.startX, easedProgress, {
          lastFrame: last,
          currentTime: currenttime,
          frame: this.frame,
        });
      }
      if (!this.stop) {
        if (runtime < this.duration) {
          requestAnimationFrame(animate.bind(this));
        } else if (runtime - last * 0.7 < this.duration) {
          callback(this.endX, 1, {
            lastFrame: last,
            currentTime: currenttime,
            frame: this.frame,
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
