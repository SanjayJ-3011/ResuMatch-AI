import { Job } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA (Remote)',
    type: 'Full-time',
    description: 'Looking for a React expert with TypeScript and Tailwind experience to lead our UI team.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS', '5+ years experience', 'State Management'],
    salaryRange: '$140k - $180k'
  },
  {
    id: '2',
    title: 'Data Analyst',
    company: 'Metrics Inc.',
    location: 'New York, NY',
    type: 'Hybrid',
    description: 'Analyze complex datasets to drive business insights using SQL and Python.',
    requirements: ['SQL', 'Python', 'Tableau', 'Data Visualization', 'Communication'],
    salaryRange: '$90k - $120k'
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'InnovateCreate',
    location: 'Austin, TX',
    type: 'Full-time',
    description: 'Lead the product lifecycle from concept to launch for our SaaS platform.',
    requirements: ['Product Strategy', 'Agile', 'JIRA', 'User Research', 'Roadmapping'],
    salaryRange: '$130k - $160k'
  },
  {
    id: '4',
    title: 'Junior Backend Developer',
    company: 'CloudSystems',
    location: 'Remote',
    type: 'Contract',
    description: 'Support backend API development using Node.js and Express.',
    requirements: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
    salaryRange: '$70k - $90k'
  },
  {
    id: '5',
    title: 'UX/UI Designer',
    company: 'Creative Studio',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    description: 'Design intuitive and beautiful user interfaces for web and mobile apps.',
    requirements: ['Figma', 'Prototyping', 'User Flows', 'HTML/CSS knowledge', 'Design Systems'],
    salaryRange: '$100k - $130k'
  }
];

export const SYSTEM_INSTRUCTION_ANALYSIS = `
You are an expert ATS (Applicant Tracking System) and Resume Coach. 
Analyze the provided resume document.
Return a valid JSON object strictly adhering to this structure:
{
  "atsScore": number (0-100),
  "summary": "Short professional summary (max 2 sentences)",
  "detectedRole": "Likely job title",
  "topSkills": ["skill1", "skill2", ...],
  "experienceLevel": "Entry" | "Mid" | "Senior",
  
  "skillsFeedback": "Specific feedback on technical/soft skills",
  "skillsStatus": "Strong" | "Improve" | "Critical",
  
  "experienceFeedback": "Feedback on how work history and impact are presented",
  "experienceStatus": "Strong" | "Improve" | "Critical",
  
  "keywordsFeedback": "Feedback on industry keywords and ATS optimization",
  "keywordsStatus": "Strong" | "Improve" | "Critical",
  
  "formattingFeedback": "Feedback on layout, structure, and readability",
  "formattingStatus": "Strong" | "Improve" | "Critical",
  
  "improvementTips": ["Actionable Tip 1", "Actionable Tip 2", "Actionable Tip 3"]
}
`;

export const SYSTEM_INSTRUCTION_MATCHING = `
You are a Recruitment AI.
I will provide you with a Resume Analysis and a list of Available Jobs.
You must compare the candidate's profile against EACH job in the list.
Return a valid JSON object strictly adhering to this structure:
{
  "matches": [
    {
      "jobId": "id from the job list",
      "fitScore": number (0-100),
      "fitLabel": "High" | "Medium" | "Low",
      "reasoning": "One sentence explaining why they fit or don't fit",
      "missingSkills": ["skill missing for this specific job"]
    }
  ]
}
`;

export const SYSTEM_INSTRUCTION_SKILL_GAP = `
You are a Career Coach.
Based on the candidate's resume and a target job role, provide a valid JSON object with detailed skill gap analysis:
{
  "gaps": [
    {
      "skill": "Name of skill",
      "importance": "High" | "Medium" | "Low",
      "recommendation": "Actionable advice on how to improve this specific skill (e.g., specific project or concept to learn)"
    }
  ]
}
`;