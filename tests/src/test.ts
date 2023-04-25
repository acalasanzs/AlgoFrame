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
      (b: number, a: number, c: { timestamp: number }) =>
        console.log(b, (a * 100).toFixed(0), c.timestamp - global.delay),
      'Animation ' + number
    );
  };
}
const start = animate();
// console.log(new ChannelBlock(second, 100).end());
console.log(second, second.duration, 'duration');

const custom = 3 || 12;
const getNewK = ({ duration }: { duration: number }) =>
  new valueKeyframe(4444, duration + 1, 'miliseconds', 200);
for (let i = 0; i < custom; i++) {
  second.addKeyframes('push', getNewK(second));
}

second.reset();
console.log(
  second.duration,
  'duration',
  second.keyframes.map(k => [k.time(1), k.duration])
);
console.log(
  second
    .addKeyframes('push', getNewK({ duration: second.duration + 200 }))
    .keyframes.map(k => [k.time(1), k.duration])
);

console.error('FROM HERE');

// keyframes deep clone DONE
second.extendToSequence(second.clone(), { mode: 'pad', value: 201 });
// start(second);
