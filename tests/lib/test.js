var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", ".", "./modules/timeline"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _1 = require(".");
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
            const animation = new _1.Animate({
                sequence,
                easing: 'linear',
                timing: {
                    delay: global.delay,
                },
            });
            animation.run((_a) => {
                var { value } = _a, other = __rest(_a, ["value"]);
                console.log('Animation ' + number);
                console.log(value, [...Object.values(other)]);
            });
        };
    }
    const start = animate();
    // console.log(new ChannelBlock(second, 100).end());
    console.log(second, second.duration, 'duration');
    const custom = 3 || 12;
    let time = 2;
    const getNewK = ({ duration }) => {
        time++;
        return new timeline_1.valueKeyframe(2222 * (((time % 3) / 3) * 3 + 1), duration + 1, 'miliseconds', 200);
    };
    for (let i = 0; i < custom; i++) {
        second.addKeyframes('push', getNewK(second));
    }
    // second.reset();
    console.log(second.duration, 'duration', second.keyframes.map(k => [k.time(1), k.duration]));
    console.log(second
        .addKeyframes('push', getNewK({ duration: second.duration + 200 }))
        .keyframes.map(k => [k.time(1), k.duration]));
    console.error('FROM HERE');
    // keyframes deep clone DONE
    const display = (seq) => seq.keyframes.map(k => [k.time(k.duration), k.duration, k.value]);
    // second.extendToSequence(second.clone(), { mode: 'shift' });
    console.log(display(second));
    // second.restart();
    start(second);
});
/* let val = 0;
while (++val < 1000) {
  console.log(second.test(val / 1000));
} */
//# sourceMappingURL=test.js.map