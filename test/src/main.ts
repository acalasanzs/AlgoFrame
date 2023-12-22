import { nestedKeyframe, valueKeyframe } from '@/timeline';
import './style.css';
import { createBoxes } from './utils';
import { Animate, Sequence } from '@';
// import {Animate} from "@";
const basic = new Sequence(
  false,
  [
    new valueKeyframe(2222, 0, 'ratio'),
    new valueKeyframe(4444, 0.5, 'ratio'),
    new valueKeyframe(6666, 1, 'ratio'),
  ],
  'linear',
  undefined,
  () => console.log('END BASIC')
);
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
const root = document.getElementById('app')!;
function trash({ progress }) {
  // console.log(progress)
}
// const boxes = 5;

// const boxElements = createBoxes(root, boxes);
const theBox = createBoxes(root, 1);

const sequence: Sequence = new Sequence(
  800,
  [new valueKeyframe(0, 0, 'ratio'), new valueKeyframe(100, 1, 'ratio')],
  undefined,
  console.log
);
function version5() {
  const animation = new Animate({
    sequence: second,
    easing: 'linear',
    timing: {
      delay: 0,
    },
  });
  animation.run(({ progress }) => console.log(progress));
  console.log(second);
  console.log(animation);
}
/* function version4() {
    const animation = new AlgoFrame(800,0,'linear',sequence);
    animation.run(console.log);
} */

version5();
