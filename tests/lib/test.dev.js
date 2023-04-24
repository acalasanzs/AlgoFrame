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
const timeline_1 = require("./modules/timeline");
// Animation engine
// Falta la transición entre nested y value;
const delay = 300;
// For reversed timelines, 1 pass to 0 and 0 pass to 1 cosntantly during the animation.
// Blocked keyframes like AE? DONE
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
const second = new timeline_1.Sequence(3 ** 3 * 1000, [
    new timeline_1.nestedKeyframe(first.clone(), 0, 'ratio'),
    new timeline_1.nestedKeyframe(first.clone(), 0.5, 'ratio'),
    new timeline_1.nestedKeyframe(first.clone(), 1, 'ratio'),
]);
// Invalid Keyframes Object AlgoFrame 4.4.4 if(!keyframes instanceof Keyframes) throw; not in 5.0.0
const animation = new AF.AlgoFrame(1000, delay, 'linear', second);
// Keyframes
// Needs to allow ratios and miliseconds values on duration
/* const keyframes = new AFT.Sequence(500, [
  new AFT.valueKeyframe(0, 0.2, 'ratio'),
  new AFT.valueKeyframe(1, 100, 'miliseconds'),
  
  => Uncaught Error: Invalid Keyframes Object!
]); */
// keyframes.addKeyframe(new AFT.valueKeyframe(0, 0, 'ratio'));
animation.run((x, y) => {
    // tslint:disable-next-line:no-debugger
    console.log(x, (y * 100).toFixed(1));
});
// animation.run((x: number) => console.log(keyframes.test(x)));
//# sourceMappingURL=test.dev.js.map