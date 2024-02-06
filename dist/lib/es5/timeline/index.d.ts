import { Preset } from '../utils';
import { _keyframe, IObjectKeyframe, nestedKeyframe, valueKeyframe, __valueKeyframe, ISimpleKeyframe, IBaseKeyframe, safePad, safeShift, normalKeyframes } from './utils';
export * from './utils';
export declare abstract class KeyChanger<Keyframe extends _keyframe> {
    keyframes: Keyframe[];
    duration: number;
    run: Keyframe[];
    next: Keyframe | null;
    current: Keyframe | null;
    adaptative: boolean;
    easing: (t: number) => number;
    object: symbol;
    changer: () => any;
    constructor(duration: number | false, easing: Preset | undefined, keyframes: Keyframe[]);
    protected abstract callFinally(ts?: number): void;
    nextTime(): void;
    abstract reset(): void;
    restart(): void;
    protected abstract init(keyframes: Keyframe[]): void;
    static rProgressValue(object: IBaseKeyframe, progress: number, end: number): number;
    static rProgress(object: IObjectKeyframe, progress: number, end: number): number;
    protected currentAsSequence(object: IObjectKeyframe, progress: number, end: number): number | undefined;
    static lerp(x: number, y: number, a: number): number;
    test(progress: number, miliseconds?: boolean, runAdaptative?: boolean, nextValue?: ISimpleKeyframe): number | undefined;
    isLastKeyframe(time: number): boolean;
    getKeyframeForTime(time: number, miliseconds?: boolean): {
        keyframe: Keyframe | null;
        end: boolean;
    };
    static getAbsoluteStartValue(sequence: KeyChanger<normalKeyframes>): number;
    static getAbsoluteEndKeyframe(sequence: KeyChanger<normalKeyframes>): valueKeyframe;
}
export declare class Sequence extends KeyChanger<normalKeyframes> {
    keyframes: (valueKeyframe | nestedKeyframe)[];
    Ocallback: Function | null;
    ofinallyCallback: Function | null;
    type: 'nested' | 'simple';
    taken: number[];
    callback: Function | null;
    finallyTriggered: boolean;
    constructor(duration: number | false, keyframes: (valueKeyframe | nestedKeyframe)[], easing?: Preset, Ocallback?: Function | null, ofinallyCallback?: Function | null);
    protected callFinally(ts?: number | undefined): void;
    protected init(keyframes: typeof this.keyframes): void;
    static passKeyframe(k: any | nestedKeyframe | valueKeyframe): valueKeyframe | nestedKeyframe;
    static is_value(object: any): object is __valueKeyframe;
    addKeyframes(
    /**
     * Adds a new keyframe to the entire set,
     *
     * @remarks
     * To apply new keyframes, must do .reset() before
     *
     * @param keyframe - A valid AlgoFrame's keyframe object
     */
    method?: 'push' | 'unshift', ...keyframes: normalKeyframes[]): Sequence;
    extendToSequence(seq: Sequence, safe?: safePad | safeShift): this;
    reset(): void;
    clone(): Sequence;
    reverseKeyframes(keyframes?: normalKeyframes[]): normalKeyframes[];
    extendToReverse(safe: safePad | safeShift): this;
}
