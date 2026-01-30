export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  description: string;
  requirements: string[];
  salaryRange?: string;
  isActive?: boolean;
}

export interface SkillGap {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
  recommendation: string;
}

export interface JobMatch {
  jobId: string;
  fitScore: number; // 0-100
  fitLabel: 'High' | 'Medium' | 'Low';
  reasoning: string;
  missingSkills: string[];
}

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  detectedRole: string;
  topSkills: string[];
  experienceLevel: string;

  // Section-wise structured feedback
  skillsFeedback: string;
  skillsStatus: 'Strong' | 'Improve' | 'Critical';

  experienceFeedback: string;
  experienceStatus: 'Strong' | 'Improve' | 'Critical';

  keywordsFeedback: string;
  keywordsStatus: 'Strong' | 'Improve' | 'Critical';

  formattingFeedback: string;
  formattingStatus: 'Strong' | 'Improve' | 'Critical';

  improvementTips: string[];
}

export interface CompleteAnalysis {
  resume: ResumeAnalysis;
  matches: JobMatch[];
}