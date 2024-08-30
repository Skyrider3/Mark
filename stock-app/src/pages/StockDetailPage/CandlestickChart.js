import React, { useMemo } from 'react';
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  ResponsiveContainer 
} from 'recharts';

const CandlestickChart = ({ data, showVolume }) => {
  const renderCandlestick = (props) => {
    const { x, y, width, height, low, high, open, close } = props;
    const fill = open > close ? "#c23f38" : "#00b16a";
    
    return (
      <g key={`candlestick-${x}-${y}`}>
        <line x1={x + width / 2} y1={y + height} x2={x + width / 2} y2={y} stroke={fill} />
        <rect x={x} y={Math.min(open, close)} width={width} height={Math.abs(open - close)} fill={fill} />
      </g>
    );
  };

  const formatTooltip = (value, name) => {
    if (name === 'volume') {
      return [`${value.toLocaleString()}`, 'Volume'];
    }
    return [`$${value.toFixed(2)}`, name.charAt(0).toUpperCase() + name.slice(1)];
  };

  const { minPrice, maxPrice } = useMemo(() => {
    return data.reduce((acc, item) => ({
      minPrice: Math.min(acc.minPrice, item.low),
      maxPrice: Math.max(acc.maxPrice, item.high)
    }), { minPrice: Infinity, maxPrice: -Infinity });
  }, [data]);

  const priceDomain = [minPrice * 0.99, maxPrice * 1.01]; // Add 1% padding

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis 
          yAxisId="left"
          domain={priceDomain}
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
        <ReferenceLine yAxisId="left" y={0} stroke="#000" />
        <svg>
          <defs>
            <clipPath id="candlestick-clip">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
        </svg>
        <g clipPath="url(#candlestick-clip)">
          {data.map((entry, index) => (
            renderCandlestick({
              key: `candlestick-${index}`,
              x: index * (100 / data.length), // Adjust based on chart width
              y: Math.min(entry.open, entry.close, entry.low, entry.high),
              width: 80 / data.length, // Adjust based on chart width
              height: Math.abs(entry.high - entry.low),
              low: entry.low,
              high: entry.high,
              open: entry.open,
              close: entry.close
            })
          ))}
        </g>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CandlestickChart;