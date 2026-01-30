import React, { useState, useEffect } from 'react';
import { ResumeAnalysis, SkillGap } from '../types';
import { GeminiService } from '../services/geminiService';

interface SkillGapProps {
  analysis: ResumeAnalysis;
  targetRole: string;
}

const SkillGapView: React.FC<SkillGapProps> = ({ analysis, targetRole }) => {
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchGaps = async () => {
      setLoading(true);
      try {
        const results = await GeminiService.getSkillGapAnalysis(analysis, targetRole);
        setGaps(results);
        setFetched(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (targetRole && !fetched) {
      fetchGaps();
    }
  }, [analysis, targetRole, fetched]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-8"></div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-700/50 rounded-xl border border-gray-600"></div>
          <div className="h-20 bg-gray-700/50 rounded-xl border border-gray-600"></div>
        </div>
        <div className="flex justify-center mt-6">
           <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest animate-pulse">Generating Growth Plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/30 flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-white">Skill Gap Analysis</h3>
          <p className="text-xs text-gray-400 mt-1">Tailored advice to qualify for <span className="font-semibold text-gray-200">{targetRole}</span></p>
        </div>
        <div className="bg-brand-900/30 text-brand-400 p-2 rounded-lg border border-brand-900/50">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
      </div>
      
      <div className="divide-y divide-gray-700">
        {gaps.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 bg-success-900/30 text-success-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-success-900/50">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-white font-medium">Excellent Match!</p>
            <p className="text-sm text-gray-400 mt-1">We didn't find any critical skill gaps for this role.</p>
          </div>
        ) : (
          gaps.map((gap, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-700/30 transition-colors group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h4 className="font-bold text-gray-200 text-sm flex items-center gap-2">
                   {gap.skill}
                </h4>
                <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide shadow-sm border
                  ${gap.importance === 'High' ? 'bg-error-900/30 text-error-300 border-error-800' : 
                    gap.importance === 'Medium' ? 'bg-warning-900/30 text-warning-300 border-warning-800' : 
                    'bg-brand-900/30 text-brand-300 border-brand-800'}`}>
                  {gap.importance} Priority
                </span>
              </div>
              <div className="flex gap-4">
                 <div className={`w-1 rounded-full mt-1 ${gap.importance === 'High' ? 'bg-error-500' : gap.importance === 'Medium' ? 'bg-warning-500' : 'bg-brand-500'}`}></div>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   {gap.recommendation}
                 </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillGapView;