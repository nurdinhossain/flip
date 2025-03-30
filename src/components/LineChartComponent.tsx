import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartData from './ChartData';

type BarChartProps = {
    data: ChartData[];
    xAxisKey: string;
    yAxisKey: string;
};

const LineChartComponent: React.FC<BarChartProps> = ({ data, xAxisKey, yAxisKey }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: '#ccc' }} />
        <Legend />
        <Line type="monotone" dataKey={yAxisKey} stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;