import React, { useCallback } from 'react';
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const CandlestickChart = ({ data, showVolume }) => {
  const renderCandlestick = useCallback(
    (props) => {
      const { x, y, width, height, low, high, open, close } = props;
      const fill = open > close ? "#c23f38" : "#00b16a";
      
      return (
        <g key={`candlestick-${x}-${y}`}>
          <line x1={x} y1={y + height} x2={x} y2={y} stroke={fill} />
          <rect x={x - width / 2} y={Math.min(open, close)} width={width} height={Math.abs(open - close)} fill={fill} />
        </g>
      );
    },
    []
  );

  const formatTooltip = (value, name) => {
    if (name === 'volume') {
      return [`${value.toLocaleString()}`, 'Volume'];
    }
    return [`$${value.toFixed(2)}`, name.charAt(0).toUpperCase() + name.slice(1)];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
          scale="time"
          type="number"
          domain={['dataMin', 'dataMax']}
        />
        <YAxis 
          yAxisId="left"
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `$${value.toFixed(2)}`}
        />
        {showVolume && (
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
        )}
        <Tooltip 
          formatter={formatTooltip}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <Legend />
        {showVolume && (
          <Bar 
            dataKey="volume" 
            fill="#8884d8" 
            yAxisId="right" 
            name="Volume"
            maxBarSize={10}
          />
        )}
        {data.map((entry, index) => (
          renderCandlestick({
            key: `candlestick-${index}`,
            x: entry.date,
            y: Math.min(entry.open, entry.close, entry.low, entry.high),
            width: 8,
            height: Math.abs(entry.high - entry.low),
            low: entry.low,
            high: entry.high,
            open: entry.open,
            close: entry.close
          })
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CandlestickChart;