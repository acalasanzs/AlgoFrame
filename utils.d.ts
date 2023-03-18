declare namespace EasingFunctions {
  // no easing; no acceleration
  const linear: (t: number) => number;
  const easeOutQuad: (t: number) => number;
  const easeInOutQuad: (t: number) => number;
  const easeInCubic: (t: number) => number;
  const easeOutCubic: (t: number) => number;
  const easeInOutCubic: (t: number) => number;
  const easeInQuart: (t: number) => number;
  const easeOutQuart: (t: number) => number;
  const easeInOutQuart: (t: number) => number;
  const easeInQuint: (t: number) => number;
  const easeOutQuint: (t: number) => number;
  const easeInOutQuint: (t: number) => number;
}
export default EasingFunctions;
