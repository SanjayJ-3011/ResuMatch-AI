import React from 'react';
import { SavedAnalysis } from '../services/analysisService';

interface AnalysisHistoryProps {
    analyses: SavedAnalysis[];
    onSelect: (analysis: SavedAnalysis) => void;
    isLoading?: boolean;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ analyses, onSelect, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (analyses.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No past analyses found.</p>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-success-400 bg-success-900/20 border-success-900/50';
        if (score >= 60) return 'text-warning-400 bg-warning-900/20 border-warning-900/50';
        return 'text-error-400 bg-error-900/20 border-error-900/50';
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Past Analyses</h3>
            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {analyses.map((analysis) => {
                    // Format date safely
                    const date = analysis.createdAt?.toDate
                        ? analysis.createdAt.toDate().toLocaleDateString()
                        : 'Just now';

                    return (
                        <div
                            key={analysis.id}
                            onClick={() => onSelect(analysis)}
                            className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-brand-500/50 hover:bg-gray-750 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">{date}</span>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getScoreColor(analysis.atsScore)}`}>
                                    {analysis.atsScore}/100
                                </span>
                            </div>
                            <div className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                                {analysis.detectedRole}
                            </div>
                            <div className="flex gap-2 mt-2 overflow-hidden">
                                {analysis.topSkills.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="text-xs bg-gray-900 text-gray-500 px-2 py-0.5 rounded truncate">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalysisHistory;
