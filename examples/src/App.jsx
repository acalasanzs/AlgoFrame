import Box from './Box';
import Slider from './Slider';
import { Animate, Sequence } from 'algoframe';
import { valueKeyframe, nestedKeyframe } from 'algoframe/timeline';
import { useEffect, useState } from 'react';
function App() {
  useEffect(()=>{
    console.log(document.querySelectorAll('.box'));
    let delayValue = 80;
    let delay = 1500;
    const boxes = document.querySelectorAll(".box");
    let changer = 1;
    boxes.forEach((box,i) => {
      
      const timeline = new Sequence(
        800,
        [
          new valueKeyframe(0, 0, 'ratio'),
          new valueKeyframe(100, 0.5, 'ratio'),
          new valueKeyframe(0, 1, 'ratio'),
        ],
        'easeInOutQuad',
        ({ value }) => {
          box.style.marginLeft = `calc(${value}% - ${
            box.offsetWidth * (value / 100)
          }px)`;
          if(value > 50) {
            changer = -1;
          }else{
            changer = 1;
          }
          box.style.transform = `rotate(${value * 3.6/2}deg) scale(${1-value / 100/2*changer})`;
        }
      );
      
      new Animate({
        sequence: timeline,
        timing: {
          delay: delay,
        },
        controls: {
          loop: false,
          FPS: 60

        }
      }).run()
      delay += delayValue;
      delayValue += 10;
    });
  //  const animation =  new Animate();
  })
  return (
    <>
      <div className="flex">
        <Box many={15} />
      </div>
    </>
  );
}

export default App;
