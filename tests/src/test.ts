// @ts-ignore
import * as AF from './algoframe'; // * AlgoFrame 4.4.4
import { Sequence, nestedKeyframe, valueKeyframe } from './modules/Timeline';

// Animation engine

// Falta la transición entre nested y value;

const delay: number = 300;

// For reversed timelines, 1 pass to 0 and 0 pass to 1 cosntantly during the animation.

// Blocked keyframes like AE? DONE
const basic = new Sequence(false, [
  new valueKeyframe(2222, 0, 'ratio'),
  new valueKeyframe(4444, 0.5, 'ratio'),
  new valueKeyframe(6666, 1, 'ratio'),
]);
const first = new Sequence(false, [
  new nestedKeyframe(basic.clone(), 0, 'ratio'),
  new nestedKeyframe(basic.clone(), 0.5, 'ratio'),
  new nestedKeyframe(basic.clone(), 1, 'ratio'),
]);
const second = new Sequence(3 ** 3 * 1000, [
  new nestedKeyframe(first.clone(), 0, 'ratio'),
  new nestedKeyframe(first.clone(), 0.5, 'ratio'),
  new nestedKeyframe(first.clone(), 1, 'ratio'),
]);

// Invalid Keyframes Object AlgoFrame 4.4.4 if(!keyframes instanceof Keyframes) throw; not in 5.0.0
const animation = new AF.AlgoFrame(1000, delay, 'linear', second);

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
