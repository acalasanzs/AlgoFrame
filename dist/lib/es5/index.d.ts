import { Sequence } from './timeline';
import { Framer, Controller, Animator, animationCallback, Preset } from './utils';
export declare const sensibility: number;
type timeReferences = {
    duration?: number;
    delay?: number;
};
type controls = {
    FPS?: number;
    loop?: boolean;
};
type options = {
    sequence: Sequence;
    easing?: Preset;
    controls?: controls;
    timing?: timeReferences;
};
export { Sequence };
export declare class Animate {
    frame: Framer;
    control: Controller;
    progress: number;
    engine: Animator;
    constructor(options: options);
    finally(callback: () => void): this;
    break(): this;
    precision(value: number): this;
    run(callback?: animationCallback): this;
}
