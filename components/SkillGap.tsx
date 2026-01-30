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
  const [activeTab, setActiveTab] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

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

  const filteredGaps = activeTab === 'All'
    ? gaps.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return (priorityOrder[b.importance] || 0) - (priorityOrder[a.importance] || 0);
    })
    : gaps.filter(g => g.importance === activeTab);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-error-400 bg-error-900/20 border-error-900/50';
      case 'Medium': return 'text-warning-400 bg-warning-900/20 border-warning-900/50';
      case 'Low': return 'text-brand-400 bg-brand-900/20 border-brand-900/50';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-700/50 rounded-xl border border-gray-600"></div>
          <div className="h-24 bg-gray-700/50 rounded-xl border border-gray-600"></div>
        </div>
        <div className="flex justify-center mt-6">
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest animate-pulse">Generating Growth Plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-700 bg-gray-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Skill Gap Analysis</h3>
          <p className="text-sm text-gray-400 mt-1">Acquire these skills to qualify for <span className="font-semibold text-gray-200">{targetRole}</span></p>
        </div>

        <div className="flex gap-2 p-1 bg-gray-900 rounded-lg border border-gray-700">
          {['All', 'High', 'Medium', 'Low'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-700 overflow-y-auto custom-scrollbar max-h-[500px]">
        {gaps.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-success-900/20 text-success-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-success-900/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Excellent Match!</h4>
            <p className="text-gray-400 max-w-sm mx-auto">Your profile is very well aligned with this role. Focus on highlighting your strengths!</p>
          </div>
        ) : filteredGaps.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No {activeTab.toLowerCase()} priority gaps found.
          </div>
        ) : (
          filteredGaps.map((gap, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-750 transition-colors group">
              <div className="flex flex-col md:flex-row gap-4 md:items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-base">
                      {gap.skill}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${getPriorityColor(gap.importance)}`}>
                      {gap.importance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-gray-600 pl-3">
                    {gap.recommendation}
                  </p>
                </div>

                <div className="flex-shrink-0 mt-2 md:mt-0">
                  <a
                    href={`https://www.google.com/search?q=learn+${encodeURIComponent(gap.skill)}+for+${encodeURIComponent(targetRole)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs font-semibold text-gray-400 hover:text-brand-300 hover:border-brand-500/50 transition-colors group-hover:bg-gray-800"
                  >
                    <span>Resources</span>
                    <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillGapView;