import React, { useState } from 'react';
import { CompleteAnalysis, Job } from '../types';
import ScoreChart from './ScoreChart';
import SkillGapView from './SkillGap';

interface DashboardProps {
  analysis: CompleteAnalysis;
  jobs: Job[];
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analysis, jobs, onReset }) => {
  const [selectedJobIdForGap, setSelectedJobIdForGap] = useState<string | null>(null);

  const getJobDetails = (id: string) => jobs.find(j => j.id === id);

  // Helper to find matching skills (simple string inclusion check)
  const getMatchingSkills = (resumeSkills: string[], jobReqs: string[]) => {
    return jobReqs.filter(req => 
      resumeSkills.some(skill => 
        skill.toLowerCase().includes(req.toLowerCase()) || 
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  const getStatusColor = (status: 'Strong' | 'Improve' | 'Critical') => {
    switch (status) {
      case 'Strong': return 'bg-success-500/10 text-success-400 border-success-500/20';
      case 'Improve': return 'bg-warning-500/10 text-warning-400 border-warning-500/20';
      case 'Critical': return 'bg-error-500/10 text-error-400 border-error-500/20';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 font-sans text-gray-100">
      
      {/* 1. Header: Supportive Coach Tone */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-800">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <span className="px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-500/30">
               AI Career Coach
             </span>
             <span className="text-gray-500 text-sm">|</span>
             <span className="text-gray-400 text-sm">Analysis Complete</span>
           </div>
           <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
             Hello, Candidate.
           </h2>
           <p className="text-lg text-gray-400 max-w-2xl">
             I've analyzed your profile for <span className="text-white font-semibold">{analysis.resume.detectedRole}</span> roles. 
             Here is your personalized roadmap to success.
           </p>
        </div>
        <button 
          onClick={onReset}
          className="group flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-sm border border-gray-700 hover:border-gray-600"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Upload New Resume
        </button>
      </div>

      {/* 2. Top Section: ATS Score & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* ATS Score Card */}
        <div className="lg:col-span-4 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 p-8 flex flex-col items-center justify-center text-center shadow-soft relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-brand-900/10 to-transparent pointer-events-none"></div>
           
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">ATS Compatibility</h3>
           
           <div className="relative mb-6 transform scale-110">
             <ScoreChart score={analysis.resume.atsScore} />
           </div>
           
           <div className="space-y-2 max-w-xs">
             <div className="text-2xl font-bold text-white">
               {analysis.resume.atsScore >= 80 ? 'Application Ready' : 'Needs Optimization'}
             </div>
             <p className="text-sm text-gray-400 leading-relaxed">
               {analysis.resume.atsScore >= 80 
                 ? "Great job! Your resume is well-structured for ATS algorithms." 
                 : "Your resume may be filtered out by automated systems. Focus on keywords and formatting."}
             </p>
           </div>
        </div>

        {/* Action Plan (Improvement Tips) */}
        <div className="lg:col-span-8 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 p-8 shadow-soft flex flex-col relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500"></div>
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 border border-brand-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Priority Actions</h3>
                <p className="text-xs text-brand-300 font-medium uppercase tracking-wide">Top recommendations to boost your score</p>
              </div>
           </div>
           
           <div className="flex-1 flex flex-col justify-center space-y-4">
             {analysis.resume.improvementTips.slice(0, 3).map((tip, idx) => (
               <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-700/50 hover:border-brand-500/30 transition-colors group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-900/50 border border-brand-700 text-brand-400 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                    {tip}
                  </p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* 3. Section-wise Feedback Grid */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Detailed Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Skills Impact', status: analysis.resume.skillsStatus, text: analysis.resume.skillsFeedback, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
            { title: 'Experience', status: analysis.resume.experienceStatus, text: analysis.resume.experienceFeedback, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { title: 'Keywords & SEO', status: analysis.resume.keywordsStatus, text: analysis.resume.keywordsFeedback, icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
            { title: 'Formatting', status: analysis.resume.formattingStatus, text: analysis.resume.formattingFeedback, icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM16 13a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z' }
          ].map((item, i) => (
            <div key={i} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex flex-col gap-4 hover:bg-gray-800 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg text-gray-300 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                  </div>
                  <h4 className="font-bold text-white">{item.title}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed pl-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Job Matches & Skill Gaps */}
      <div className="space-y-8 pt-8 border-t border-gray-800">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-bold text-white">Recommended Roles</h3>
           <div className="text-sm text-gray-500">Based on your profile strength</div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {analysis.matches.map((match) => {
             const job = getJobDetails(match.jobId);
             if (!job) return null;
             
             const isHigh = match.fitLabel === 'High';
             const isExpanded = selectedJobIdForGap === match.jobId;
             const matchingSkills = getMatchingSkills(analysis.resume.topSkills || [], job.requirements);
             const missingSkills = match.missingSkills || [];

             return (
               <div key={match.jobId} className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isHigh ? 'bg-gray-800/80 border-brand-500/30 shadow-glow' : 'bg-gray-800/40 border-gray-700'}`}>
                 <div className="p-8">
                   <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-white">{job.title}</h4>
                          {isHigh && <span className="px-2 py-0.5 bg-success-500/20 text-success-400 text-[10px] font-bold uppercase tracking-wider rounded border border-success-500/30">Best Match</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {job.company}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`text-4xl font-extrabold tracking-tighter ${isHigh ? 'text-success-400' : 'text-gray-400'}`}>
                            {match.fitScore}%
                          </div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fit Score</div>
                        </div>
                        <button 
                          onClick={() => setSelectedJobIdForGap(isExpanded ? null : match.jobId)}
                          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                        >
                           {isExpanded ? 'Close Plan' : 'View Action Plan'}
                           <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                   </div>

                   <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900/40 rounded-2xl p-6 border border-gray-800">
                      <div>
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">AI Analysis</h5>
                        <p className="text-gray-300 text-sm leading-relaxed">{match.reasoning}</p>
                      </div>
                      
                      <div>
                         <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Skill Snapshot</h5>
                         <div className="flex flex-wrap gap-2">
                           {/* Strong Skills (Green) */}
                           {matchingSkills.map(skill => (
                             <span key={skill} className="px-2 py-1 bg-success-500/10 text-success-400 border border-success-500/20 rounded text-xs font-semibold flex items-center gap-1">
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                               {skill}
                             </span>
                           ))}
                           {/* Missing Skills (Amber/Red) */}
                           {missingSkills.slice(0, 3).map(skill => (
                             <span key={skill} className="px-2 py-1 bg-warning-500/10 text-warning-400 border border-warning-500/20 rounded text-xs font-semibold flex items-center gap-1">
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                               {skill}
                             </span>
                           ))}
                           {missingSkills.length > 3 && (
                             <span className="px-2 py-1 bg-gray-800 text-gray-500 rounded text-xs font-semibold">
                               +{missingSkills.length - 3} more
                             </span>
                           )}
                         </div>
                      </div>
                   </div>
                 </div>

                 {isExpanded && (
                   <div className="border-t border-gray-700/50 bg-gray-900/20 p-8 animate-in fade-in slide-in-from-top-1">
                      <SkillGapView analysis={analysis.resume} targetRole={job.title} />
                   </div>
                 )}
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;