"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const AF = __importStar(require("./algoframe")); // * AlgoFrame 4.4.4
const global = {
    delay: 300,
};
const timeline_1 = require("./modules/timeline");
const basic = new timeline_1.Sequence(false, [
    new timeline_1.valueKeyframe(2222, 0, 'ratio'),
    new timeline_1.valueKeyframe(4444, 0.5, 'ratio'),
    new timeline_1.valueKeyframe(6666, 1, 'ratio'),
]);
const first = new timeline_1.Sequence(false, [
    new timeline_1.nestedKeyframe(basic.clone(), 0, 'ratio'),
    new timeline_1.nestedKeyframe(basic.clone(), 0.5, 'ratio'),
    new timeline_1.nestedKeyframe(basic.clone(), 1, 'ratio'),
]);
const second = new timeline_1.Sequence(1000, [
    new timeline_1.nestedKeyframe(first.clone(), 0, 'ratio'),
    new timeline_1.nestedKeyframe(first.clone(), 0.5, 'ratio'),
    new timeline_1.nestedKeyframe(first.clone(), 1, 'ratio'),
]);
function animate() {
    let number = 0;
    return function startAnimation(sequence) {
        number++;
        const animation = new AF.AlgoFrame(sequence.duration, global.delay, 'linear', second);
        animation.run((b, a, c) => console.log(b, (a * 100).toFixed(0), c.timestamp - global.delay), 'Animation ' + number);
    };
}
const start = animate();
// console.log(new ChannelBlock(second, 100).end());
console.log(second.duration);
const custom = 3 || 12;
for (let i = 0; i < custom; i++) {
    second.addKeyframe(new timeline_1.valueKeyframe(4444, second.duration + 1, 'miliseconds', 200));
}
second.restart();
console.log(second);
start(second);
//# sourceMappingURL=test.js.map