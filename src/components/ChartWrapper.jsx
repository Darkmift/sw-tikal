import { useState, useEffect, useRef } from 'react';
import { Chart, Bar } from './Chart';

function fractionPercent(canvasActualHeight, val, maxValue) {
  const popPercent = (val / maxValue) * 100;
  const canvasPercent = canvasActualHeight / 100;
  return popPercent * canvasPercent;
}

const ChartWrapper = ({ chartData, labaelName, amountKey }) => {
  const [maxValue, setMaxValue] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);
  const chartRef = useRef(null);

  const calculateMaxValue = (dataArr, amountKey) => {
    return [...dataArr].sort((a, b) => b[amountKey] - a[amountKey])[0][amountKey];
  };

  useEffect(() => {
    if (chartData?.length) setMaxValue(calculateMaxValue(chartData, amountKey));
  }, [chartData]);

  const onChartRefEmit = (ref) => {
    setChartWidth(ref.current.clientWidth);
  };

  const maxPopulation = maxValue;
  const chartHeight = chartWidth * 0.75;
  const numberofBars = chartData.length;
  let width = chartWidth;
  const barWidth = chartWidth / numberofBars;
  const barMargin = barWidth / 10;

  return (
    <>
      <Chart height={chartHeight} width={width} ref={chartRef} emitChartRef={onChartRefEmit}>
        {chartData?.length &&
          chartData.map((data, index) => {
            const barHeight = fractionPercent(chartHeight - 30, data[amountKey], maxPopulation);
            return (
              <Bar
                key={data.name}
                x={index * (barWidth + barMargin)}
                y={chartHeight - barHeight}
                width={barWidth}
                height={barHeight - 30}
                labaelName={data[labaelName]}
                amount={data[amountKey]}
              />
            );
          })}
      </Chart>
    </>
  );
};

export default ChartWrapper;
