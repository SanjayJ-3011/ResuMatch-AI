import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ScoreChartProps {
  score: number;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
  const data = [{ name: 'Score', value: score }];
  
  // Semantic Colors matched to the new design
  let fill = '#f43f5e'; // error-500
  if (score >= 50) fill = '#f59e0b'; // warning-500
  if (score >= 70) fill = '#6366f1'; // brand-500 (indigo)
  if (score >= 85) fill = '#10b981'; // success-500 (emerald)

  return (
    <div className="relative h-40 w-40 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="75%" 
          outerRadius="100%" 
          barSize={12} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#1f2937' }} // gray-800
            clockWise
            dataKey="value"
            cornerRadius={100}
            fill={fill}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-extrabold text-white tracking-tighter drop-shadow-sm">{score}</span>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
};

export default ScoreChart;