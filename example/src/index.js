import "./style.css";
import AlgoFrame from "algoframe";
import * as BezierEasing from "bezier-easing";

const delay = 500;

const box = document.querySelector(".container .box");
const stats = document.querySelector("p");

const bezierValues = [0.91, 0.52, 0, 1.02];

let animation = new AlgoFrame(
  1500,
  delay,
  BezierEasing(...bezierValues),
  0,
  100
);
document.querySelector("h2").textContent =
  "(" + bezierValues.join(", ") + ")" + " + " + delay + "ms";

animation.FPS = 12;

animation
  .run((value, easedProgress, statistics) => {
    if (typeof statistics.lastFrame === "number") {
      stats.textContent = `${statistics.lastFrame.toFixed(2)}
        ms | ${(1000 / statistics.lastFrame).toFixed(1)} FPS`;
    } else {
      stats.textContent = statistics.lastFrame;
    }

    box.classList.add("run");
    box.style.left = `calc(${value}% - ${box.offsetWidth * (value / 100)}px)`;
    box.textContent = value.toFixed(1) + "%";
  }, box)
  .finally((_) => box.classList.remove("run"));
