!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.AlgoFrame=e():t.AlgoFrame=e()}(self,(()=>(()=>{var t={503:function(t,e,i){var r,n,s,a=this&&this.__rest||function(t,e){var i={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(i[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(r=Object.getOwnPropertySymbols(t);n<r.length;n++)e.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(t,r[n])&&(i[r[n]]=t[r[n]])}return i};!function(a){if("object"==typeof t.exports){var o=a(i(387),e);void 0!==o&&(t.exports=o)}else n=[i,e,i(877),i(101)],void 0===(s="function"==typeof(r=a)?r.apply(e,n):r)||(t.exports=s)}((function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const i=t("./es6"),r=t("./es6/timeline"),n=new r.Sequence(!1,[new r.valueKeyframe(2222,0,"ratio"),new r.valueKeyframe(4444,.5,"ratio"),new r.valueKeyframe(6666,1,"ratio")]),s=new r.Sequence(!1,[new r.nestedKeyframe(n.clone(),0,"ratio"),new r.nestedKeyframe(n.clone(),.5,"ratio"),new r.nestedKeyframe(n.clone(),1,"ratio")]),o=new r.Sequence(1e3,[new r.nestedKeyframe(s.clone(),0,"ratio"),new r.nestedKeyframe(s.clone(),.5,"ratio"),new r.nestedKeyframe(s.clone(),1,"ratio")]),u=function(){let t=0;return function(e){t++,new i.Animate({sequence:e,easing:"linear",timing:{delay:300}}).run((e=>{var{value:i}=e,r=a(e,["value"]);console.log("Animation "+t),console.log(i,[...Object.values(r)])}))}}();console.log(o,o.duration,"duration");let h=2;const l=({duration:t})=>(h++,new r.valueKeyframe(2222*(h%3/3*3+1),t+1,"miliseconds",200));for(let t=0;t<3;t++)o.addKeyframes("push",l(o));console.log(o.duration,"duration",o.keyframes.map((t=>[t.time(1),t.duration]))),console.log(o.addKeyframes("push",l({duration:o.duration+200})).keyframes.map((t=>[t.time(1),t.duration]))),console.error("FROM HERE"),console.log(o.keyframes.map((t=>[t.time(t.duration),t.duration,t]))),u(o)}))},877:(t,e,i)=>{"use strict";i.r(e),i.d(e,{Animate:()=>n});var r=i(344);class n{constructor(t){this.frame=new r.DM,this.control=new r.Qr,this.progress=0,this.engine=new r.LH(this);const{sequence:e,easing:i,controls:n,timing:s}=t;this.engine.easing=(0,r.dq)(i||"linear"),this.frame.sequence=e,(null==n?void 0:n.FPS)&&(this.frame.FPS=n.FPS),(null==n?void 0:n.loop)&&(this.control.loop=n.loop),this.frame.start.time=s.delay,this.frame.duration=s.duration||e.duration}finally(t){return this.control.finally=t,this}break(){return this.control.stop=!1,this}precision(t){return this.frame.precision=t,this}run(t){let e,i;if(t&&(this.control.callback=t),!this.control.callback)throw new Error("Main callback is required for the animation");function n(t){this.control.completed&&(this.frame.frame=-1,this.frame.start.animationTime=t,this.control.completed=!this.control.completed),this.frame._FPS?(i=Math.floor((t-this.frame.start.time)/this.frame.delay),e=Boolean(i>this.frame.count)):e=!0,this.frame.last.time.refresh(t)}return this.frame.last.time=new r.q1,this.frame.last.frameRate=this.frame.last.frameRate?this.frame.last.frameRate:new r.q1(this.frame.precision),requestAnimationFrame(function t(r){let s,a,o;if(n.call(this,r),this.frame.start.animationTime)s=r-this.frame.start.animationTime,a=s/this.frame.duration,o=this.engine.easing(a),this.progress=o,this.engine.engine({relativeProgress:a,easedProgress:o,runtime:s,timestamp:r,seg:i,condition:e,requestAnimation:t});else if(this.frame.start.time>0){this.frame.start.animationTime=r;let e=0;return"number"==typeof this.frame.last.time.last&&(e=this.frame.last.time.last),this.frame.start.time=this.frame.start.time-e<.7*e?0:this.frame.start.time-e,void requestAnimationFrame(t.bind(this))}}.bind(this)),this}}},101:(t,e,i)=>{"use strict";i.r(e),i.d(e,{KeyChanger:()=>m,Sequence:()=>f,_keyframe:()=>o,isComplex:()=>c,isSimple:()=>l,nestedKeyframe:()=>h,ratioAndMilisecons:()=>a,replicate:()=>s,timeIntervals:()=>n,valueKeyframe:()=>u});var r=i(344);function n(t){let e=1,i=0;return t.map(((r,n)=>{let s=0;function a(t){return t.start?t.start:0+t.time()}const o=a(r);if(n<t.length-1&&(s=a(t[n+1])-o-1,s<r.delay))throw new Error("Sequences/_keyframe(s) overlapping on the same channel!");const u=r.start?r.start:0+o+s;return e=e<u?u:e,i=i>o?o:i,[o,u]})),{max:e,min:i}}function s(t){return Object.assign(Object.create(Object.getPrototypeOf(t)),t)}function a(t,e,i){return t*i+e}class o{constructor(t,e="ratio",i=0,r=!1,n=0){if(this.timing=t,this.type=e,this.delay=i,this.hold=r,this.start=n,n<0)throw new RangeError("Negative start times are not implemented yet");this.id=o.instances++,"miliseconds"===this.type&&(this.duration=0)}time(t=this.duration){let e=this.timing;if(this.delay){if("number"!=typeof this.duration)throw new Error("Keyframe with delay has to have duration setted");e="ratio"===this.type?a(e,this.delay,this.duration):e+this.delay}if("number"!=typeof this.duration)throw new Error("Need to set this.duration to each keyframe in the keyframes manager");return"miliseconds"===this.type?e/(0===this.duration?1:this.duration/t):t*e}}o.instances=0;class u extends o{constructor(t,e,i="miliseconds",r,n=!1){super(e,i,r,n),this.value=t}}class h extends o{constructor(t,e,i="miliseconds",r){super(e,i,r),this.obj=t}}function l(t){return"value"in t&&t instanceof o}function c(t){return"obj"in t&&t instanceof o}class m{constructor(t,e="linear",i){this.keyframes=i,this.next=null,this.current=null,this.adaptative=!1,this.object=Symbol(),this.duration="number"==typeof t?Math.floor(t):(t=>(this.adaptative=!0,1))(),this.run=[],this.easing=(0,r.dq)(e),this.init(i)}nextTime(){var t;this.run.length?(this.run.length>1?(this.current=this.run.reduce(((t,e)=>e.time(this.duration)<t.time(this.duration)?e:t)),this.next=this.run.filter((t=>t.time(this.duration)!==this.current.time(this.duration))).reduce(((t,e)=>e.time(this.duration)<t.time(this.duration)?e:t))||this.current):this.restart(),null===(t=this.changer)||void 0===t||t.call(this),this.run.shift()):this.next=null}restart(){for(;this.run.length;)this.run.pop();this.reset()}currentAsSequence(t,e,i){const r=(e-t.time(1))/(i-t.time(1));let n;if(r<=1)return n=t.obj.test(r,void 0,!0),n}static lerp(t,e,i){return t*(1-i)+e*i}test(t,e=!1,i=!1,r){t=t<=1?t:1;let n=r||this.next;if(this.adaptative&&!i)throw new Error("Adaptitive timed sequences cannot be played in first place");if(e&&!i)t*=this.duration;else if(e)throw new Error("miliseconds mode not allowe when adaptative");if(n&&this.current){for(;n.time(1)<=t&&1!==n.time(1);)this.nextTime(),n=this.next;if(l(n)&&l(this.current)){t=Math.min(this.easing(t),e?this.duration:1);const i=n.time(1)-this.current.time(1),r=t<t-i?t/i:(t-this.current.time(1))/i;return m.lerp(this.current.value,n.value,n.hold?0:r)}if(c(n)&&l(this.current)){const e=new u(this.getAbsoluteStartValue(n.obj),n.time(1),"ratio");return e.duration=this.duration,this.test(t,void 0,void 0,e)}if(c(this.current)&&c(n))return this.currentAsSequence(this.current,t,this.next?this.next.time(1):1);if(c(this.current)&&(l(n)||!n))return this.currentAsSequence(this.current,t,n?n.time(1):1)}}getAbsoluteStartValue(t){let e=t.current;for(;e instanceof h;)e=t.current;return e.value}getAbsoluteEndKeyframe(t){let e=t.run[t.run.length-1];for(;e instanceof h;)e=t.run[t.run.length-1];return e}}class f extends m{constructor(t,e,i="linear",r=null){super(t,i,e),this.keyframes=e,this.callback=r,this.type="simple",this.taken=[]}init(t){this.type="simple",t.forEach((t=>{"ratio"==t.type&&(t.timing=t.timing*this.duration,t.type="miliseconds")})),this.taken=[];const e=t[0],i=t[t.length-1];if(e.duration=this.duration,i.duration=this.duration,e.time(1)>0){const t=e instanceof u?new u(e.value,0):new h(e.obj,0);t.duration=this.duration,this.keyframes.unshift(t),this.run.push(t)}if(i.time(1)<1){if(i instanceof h)throw new Error("Cannot set last keyframe as nested sequence, it's impossible");const t=new u(i.value,1,"ratio");t.duration=this.duration,this.keyframes.push(t),this.run.push(t)}if(this.keyframes.forEach(((t,e)=>{t.duration=this.duration;const i=t.time(this.duration);if(i>this.duration)throw new Error("Keyframe timing overflow");if(this.taken.includes(i))throw new Error("It must not have repeated times");this.taken.push(t.time(1)),t instanceof h&&(this.type="nested"),this.run.push(t)})),!this.type)throw new Error("No events/keyframes provided");this.keyframes[0];try{this.nextTime()}catch(t){throw new Error("Identical time signatures on keyframes are not allowed on a single animation channel")}}static passKeyframe(t){return t instanceof h||t instanceof u?t:this.is_value(t)?new u(t.value,t.timing,t.type):new h(t.obj,t.timing,t.type)}static is_value(t){return"val"in t}addKeyframes(t="push",...e){e.forEach((e=>{const i=f.passKeyframe(e);this.keyframes[t](i)}));const{max:i}=n(this.keyframes);return this.keyframes.forEach((t=>{"ratio"==t.type&&(t.timing=t.timing*i,t.type="miliseconds")})),this.duration=i,this.init(this.keyframes),this}extendToSequence(t,e){if(t.object===this.object)throw new Error("Cannot reextend to my own self");let i=2*e.value;return i=i||0,i&&(t.duration+=1),t.keyframes.forEach(((r,n)=>{const s=n<t.keyframes.length-1?1:0,a=i?s:0;r.timing=r.timing+(r.duration+this.duration+a*i)*(r.duration/(this.duration+r.duration)),r.duration+=this.duration,!s&&e&&(r.timing+=1)})),e&&!i&&this.keyframes.pop(),this.keyframes.forEach((t=>{t.duration+=this.duration})),this.keyframes.forEach((t=>{console.log(t.duration)})),this.addKeyframes("push",...t.keyframes),this}reset(){this.keyframes.forEach((t=>this.run.push(t)))}clone(){const t=this.keyframes.map((t=>{if(c(t)){const e=s(t);return e.obj=e.obj.clone(),e}return s(t)}));return new f(this.duration,t,this.easing,this.callback)}}},344:(t,e,i)=>{"use strict";i.d(e,{DM:()=>s,LH:()=>h,Qr:()=>o,dq:()=>n,q1:()=>u});class r{}function n(t){return"function"!=typeof t?r[t]:t}r.linear=t=>t,r.easeInQuad=t=>t*t,r.easeOutQuad=t=>t*(2-t),r.easeInOutQuad=t=>t<.5?2*t*t:(4-2*t)*t-1,r.easeInCubic=t=>t*t*t,r.easeOutCubic=t=>--t*t*t+1,r.easeInOutCubic=t=>t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1,r.easeInQuart=t=>t*t*t*t,r.easeOutQuart=t=>1- --t*t*t*t,r.easeInOutQuart=t=>t<.5?8*t*t*t*t:1-8*--t*t*t*t,r.easeInQuint=t=>t*t*t*t*t,r.easeOutQuint=t=>1+--t*t*t*t*t,r.easeInOutQuint=t=>t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t;class s{constructor(){this._FPS=null,this.rate=0,this.count=-1,this.frame=-1,this._precision=30,this.start=new a}set precision(t){t=Math.abs(t),this._precision=t}get precision(){return this._precision||this._FPS}set FPS(t){try{t=Math.abs(t),this._FPS=t}catch(t){}}get FPS(){return this._FPS?1e3/this._FPS:null}get delay(){if(!this._FPS)throw new Error("Not initialized");return 1e3/this._FPS}}class a{constructor(){this.time=0,this.afterWait=null,this.animationTime=null}}class o{constructor(){this.stop=!1,this.__start=new Promise((t=>this._start=t)),this.loop=!1}get completed(){return this._completed||!this.stop}set completed(t){this._completed=t}}class u{constructor(t=1){this.history=new Array(t).fill(0),this.last=0,this.currenttime=0}refresh(t){this.history.unshift(0),this.history.pop(),this.history[0]=t-this.currenttime,this.last=this.history.includes(0)?"Calculating...":this.history.reduce(((t,e)=>t+e))/this.history.length,this.currenttime=t}}class h{constructor(t){this.origin=t}engine(t){var e,i,r,n;let s=!1;function a(){s=!0,o.frame.value=o.frame.sequence.test(Math.min(t.easedProgress,1)),o.control.callback(o.frame)}let o=this.origin;t.condition&&(o.frame.count=t.seg,o.frame.start.animationTime="number"==typeof o.frame.start.animationTime?o.frame.start.animationTime+1:o.frame.start.animationTime,o.frame.last.frameRate.refresh(t.timestamp),a()),o.stop||(t.runtime<o.duration?requestAnimationFrame(t.requestAnimation.bind(o)):t.runtime+o.last.last>o.duration?(o.animationFrame++,a(),o.control.completed=!0,o.loop&&requestAnimationFrame(t.requestAnimation.bind(o)),null===(i=(e=o.control).finally)||void 0===i||i.call(e)):o.done||(o.control.completed=!0,o.loop&&requestAnimationFrame(t.requestAnimation.bind(o)),null===(n=(r=o.control).finally)||void 0===n||n.call(r))),0===o.animationFrame&&o.__start()}}},387:t=>{function e(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}e.keys=()=>[],e.resolve=e,e.id=387,t.exports=e}},e={};function i(r){var n=e[r];if(void 0!==n)return n.exports;var s=e[r]={exports:{}};return t[r].call(s.exports,s,s.exports,i),s.exports}return i.d=(t,e)=>{for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(503)})()));
//# sourceMappingURL=algoframe.js.map