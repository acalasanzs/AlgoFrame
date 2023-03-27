// @ts-ignore
import * as AF from 'algoframe';
import * as AFT from './modules/Timeline';

// Animation engine

const delay: number = 500;

let unitLinearAnimation = new AF.Keyframes(
  [new AF.Keyframes.keyframe(0, 0), new AF.Keyframes.keyframe(1, 1)],
  'linear'
);

unitLinearAnimation = new AFT.Sequence(1000, [
  new AFT.valueKeyframe(0, 0, 'ratio'),
  new AFT.valueKeyframe(1, 1, 'ratio'),
]);

const animation = new AF.AlgoFrame(1000, delay, 'linear', unitLinearAnimation);

// Keyframes
// Needs to allow ratios and miliseconds values on duration
/* const keyframes = new AFT.Sequence(500, [
  new AFT.valueKeyframe(0, 0),
  new AFT.valueKeyframe(100, 450, 'miliseconds'),
]); */

animation.run(console.log);
// animation.run((x: number) => console.log(keyframes.test(x)));
