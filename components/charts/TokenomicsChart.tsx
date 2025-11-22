import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TokenDistribution } from '../../types';

interface TokenomicsChartProps {
  data: TokenDistribution[];
}

const COLORS = ['#4c8df6', '#c888f9', '#f9ab00', '#e65b65', '#00bfa5'];

const TokenomicsChart: React.FC<TokenomicsChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px] bg-gemini-surface rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-medium text-gray-400 mb-2">Tokenomics</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#1e1f20', borderColor: '#333', color: '#fff' }}
             itemStyle={{ color: '#fff' }}
             formatter={(val: number) => [`${val}%`, 'Allocation']}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#ccc' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenomicsChart;