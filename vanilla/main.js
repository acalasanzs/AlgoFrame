const delay = 500;

const box = document.querySelector('.container .box');
const stats = document.querySelector('p');

let animation = new AlgoFrame(1500, delay, 'easeInQuad', 0, 100);
document.querySelector('h2').textContent = 'easeInQuad';
animation.FPS = 12;

const timeline = [];
box.parentNode.childNodes.forEach((node, i) => {
  const duration = 500;

  timeline.push({
    time: (i + 1) / (box.parentNode.childNodes.length + 1),
    duration,
    easing: null,
    startX: null,
    endX: null,
    run(value) {
      node.classList.add('run');
      node.style.left = `calc(${value}% - ${
        node.offsetWidth * (value / 100)
      }px)`;
      node.textContent = value.toFixed(1) + '%';
    },
    finally: _ => node.classList.remove('run'),
  });
});
// console.log(timeline);
animation.timeline(timeline).run();
