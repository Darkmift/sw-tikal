import React, { useEffect } from 'react';
import './Chart.css';

const Chart = React.forwardRef(({ children, width, height,emitChartRef }, ref) => {
  useEffect(() => {
    emitChartRef(ref);
  }, [ref]);
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="70%"
      preserveAspectRatio="xMidYMax meet"
    >
      {children}
    </svg>
  );
});

export default Chart;
