import { Sequence } from './timeline';
import { Framer, Controller, Animator, animationCallback, Preset } from './utils';
type timeReferences = {
    duration?: number;
    delay: number;
};
type controls = {
    FPS?: number;
    loop?: boolean;
};
type options = {
    sequence: Sequence;
    easing?: Preset;
    controls?: controls;
    timing: timeReferences;
};
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
export {};
