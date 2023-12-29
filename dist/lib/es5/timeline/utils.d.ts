import { KeyChanger, Sequence } from '.';
export type safePad = {
    mode: 'pad';
    value: number;
};
export type safeShift = {
    mode: 'shift';
};
export declare function timeIntervals(blocks: _keyframe[]): {
    max: number;
    min: number;
};
export declare function replicate(obj: object): object;
export declare function ratioAndMilisecons(ratio: number, miliseconds: number, duration: number): number;
export interface IBaseKeyframe {
    time(duration: number): number;
}
export interface IObjectKeyframe extends IBaseKeyframe {
    [x: string]: any;
    obj: KeyChanger<any>;
}
export interface ISimpleKeyframe extends IBaseKeyframe {
    [x: string]: any;
    value: number;
}
export declare class _keyframe implements IBaseKeyframe {
    timing: number;
    type: 'ratio' | 'miliseconds';
    delay: number;
    hold: boolean;
    start: number;
    static instances: number;
    readonly id: number;
    duration: number;
    triggered: boolean;
    constructor(timing: number, type?: 'ratio' | 'miliseconds', delay?: number, hold?: boolean, start?: number);
    time(duration?: number): number;
}
export declare class valueKeyframe extends _keyframe implements ISimpleKeyframe {
    value: number;
    constructor(value: number, timing: number, type?: 'ratio' | 'miliseconds', delay?: number, hold?: boolean);
}
export declare class nestedKeyframe extends _keyframe implements IObjectKeyframe {
    obj: Sequence;
    constructor(obj: Sequence, timing: number, type?: 'ratio' | 'miliseconds', delay?: number);
}
export type normalKeyframes = valueKeyframe | nestedKeyframe;
export declare function isSimple(object: any): object is ISimpleKeyframe;
export declare function isComplex(object: any): object is IObjectKeyframe;
export type __objectKeyframe = {
    obj: Sequence;
    timing: number;
    type: 'ratio' | 'miliseconds';
    delay?: number;
    duration?: number;
};
export type __valueKeyframe = {
    value: number;
    timing: number;
    type: 'ratio' | 'miliseconds';
    delay?: number;
    duration?: number;
};
