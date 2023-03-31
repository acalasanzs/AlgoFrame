// @ts-ignore
import * as AF from 'algoframe'; // * AlgoFrame 4.4.4
import * as AFT from './modules/Timeline';

// Animation engine

// Falta la transición entre nested y value;

const delay: number = 500;

let unitLinearAnimation = new AF.Keyframes(
  [new AF.Keyframes.keyframe(0, 0), new AF.Keyframes.keyframe(1, 1)],
  'linear'
);
const keyframes = new AFT.Sequence(1000, [
  new AFT.valueKeyframe(0, 0.2, 'ratio'),
  new AFT.valueKeyframe(10, 0.5, 'ratio'),
  new AFT.valueKeyframe(50, 1, 'ratio'),
]);

unitLinearAnimation = new AFT.Sequence(1000, [
  new AFT.valueKeyframe(100, 0, 'ratio'),
  new AFT.nestedKeyframe(keyframes, 0.5, 'ratio'),
  new AFT.valueKeyframe(50, 0.75, 'ratio'),
  new AFT.valueKeyframe(100, 0.9, 'ratio'),
]);

// Invalid Keyframes Object AlgoFrame 4.4.4 if(!keyframes instanceof Keyframes) throw
const animation = new AF.AlgoFrame(1000, delay, 'linear', unitLinearAnimation);

// Keyframes
// Needs to allow ratios and miliseconds values on duration
/* const keyframes = new AFT.Sequence(500, [
  new AFT.valueKeyframe(0, 0.2, 'ratio'),
  new AFT.valueKeyframe(1, 100, 'miliseconds'),
  
  => Uncaught Error: Invalid Keyframes Object!
]); */
// keyframes.addKeyframe(new AFT.valueKeyframe(0, 0, 'ratio'));
animation.run((x: any, y: number) => {
  // tslint:disable-next-line:no-debugger
  console.log(x, (y * 100).toFixed(1));
});
// animation.run((x: number) => console.log(keyframes.test(x)));
