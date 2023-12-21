import { valueKeyframe } from "@/timeline";
import "./style.css";
import { createBoxes } from "./utils";
import {Animate, Sequence} from "@";
// import {Animate} from "@";

const root = document.getElementById("app")!;
function trash({progress}) {
    // console.log(progress)
}
// const boxes = 5;

// const boxElements = createBoxes(root, boxes);
const theBox = createBoxes(root, 1);


const sequence: Sequence = new Sequence(800, [
    new valueKeyframe(0, 0, "ratio"),
    new valueKeyframe(100, 1, "ratio")
], undefined, trash);
function version5() {

    const animation = new Animate({
        sequence,
        easing: "linear",
        timing: {
            delay: 0
        }
    });
    animation.run(console.log);
    console.log(animation)
}
/* function version4() {
    const animation = new AlgoFrame(800,0,'linear',sequence);
    animation.run(console.log);
} */

version5()