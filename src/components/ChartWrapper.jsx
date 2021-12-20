import { useState, useRef } from 'react';
import { Chart, Bar } from './Chart';

function fractionPercent(canvasActualHeight, val, maxValue) {
  const popPercent = (val / maxValue) * 100;
  const canvasPercent = canvasActualHeight / 100;
  return popPercent * canvasPercent;
}

const ChartWrapper = (data, labaelName, amountKey) => {
  amountKey = 'population';
  labaelName = 'name';

  const popData = [
    { name: 'Naboo', population: 800000 },
    { name: 'Aldoraan', population: 400000 },
    { name: 'Gamma', population: 600000 },
    { name: 'Beta', population: 200000 },
  ];
  const calculateMaxValue = (dataArr, amountKey) => {
    return [...dataArr].sort((a, b) => b[amountKey] - a[amountKey])[0][amountKey];
  };

  const [chartData, setChartData] = useState(popData);
  const [maxValue, setMaxValue] = useState(calculateMaxValue(chartData, amountKey));
  const [chartWidth, setChartWidth] = useState(0);
  const chartRef = useRef(null);

  const onChartRefEmit = (ref) => {
    console.log(
      '🚀 ~ file: ChartWrapper.jsx ~ line 28 ~ onChartRefEmit ~ ref',
      ref.current.clientWidth
    );
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
        {chartData.map((data, index) => {
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
