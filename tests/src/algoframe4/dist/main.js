const delay = 500;
const duration = 500;
const box = document.querySelector('.container .box');
const stats = document.querySelector('p');

const keyframes = new Keyframes(
  [
    new Keyframes.keyframe(0, 0),
    new Keyframes.keyframe(0.5, 100),
    ,
    new Keyframes.keyframe(1, 0),
  ],
  'linear'
);
let count = 0;
let variable = 1;
let animation = new AlgoFrame(duration, delay, 'easeOutQuad', keyframes);
animation.loop = true;
document.querySelector('h2').textContent = 'easeInQuad';
animation.FPS = 60;
let boxes = 0;
[...box.parentNode.childNodes].forEach(c =>
  c.className === 'box' ? (boxes += 1) : (boxes += 0)
);
const timeline = [];
box.parentNode.childNodes.forEach((node, i) => {
  if (node.className !== 'box') return;
  count++;
  node.style.height = (100 / boxes) * 0.75 + '%';
  document.documentElement.style.setProperty(
    '--size',
    node.offsetHeight + 'px'
  );
  // variable += 0.75;
  timeline.push({
    time: (count / boxes - 1 / boxes) / variable,
    duration: (duration / boxes) * 15,
    easing: null,
    run: function (value, eased) {
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
  // console.log(easedProgress);
  document.querySelector('h2').textContent =
    Math.round(easedProgress * 100) + '%';
}
animation.timeline(timeline, theRealCallback, true).run();

/* const keyframes = new Keyframes(
  [
    new Keyframes.keyframe(0, 0),
    new Keyframes.keyframe(0.5, 100),
    ,
    new Keyframes.keyframe(1, 0),
  ],
  'linear'
);

const delay = 500;
let boxes = 1;
const box = document.querySelector('.container .box');
const stats = document.querySelector('p');
box.parentNode.childNodes.forEach((node, i) => {
  if (node.className !== 'box') return;
  node.style.height = (100 / boxes) * 0.75 + '%';
  document.documentElement.style.setProperty(
    '--size',
    node.offsetHeight + 'px'
  );
});
const bezierValues = [0.91, 0.52, 0, 1.02];

let animation = new AlgoFrame(1500, delay, 'easeInQuad', keyframes);
document.querySelector('h2').textContent =
  '(' + bezierValues.join(', ') + ')' + ' + ' + delay + 'ms';

animation.FPS = 60;
animation.loop = true;

animation
  .run((value, easedProgress, statistics) => {
    if (typeof statistics.lastFrame === 'number') {
      stats.textContent = `${statistics.lastFrame.toFixed(2)}
        ms | ${(1000 / statistics.lastFrame).toFixed(1)} FPS`;
    } else {
      stats.textContent = statistics.lastFrame;
    }

    box.classList.add('run');
    box.style.left = `calc(${value}% - ${box.offsetWidth * (value / 100)}px)`;
    box.textContent = value.toFixed(1) + '%';
  })
  .finally(_ => box.classList.remove('run')); */
