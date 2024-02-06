import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
function Box({ many = 0 }) {
  const ref = useRef();
  function refresh() {
    console.log(many)
    document.documentElement.style.setProperty(
      '--size',
      parseInt(getComputedStyle(ref.current).height) *.75/(many > 0 ? many: 1) + 'px'
    );
  }
  useEffect(() => {
    window.addEventListener('resize', refresh);
    return () => {
      window.removeEventListener('resize', refresh);
    };
  }, []);
  useEffect(refresh, [many]);
  return (
    <div className="container" ref={ref}>
      {Array.from({ length: many }, (_, index) => (
        <div
          key={index}
          className="box"
          style={{ height: (100 / many) * 0.75 + '%' }}
        ></div>
      ))}
    </div>
  );
}
Box.propTypes = {
  many: PropTypes.number,
};
export default Box;
