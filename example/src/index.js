import './style2.css';
import AlgoFrame from 'algoframe';
import * as BezierEasing from 'bezier-easing';

const delay = 500;

const box = document.querySelector('.container .box');
const stats = document.querySelector('p');

let animation = new AlgoFrame(
  1500,
  delay,
  'easeOutCubic',
  -100 / 14,
  100,
  null,
  true
);
document.querySelector('h2').textContent = 'easeOutCubic';
animation.FPS = 60;
const timeline = [];
let count = -1;
let boxes = [...box.parentNode.childNodes].reduce(
  (p, c) => (c.className === 'box' ? 1 : 0) + p,
  0
);
console.log(boxes);
box.parentNode.childNodes.forEach(node => {
  if (node.className !== 'box') return;
  count++;
  node.style.height = (100 / boxes) * 0.75 + '%';
  document.documentElement.style.setProperty(
    '--size',
    node.offsetHeight + 'px'
  );
  const duration = 500;

  timeline.push({
    time: count == 0 ? 0 : count / boxes,
    duration,
    easing: null,
    run: function (value, eased) {
      console.log(eased);
      this.classList.add('run');
      this.style.left = `calc(${value}% - ${
        this.offsetWidth * (value / 100)
      }px)`;
      this.textContent = value.toFixed(1) + '%';
    }.bind(node),
    finally: _ => node.classList.remove('run'),
  });
});
// console.log(timeline);
function theRealCallback(value, easedProgress) {
  document.querySelector('h2').textContent =
    Math.round(easedProgress * 100) + '%';
}
console.log(timeline);
animation.timeline(timeline, theRealCallback).run();
