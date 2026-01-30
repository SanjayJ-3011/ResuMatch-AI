import { Job } from '../types';
import { INITIAL_JOBS } from '../constants';

const STORAGE_KEY = 'resumatch_jobs_v1';

export const JobService = {
  getAllJobs: (): Job[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    return JSON.parse(stored);
  },

  addJob: (job: Job): Job[] => {
    const jobs = JobService.getAllJobs();
    const newJobs = [job, ...jobs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
    return newJobs;
  },

  deleteJob: (id: string): Job[] => {
    const jobs = JobService.getAllJobs();
    const newJobs = jobs.filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
    return newJobs;
  },

  resetJobs: (): Job[] => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
  }
};