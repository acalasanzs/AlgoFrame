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
  new AFT.valueKeyframe(1, 0, 'ratio'),
  new AFT.valueKeyframe(0, 0.5, 'ratio'),
  new AFT.valueKeyframe(0.5, 1, 'ratio'),
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
animation.run(console.log);
// animation.run((x: number) => console.log(keyframes.test(x)));
