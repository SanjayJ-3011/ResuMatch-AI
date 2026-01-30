import { GoogleGenAI, Type } from "@google/genai";
import { Job, ResumeAnalysis, JobMatch, SkillGap } from '../types';
import { SYSTEM_INSTRUCTION_ANALYSIS, SYSTEM_INSTRUCTION_MATCHING, SYSTEM_INSTRUCTION_SKILL_GAP } from '../constants';

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; // Fallback to avoid crash if undefined
if (!apiKey) {
  console.error("Gemini API Key is missing! Check your .env file or configuration.");
}
const ai = new GoogleGenAI({ apiKey });

// Using available Gemini 2.0 Flash
const MODEL_NAME = 'gemini-2.0-flash';

export const GeminiService = {

  analyzeResume: async (base64Data: string, mimeType: string): Promise<ResumeAnalysis> => {
    try {
      if (!apiKey) throw new Error("API Key is missing. Please configure VITE_GEMINI_API_KEY in .env");

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: "Analyze this resume provided in the attachment."
            }
          ]
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
          // Removed maxOutputTokens as recommended by guidelines
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              atsScore: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              detectedRole: { type: Type.STRING },
              topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceLevel: { type: Type.STRING },

              skillsFeedback: { type: Type.STRING },
              skillsStatus: { type: Type.STRING, enum: ["Strong", "Improve", "Critical"] },

              experienceFeedback: { type: Type.STRING },
              experienceStatus: { type: Type.STRING, enum: ["Strong", "Improve", "Critical"] },

              keywordsFeedback: { type: Type.STRING },
              keywordsStatus: { type: Type.STRING, enum: ["Strong", "Improve", "Critical"] },

              formattingFeedback: { type: Type.STRING },
              formattingStatus: { type: Type.STRING, enum: ["Strong", "Improve", "Critical"] },

              improvementTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      let text = response.text;
      if (!text) throw new Error("No response from AI");

      // Clean markdown code blocks if present
      text = text.replace(/^```json\s*/, '').replace(/```$/, '');

      const parsed = JSON.parse(text);

      // Return with defensive checks for arrays
      return {
        ...parsed,
        topSkills: parsed.topSkills || [],
        improvementTips: parsed.improvementTips || []
      } as ResumeAnalysis;

    } catch (error: any) {
      console.error("Resume Analysis Error:", error);
      const errorMessage = error?.message || "Unknown error";
      throw new Error(`Analysis failed: ${errorMessage}. Please check API key and Quota.`);
    }
  },

  matchJobs: async (resumeAnalysis: ResumeAnalysis, availableJobs: Job[]): Promise<JobMatch[]> => {
    try {
      // BATCHING: Process jobs in chunks to avoid hitting token limits
      // Reduced from 5 to 2 to prevent "Unterminated string" JSON errors on large outputs
      const BATCH_SIZE = 2;
      const allMatches: JobMatch[] = [];

      // Defensive check: ensure topSkills exists
      const skillsStr = (resumeAnalysis.topSkills || []).join(', ');

      for (let i = 0; i < availableJobs.length; i += BATCH_SIZE) {
        const batch = availableJobs.slice(i, i + BATCH_SIZE);

        // Lightweight context for the prompt
        const jobContext = batch.map(j => ({
          id: j.id,
          title: j.title,
          description: j.description.substring(0, 150), // Truncate description to save input tokens
          requirements: j.requirements
        }));

        const prompt = `
          RESUME SUMMARY: ${resumeAnalysis.summary}
          RESUME SKILLS: ${skillsStr}
          RESUME ROLE: ${resumeAnalysis.detectedRole}

          AVAILABLE JOBS BATCH: ${JSON.stringify(jobContext)}
          
          Compare the resume to these jobs. Keep reasoning concise (max 20 words).
        `;

        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION_MATCHING,
            // Removed maxOutputTokens as recommended by guidelines
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                matches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      jobId: { type: Type.STRING },
                      fitScore: { type: Type.INTEGER },
                      fitLabel: { type: Type.STRING },
                      reasoning: { type: Type.STRING },
                      missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                }
              }
            }
          }
        });

        let text = response.text;
        if (text) {
          text = text.replace(/^```json\s*/, '').replace(/```$/, '');
          try {
            const result = JSON.parse(text);
            if (result.matches && Array.isArray(result.matches)) {
              allMatches.push(...result.matches);
            }
          } catch (e) {
            console.error("Error parsing batch match results:", e);
            console.log("Raw text was:", text.substring(0, 200) + "...");
            // Continue to next batch instead of failing completely
          }
        }
      }

      // Ensure missingSkills is an array for each match
      return allMatches.map((m: any) => ({
        ...m,
        missingSkills: m.missingSkills || []
      }));

    } catch (error) {
      console.error("Job Matching Error:", error);
      // Fallback: return empty matches rather than crashing app
      return [];
    }
  },

  getSkillGapAnalysis: async (resumeAnalysis: ResumeAnalysis, jobTitle: string): Promise<SkillGap[]> => {
    try {
      const skillsStr = (resumeAnalysis.topSkills || []).join(', ');
      const prompt = `
        RESUME SKILLS: ${skillsStr}
        RESUME EXPERIENCE: ${resumeAnalysis.experienceLevel}
        TARGET ROLE: ${jobTitle}
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_SKILL_GAP,
          // Removed maxOutputTokens as recommended by guidelines
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    importance: { type: Type.STRING },
                    recommendation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      let text = response.text;
      if (!text) throw new Error("No response from AI");

      // Clean markdown code blocks if present
      text = text.replace(/^```json\s*/, '').replace(/```$/, '');

      const result = JSON.parse(text);
      return result.gaps || [];

    } catch (error) {
      console.error("Skill Gap Analysis Error:", error);
      return [];
    }
  }
};