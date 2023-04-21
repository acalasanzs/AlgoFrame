import { nestedKeyframe, Sequence, valueKeyframe } from './modules/timeline';
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

// console.log(new ChannelBlock(second, 100).end());
console.log(second.duration);
second.addKeyframe(new valueKeyframe(4444, 1001, 'miliseconds'));
console.log(second.duration);
