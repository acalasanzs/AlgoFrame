import { Animate } from '.';
const global = {
  delay: 300,
};
import {
  _keyframe,
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
  return function startAnimation(sequence: Sequence): void {
    number++;
    const animation = new Animate({
      sequence,
      easing: 'linear',
      timing: {
        delay: global.delay,
      },
    });
    animation.run(({ value, ...other }) => {
      console.log('Animation ' + number);
      console.log(value, [...Object.values(other)]);
    });
  };
}
const start = animate();
// console.log(new ChannelBlock(second, 100).end());
console.log(second, second.duration, 'duration');

const custom = 3 || 12;
let time = 2;
const getNewK = ({ duration }: { duration: number }) => {
  time++;
  return new valueKeyframe(
    2222 * (((time % 3) / 3) * 3 + 1),
    duration + 1,
    'miliseconds',
    200
  );
};
for (let i = 0; i < custom; i++) {
  second.addKeyframes('push', getNewK(second));
}

// second.reset();
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
const display = (seq: Sequence) =>
  seq.keyframes.map(k => [k.time(k.duration), k.duration, k.value]);

// second.extendToSequence(second.clone(), { mode: 'shift' });
console.log(display(second));
// second.restart();
// start(second);
let val = 0;
while (++val < 1000) {
  console.log(second.test(val / 1000));
}
