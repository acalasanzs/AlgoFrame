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
const AF = __importStar(require("algoframe"));
const AFT = __importStar(require("./modules/Timeline"));
// Animation engine
const delay = 500;
debugger;
const unitLinearAnimation = new AF.Keyframes([new AF.Keyframes.keyframe(0, 0), new AF.Keyframes.keyframe(1, 1)], 'linear');
const animation = new AF.AlgoFrame(1000, delay, 'linear', unitLinearAnimation);
// Keyframes
// Needs to allow ratios and miliseconds values on duration
const keyframes = new AFT.Sequence(500, [
    new AFT.valueKeyframe(0, 0),
    new AFT.valueKeyframe(100, 450, 'miliseconds'),
]);
animation.run((x) => console.log(keyframes.test(x)));
//# sourceMappingURL=index.js.map