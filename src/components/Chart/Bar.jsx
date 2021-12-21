import './Bar.css';

const Bar = ({ x, y, width, height, labaelName, amount }) => {
  if (!y || !height) return <></>;

  amount = +amount;

  return (
    <>
      <rect x={x} y={y} width={width} height={height} fill="black" />
      <text x={x} y={y-5}>
        {`${labaelName}`}
      </text>
      <text x={x} y="98%" fontWeight="bold" fill="#a02c2c">
        {`${amount.toLocaleString('en-GB')}`}
      </text>
    </>
  );
};

export default Bar;
