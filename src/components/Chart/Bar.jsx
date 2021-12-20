import './Bar.css';

const Bar = ({ x, y, width, height, labaelName, amount }) => (
  <>
    <rect x={x} y={y} width={width} height={height} fill="black" />
    <text x={x} y={y - 10}>
      {`${labaelName}`}
    </text>
    <text x={x + 25} y="98%" fontWeight="bold" fill="#a02c2c">
      {`${amount.toLocaleString('en-US')}`}
    </text>
  </>
);

export default Bar;
