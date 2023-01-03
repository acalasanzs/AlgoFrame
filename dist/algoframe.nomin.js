(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AlgoFrame"] = factory();
	else
		root["AlgoFrame"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ index)
});

;// CONCATENATED MODULE: ./utils.js
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

;// CONCATENATED MODULE: ./index.js

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
          event.startX ? event.startX : this.startX,
          event.endX ? event.endX : this.endX,
          this._FPS
        ).finally(event.finally),
        time: event.time,
        callback: event.run,
      });
    });
    let all = array.reduce((p, c) => p + c.time, 0);
    if (this.duration < all) {
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
      if (!isNaN(this.precision)) precision = this.precision;
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

/* harmony default export */ const index = (AlgoFrame);

/******/ 	return __webpack_exports__;
/******/ })()
;
});