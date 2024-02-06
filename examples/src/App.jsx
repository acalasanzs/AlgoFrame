import Box from './Box';
import Slider from './Slider';
import { Animate, Sequence } from '../../src';
import { valueKeyframe, nestedKeyframe } from '../../src/timeline';
import { useEffect, useState } from 'react';
function App() {
  useEffect(()=>{
    console.log(document.querySelectorAll('.box'));
    const from0to100 = new Sequence(800, [
      new valueKeyframe(0, 0, 'ratio'),
      new valueKeyframe(100, 1, 'ratio'),
    ]);
    const delayValue = 150;
    let delay = 0;
    const boxes = document.querySelectorAll(".box");
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
          if(value > 100) {
            debugger
          }
          box.style.transform = `translateX(${value}%)`;
        }
      );
      
      new Animate({
        sequence: timeline,
        
        controls: {
          loop: true
        }
      }).run()
    });
  //  const animation =  new Animate();
  })
  return (
    <>
      <div className="flex">
        <Box many={9} />
      </div>
    </>
  );
}

export default App;
