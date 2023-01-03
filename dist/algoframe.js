!function(t,i){"object"==typeof exports&&"object"==typeof module?module.exports=i():"function"==typeof define&&define.amd?define([],i):"object"==typeof exports?exports.AlgoFrame=i():t.AlgoFrame=i()}(self,(()=>(()=>{"use strict";var t={d:(i,e)=>{for(var s in e)t.o(e,s)&&!t.o(i,s)&&Object.defineProperty(i,s,{enumerable:!0,get:e[s]})},o:(t,i)=>Object.prototype.hasOwnProperty.call(t,i),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},i={};t.r(i),t.d(i,{default:()=>a});const e={linear:t=>t,easeInQuad:t=>t*t,easeOutQuad:t=>t*(2-t),easeInOutQuad:t=>t<.5?2*t*t:(4-2*t)*t-1,easeInCubic:t=>t*t*t,easeOutCubic:t=>--t*t*t+1,easeInOutCubic:t=>t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1,easeInQuart:t=>t*t*t*t,easeOutQuart:t=>1- --t*t*t*t,easeInOutQuart:t=>t<.5?8*t*t*t*t:1-8*--t*t*t*t,easeInQuint:t=>t*t*t*t*t,easeOutQuint:t=>1+--t*t*t*t*t,easeInOutQuint:t=>t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t};class s{constructor(t,i,s,a,r,n=null,h=!1){this.easing="function"!=typeof s?e[s]:s,this.starttime=i,this.duration=t,this.startafterwait=null,this.startanimationtime=null,this.stop=!1,this.startX=a,this.endX=r,this.next=void 0,this._FPS=n,this.frameDelay=1e3/this._FPS,this.frameRate=0,this.frame=-1,this.animationFrame=-1,this.loop=h}get FPS(){return this._FPS?1e3/this._FPS:null}set FPS(t){const i=parseFloat(t);if(!i)throw new Error("Not a valid Number");this._FPS=i,this.frameDelay=1e3/i}restart(t){return this.frame=-1,this.starttime=null,this.run(t)}timeline(t,i){this._timeline=[];const e=()=>{this._timeline.length&&(this._next=this._timeline.reduce(((t,i)=>i<t?i:t)))};return t.forEach((t=>{this._timeline.push({_:new s(t.duration,0,t.easing?t.easing:this.easing,t.startX?t.startX:this.startX,t.endX?t.endX:this.endX).finally(t.finally),time:t.time,callback:t.run})})),e(),this.callback=function(t,s,...a){i(t,s,...a),s>=this._next.time&&(this._next._.run(this._next.callback),this._timeline.shift(),e())},this}run(t,i=this._FPS){let e,s,a;this.callback=t||this.callback;class r{constructor(t=1){this.history=new Array(t).fill(0),this.last=0,this.currenttime=0}refresh(t){this.history.unshift(0),this.history.pop(),this.history[0]=t-this.currenttime,this.last=this.history.includes(0)?"Calculating...":this.history.reduce(((t,i)=>t+i))/this.history.length,this.currenttime=t}}const n=new r;isNaN(i)&&(console.log(new Error(`${i} is NaN`)),i=this._FPS);const h=new r(i);return this.loop&&(this.next=this.restart.bind(this,t)),requestAnimationFrame(function t(i){this._FPS?(a=Math.floor((i-this.starttime)/this.frameDelay),s=Boolean(a>this.frame)):s=!0,n.refresh(i);const r=i-this.startanimationtime,o=r/this.duration,l=this.easing(o);if(this.startanimationtime||0!==this.starttime){if(this.starttime>0)return this.startanimationtime=i,this.starttime=this.starttime-n.last<.7*n.last?0:this.starttime-n.last,void requestAnimationFrame(t.bind(this))}else this.starttimeBefore=i,this.startanimationtime=i;s&&(this.frame=a,this.animationFrame++,h.refresh(i),e=(this.endX-this.startX)*Math.min(l,1),this.callback(e+this.startX,l,{lastFrame:h.last,currentTime:h.currentTime,frame:this.animationFrame})),this.stop||(r<this.duration?requestAnimationFrame(t.bind(this)):r-.7*n.last<this.duration?(this.animationFrame++,this.callback(this.endX,1,{lastFrame:h.last,currentTime:h.currenttime,frame:this.animationFrame}),this.next?.()):this.next?.())}.bind(this)),this}finally(t){return this.next=t,this}break(){this.stop=!0}}const a=s;return i})()));