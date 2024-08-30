import React, { useEffect, useRef, useState } from 'react';

const CustomCandlestickChart = ({ data }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  const xScale = (index) => (index / (data.length - 1)) * width;
  const yScale = (price) => height - ((price - Math.min(...data.map(d => d.low))) / (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low)))) * height;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear().toString().substr(-2)}`;
  };

  return (
    <svg ref={svgRef} width="100%" height="400">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Y-axis */}
        <line x1={0} y1={0} x2={0} y2={height} stroke="#e0e0e0" />
        {[...Array(5)].map((_, i) => {
          const y = (i / 4) * height;
          return (
            <g key={i}>
              <line x1={0} y1={y} x2={width} y2={y} stroke="#e0e0e0" strokeDasharray="5,5" />
              <text x={-5} y={y} dy="0.32em" textAnchor="end" fontSize="12">
                {((1 - i / 4) * (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low))) + Math.min(...data.map(d => d.low))).toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Candlesticks */}
        {data.map((d, i) => {
          const x = xScale(i);
          const open = yScale(d.open);
          const close = yScale(d.close);
          const high = yScale(d.high);
          const low = yScale(d.low);

          return (
            <g key={i}>
              <line x1={x} y1={high} x2={x} y2={low} stroke={d.close > d.open ? "#4CAF50" : "#FF5252"} />
              <rect
                x={x - 4}
                y={Math.min(open, close)}
                width={8}
                height={Math.abs(close - open)}
                fill={d.close > d.open ? "#4CAF50" : "#FF5252"}
              />
            </g>
          );
        })}

        {/* X-axis */}
        <line x1={0} y1={height} x2={width} y2={height} stroke="#e0e0e0" />
        {data.filter((_, i) => i % Math.floor(data.length / 6) === 0).map((d, i) => (
          <text key={i} x={xScale(i * Math.floor(data.length / 6))} y={height + 20} textAnchor="middle" fontSize="12">
            {formatDate(d.date)}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default CustomCandlestickChart;