const delay = 500;

const box = document.querySelector('.container .box');
const stats = document.querySelector('p');

let animation = new AlgoFrame(1500, delay, 'easeInQuad', 0, 100);
document.querySelector('h2').textContent = 'easeInQuad';
animation.FPS = 12;

const timeline = [];
box.parentNode.childNodes.forEach((node, i) => {
  if (node.className !== 'box') return;
  const duration = 500;

  timeline.push({
    time: (i + 1) / (box.parentNode.childNodes.length + 1),
    duration,
    easing: null,
    startX: null,
    endX: null,
    run: function (value) {
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
function theRealCallback(value) {
  console.log(value);
}
animation.timeline(timeline, theRealCallback).run();
