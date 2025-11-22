import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ProjectMetric } from '../../types';

interface ProjectScoreChartProps {
  data: ProjectMetric[];
}

const ProjectScoreChart: React.FC<ProjectScoreChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px] bg-gemini-surface rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-medium text-gray-400 mb-2">Project Score</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="A"
            stroke="#4c8df6"
            strokeWidth={2}
            fill="#4c8df6"
            fillOpacity={0.4}
          />
           <Tooltip 
             contentStyle={{ backgroundColor: '#1e1f20', borderColor: '#333', color: '#fff' }}
             itemStyle={{ color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectScoreChart;