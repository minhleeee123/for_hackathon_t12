import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LongShortData } from '../../types';

interface LongShortChartProps {
  data: LongShortData[];
}

const LongShortChart: React.FC<LongShortChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[250px] bg-gemini-surface rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Long/Short Ratio</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#888', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
             cursor={{fill: 'transparent'}}
             contentStyle={{ backgroundColor: '#1e1f20', borderColor: '#333', color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#ccc' }}/>
          <Bar dataKey="long" stackId="a" fill="#00bfa5" name="Longs" radius={[0, 0, 4, 4]} />
          <Bar dataKey="short" stackId="a" fill="#e65b65" name="Shorts" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LongShortChart;