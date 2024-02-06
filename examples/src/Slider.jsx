import { useState } from 'react';
import {styled} from "styled-components"
const Div = styled.div`
    display: flex;
    align-items: center;
`;
const Button = styled.button`
    padding: 5px 15px;
    margin: 10px 20px;
    cursor: pointer;
    outline: none;
    border: none;
`;

function Slider({ value, setValue, max, min }) {
  return (
    <Div>
      <Button>-</Button>
      <input
        type="range"
        min={min || 0}
        max={max || 0}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button>+</Button>
    </Div>
  );
}
export default Slider;
