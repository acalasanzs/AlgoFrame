import Box from './Box';
import Slider from './Slider';
import { Animate, Sequence } from 'algoframe';
import { valueKeyframe, nestedKeyframe } from 'algoframe/timeline';
import { useState } from 'react';
function App() {
  const [boxes, setBoxes] = useState(1);
  return (
    <>
      <div className="flex">
        <Slider value={boxes} setValue={(value) => setBoxes(parseInt(value))} min={1} max={15} />
        <Box many={boxes} />
        <Slider value={boxes} setValue={setBoxes} />
        <Box many={2} />
      </div>
    </>
  );
}

export default App;
