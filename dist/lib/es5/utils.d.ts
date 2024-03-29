import { Sequence } from './timeline';
export declare class EasingFunctions {
    static linear: (t: number) => number;
    static easeInQuad: (t: number) => number;
    static easeOutQuad: (t: number) => number;
    static easeInOutQuad: (t: number) => number;
    static easeInCubic: (t: number) => number;
    static easeOutCubic: (t: number) => number;
    static easeInOutCubic: (t: number) => number;
    static easeInQuart: (t: number) => number;
    static easeOutQuart: (t: number) => number;
    static easeInOutQuart: (t: number) => number;
    static easeInQuint: (t: number) => number;
    static easeOutQuint: (t: number) => number;
    static easeInOutQuint: (t: number) => number;
}
export type Preset = string | ((x: number) => number);
export declare function passPreset(preset: Preset): (t: number) => number;
export type callbackType = {
    value: number;
    FPS: number | null;
    progress: number;
    currentTime: number;
    frame: number;
    duration: number;
    startTime: number;
    frameRate: number | 'Calculating...';
    timeDelayed: number;
};
export type animationCallback = (frame: callbackType) => void;
export declare class Framer {
    _FPS: number | null;
    _delay: number;
    count: number;
    frame: number;
    _precision: number;
    last: {
        time: Refresher;
        frameRate: Refresher;
    };
    value: number;
    sequence: Sequence;
    start: Initiator;
    duration: number;
    progress: number;
    constructor();
    set precision(value: number);
    get precision(): number;
    set FPS(value: number | null);
    get FPS(): number | null;
    get delay(): number;
    stats(): {
        value: number;
        FPS: number | null;
        progress: number;
        currentTime: number;
        frame: number;
        duration: number;
        startTime: number;
        timeDelayed: number;
        frameRate: number | "Calculating...";
    };
}
export type FrameStats = {
    value: number;
    FPS: number | null;
    progress: number;
    currentTime: number;
    frame: number;
    duration: number;
    startTime: number;
    timeDelayed: number;
    frameRate: number;
};
export declare class Initiator {
    time: number;
    afterWait: number | null;
    animationTime: number | null;
}
export declare class Controller {
    stop: boolean;
    _start: (value?: () => void | PromiseLike<() => void>) => void;
    __start: Promise<unknown>;
    _completed: boolean;
    get completed(): boolean;
    set completed(value: boolean);
    finally: () => void;
    loop: boolean;
    callback: animationCallback;
    sent: boolean;
}
export declare class Refresher {
    history: number[];
    last: number | 'Calculating...';
    currenttime: number;
    constructor(precision?: number);
    refresh(timestamp: number): void;
}
export type EngineTypes = {
    send: () => void;
    runtime: number;
    relativeProgress: number;
    easedProgress: number;
    timestamp: number;
    seg: number;
    requestAnimation: Function;
};
export declare class Animator {
    origin: any;
    easing: (x: number) => number;
    constructor(origin: any);
    engine(parameters: EngineTypes): void;
}
