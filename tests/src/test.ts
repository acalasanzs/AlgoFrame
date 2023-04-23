// @ts-ignore
import * as AF from './algoframe'; // * AlgoFrame 4.4.4
const global = {
  delay: 300,
};
import {
  _keyframe,
  KeyChanger,
  nestedKeyframe,
  Sequence,
  valueKeyframe,
} from './modules/timeline';
import { ChannelBlock } from './modules/timeline/channels';
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
const second = new Sequence(1000, [
  new nestedKeyframe(first.clone(), 0, 'ratio'),
  new nestedKeyframe(first.clone(), 0.5, 'ratio'),
  new nestedKeyframe(first.clone(), 1, 'ratio'),
]);

function animate() {
  let number = 0;
  return function startAnimation(sequence: KeyChanger<any>): void {
    number++;
    const animation = new AF.AlgoFrame(
      sequence.duration,
      global.delay,
      'linear',
      second
    );
    animation.run(
      (b, a) => console.log(b, (a * 100).toFixed(0)),
      'Animation ' + number
    );
  };
}
const start = animate();
// console.log(new ChannelBlock(second, 100).end());
console.log(second.duration);

start(second);
const custom = 1 || 3 || 12;

for (let i = 0; i < custom; i++) {
  second.addKeyframe(
    new valueKeyframe(4444, second.duration + 1, 'miliseconds', 200)
  );
}
console.log(second.duration);
