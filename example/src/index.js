import './style2.css';
import AlgoFrame from 'algoframe';
import * as BezierEasing from 'bezier-easing';

const delay = 500;

const box = document.querySelector('.container .box');
const stats = document.querySelector('p');

let animation = new AlgoFrame(1500, delay, 'easeOutCubic', 0, 100, null, true);
document.querySelector('h2').textContent = 'easeOutCubic';
animation.FPS = 60;
let boxes = 0;
[...box.parentNode.childNodes].forEach(c =>
  c.className === 'box' ? (boxes += 1) : (boxes += 0)
);
const timeline = [];
box.parentNode.childNodes.forEach((node, i) => {
  if (node.className !== 'box') return;
  node.style.height = (100 / boxes) * 0.75 + '%';
  document.documentElement.style.setProperty(
    '--size',
    node.offsetHeight + 'px'
  );
  const duration = 500;

  timeline.push({
    time: (i + 1) / (box.parentNode.childNodes.length + 1),
    duration,
    easing: null,
    startX: null,
    endX: null,
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
animation.timeline(timeline, theRealCallback).run();
