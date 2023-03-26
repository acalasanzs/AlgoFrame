class EasingFunctions {
  // no easing; no acceleration
  static linear: (t: number) => number = t => t;
  // accelerating from zero velocity
  static easeInQuad: (t: number) => number = t => t * t;
  // decelerating to zero velocity
  static easeOutQuad: (t: number) => number = t => t * (2 - t);
  // acceleration until halfway; then deceleration
  static easeInOutQuad: (t: number) => number = t =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  // accelerating from zero velocity
  static easeInCubic: (t: number) => number = t => t * t * t;
  // decelerating to zero velocity
  static easeOutCubic: (t: number) => number = t => --t * t * t + 1;
  // acceleration until halfway; then deceleration
  static easeInOutCubic: (t: number) => number = t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  // accelerating from zero velocity
  static easeInQuart: (t: number) => number = t => t * t * t * t;
  // decelerating to zero velocity
  static easeOutQuart: (t: number) => number = t => 1 - --t * t * t * t;
  // acceleration until halfway; then deceleration
  static easeInOutQuart: (t: number) => number = t =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  // accelerating from zero velocity
  static easeInQuint: (t: number) => number = t => t * t * t * t * t;
  // decelerating to zero velocity
  static easeOutQuint: (t: number) => number = t => 1 + --t * t * t * t * t;
  // acceleration until halfway; then deceleration
  static easeInOutQuint: (t: number) => number = t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
type Preset = string | ((x: number) => number);
function passPreset(preset: Preset) {
  if (typeof preset !== 'function') {
    return EasingFunctions[
      preset as keyof typeof EasingFunctions
    ] as Preset as (t: number) => number;
  } else {
    return preset as (t: number) => number;
  }
}
export { EasingFunctions, Preset, passPreset };
