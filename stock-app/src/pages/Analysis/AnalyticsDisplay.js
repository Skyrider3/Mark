import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AnalyticsDisplay = ({ data, insights }) => {
  return (
    <div>
      <h2>Stock Analytics Results</h2>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
        <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
      </LineChart>
      <div>
        <h3>Key Insights:</h3>
        <ul>
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsDisplay;