import { nestedKeyframe, valueKeyframe } from './src/timeline';
import './style.css';
import { createBoxes, createDOMTree, IAny } from './utils';
import { Animate, Sequence } from './src';
import { FrameStats } from './src/utils';
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
  () => {
    console.log("END BASIC")
  }
);
const first = new Sequence(
  false,
  [
    new nestedKeyframe(basic.clone(), 0, 'ratio'),
    new nestedKeyframe(basic.clone(), 0.5, 'ratio'),
    new nestedKeyframe(basic.clone(), 1, 'ratio'),
  ],
  undefined,
  undefined,
  () => console.log('END FIRST')
);
const second = new Sequence(
  1000,
  [
    new nestedKeyframe(first.clone(), 0, 'ratio'),
    new nestedKeyframe(first.clone(), 0.5, 'ratio'),
    new nestedKeyframe(first.clone(), 1, 'ratio'),
  ],
  undefined,
  undefined,
  () => console.log('END SECOND')
);
const aNormalThing = new Sequence(1400, [
  new valueKeyframe(0, 0, 'ratio'),
  new valueKeyframe(100, 0.5, 'ratio'),
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
  /* const tree =  */ createDOMTree(root, virtual);
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
  animation.run(({ value }) => {
    // console.log(value);
  });
  console.log(second);
  console.log(animation);
}
/* function version4() {
    const animation = new AlgoFrame(800,0,'linear',sequence);
    animation.run(console.log);
} */

// version5();
// version6();
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
    mode: 'shift',
  });
  console.log(aNormalThing.keyframes.map(keyframe => keyframe.value));
  window['normal'] = aNormalThing;
  animation.run(({ value, progress, currentTime }) => {
    theBox[0].style.transform = `translateX(${value}px)`;
  });
}
function version7() {
  const extendedManual = new Sequence(
    3800,
    [
      new valueKeyframe(0, 0, 'miliseconds'),
      new valueKeyframe(100, 700, 'miliseconds'),
      new valueKeyframe(0, 1400, 'miliseconds'),
      new valueKeyframe(0, 2300, 'miliseconds'),
      new valueKeyframe(0, 2800, 'miliseconds'),
      new valueKeyframe(100, 3200, 'miliseconds'),
      new valueKeyframe(0, 3800, 'miliseconds'),
    ],
    'linear',
    undefined,
    () => console.log('END')
  );
  const animation = new Animate({
    sequence: extendedManual,
    easing: 'linear',
    timing: {
      delay: 0,
    },
  });
  animation.run(({ value, progress, currentTime }) => {
    // console.log(extendedManual.run.map((keyframe) => keyframe.value))
    theBox[0].style.transform = `translateX(${value}px)`;
  });
}
version5();
