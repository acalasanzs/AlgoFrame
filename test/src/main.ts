import { nestedKeyframe, valueKeyframe } from '@/timeline';
import {ChannelBlock} from "@/timeline/channels";
import './style.css';
import { createBoxes, createDOMTree, IAny } from './utils';
import { Animate, Sequence } from '@';
import { FrameStats } from '@/utils';
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
const aNormalThing = new Sequence(1400, [
  new valueKeyframe(0, 0, 'ratio'),
  new valueKeyframe(100, .5, 'ratio'),
  new valueKeyframe(0, 1, 'ratio'),
]);

const root = document.getElementById('app')!;

function trash({ progress }: FrameStats) {
  // console.log(progress)
}
// const boxes = 5;
const virtual: IAny = {
  tagName: 'div',
  className: 'title',
  children: [
    {
      tagName: 'h1',
      textContent: 'Bezier Easing',
    },
    {
      tagName: 'h2',
      textContent: '()',
    },
    {
      tagName: 'p',
    },
  ],
};
function createUI(root: Element, virtual: IAny) {
  /* const tree =  */createDOMTree(root, virtual);
}
// console.log(virtual)
// const boxElements = createBoxes(root, boxes);
createUI(root, virtual);

const theBox = createBoxes(root, 5);
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
  // animation.run(({ progress }) => console.log(progress));
  console.log(second);
  console.log(animation);
}
/* function version4() {
    const animation = new AlgoFrame(800,0,'linear',sequence);
    animation.run(console.log);
} */

// version5();
version6();
function version6() {
  const animation = new Animate({
    sequence: aNormalThing,
    easing: 'linear',
    timing: {
      delay: 0,
    },
  });
/*   aNormalThing.extendToReverse({
    mode: 'pad',
    value: 100,
  }); */
  aNormalThing.extendToReverse({
    mode: 'pad',
    value: 1000
  });
  console.log(aNormalThing.keyframes);
  window["normal"] = aNormalThing;
  animation.run(({value, progress, currentTime}) => {
    console.log(value, progress, currentTime)
    theBox[0].style.transform = `translateX(${value}px)`;
  });
}
