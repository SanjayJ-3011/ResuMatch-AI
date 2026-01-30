import React, { useState } from 'react';
import { Job } from '../types';
import { JobService } from '../services/jobService';

interface AdminPanelProps {
  jobs: Job[];
  onUpdate: (jobs: Job[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ jobs, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: [],
    salaryRange: ''
  });
  const [reqInput, setReqInput] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      const updated = JobService.deleteJob(id);
      onUpdate(updated);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to default demo jobs?')) {
      const updated = JobService.resetJobs();
      onUpdate(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job: Job = {
      id: Date.now().toString(),
      title: newJob.title || 'Untitled',
      company: newJob.company || 'Unknown',
      location: newJob.location || 'Remote',
      type: (newJob.type as any) || 'Full-time',
      description: newJob.description || '',
      requirements: newJob.requirements || [],
      salaryRange: newJob.salaryRange || 'Competitive'
    };
    const updated = JobService.addJob(job);
    onUpdate(updated);
    setIsAdding(false);
    setNewJob({ title: '', company: '', location: '', type: 'Full-time', description: '', requirements: [], salaryRange: '' });
  };

  const addRequirement = () => {
    if (reqInput.trim()) {
      setNewJob(prev => ({ ...prev, requirements: [...(prev.requirements || []), reqInput.trim()] }));
      setReqInput('');
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Vacancy Management</h2>
          <p className="text-gray-400 mt-1 text-sm">Control the job pool for the matching algorithm.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-error-400 hover:bg-error-900/20 rounded-lg transition-colors">
            Reset Defaults
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)} 
            className="px-5 py-2 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg hover:bg-white shadow-lg transition-all hover:-translate-y-0.5"
          >
            {isAdding ? 'Cancel' : '+ New Job'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-xl animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100"></div>
          <h3 className="text-lg font-bold text-white mb-6">Create New Position</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Job Title</label>
                <input 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" 
                  placeholder="e.g. Senior Product Designer" required 
                  value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Company</label>
                <input 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" 
                  placeholder="e.g. Acme Corp" required 
                  value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</label>
                <input 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" 
                  placeholder="e.g. New York, NY" required 
                  value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Type</label>
                <div className="relative">
                  <select 
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all appearance-none" 
                    value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value as any})}
                  >
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Salary Range</label>
                <input 
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" 
                  placeholder="e.g. $100k - $120k" 
                  value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="space-y-1 mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
              <textarea 
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all h-24" 
                placeholder="Briefly describe the role..." required
                value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} 
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Requirements / Tags</label>
              <div className="flex gap-2 mb-3">
                <input 
                  className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-brand-500 outline-none" 
                  placeholder="Add skill (e.g. React)" 
                  value={reqInput}
                  onChange={e => setReqInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <button type="button" onClick={addRequirement} className="px-5 py-2 bg-gray-700 text-gray-200 font-bold rounded-xl hover:bg-gray-600">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {newJob.requirements?.map((req, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-900 border border-gray-700 text-sm font-medium rounded-lg flex items-center shadow-sm text-gray-300">
                    {req} <button type="button" onClick={() => setNewJob(prev => ({...prev, requirements: prev.requirements?.filter((_, idx) => idx !== i)}))} className="ml-2 text-gray-500 hover:text-error-400 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-700">
              <button type="submit" className="px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 shadow-md hover:shadow-lg transition-all">Save Position</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-3xl border border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900/50">
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Company & Location</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
              <th className="p-6 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {jobs.map(job => (
              <tr key={job.id} className="group hover:bg-gray-700/30 transition-colors">
                <td className="p-6">
                  <div className="font-bold text-white">{job.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 font-mono">{job.id}</div>
                </td>
                <td className="p-6">
                  <div className="text-gray-300 font-medium">{job.company}</div>
                  <div className="text-sm text-gray-500">{job.location}</div>
                </td>
                <td className="p-6">
                   <div className="flex gap-2">
                     <span className="px-2.5 py-1 bg-gray-900 border border-gray-700 rounded-md text-xs font-medium text-gray-400 shadow-sm">{job.type}</span>
                     {job.salaryRange && <span className="px-2.5 py-1 bg-success-900/20 border border-success-900/50 rounded-md text-xs font-medium text-success-400">{job.salaryRange}</span>}
                   </div>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => handleDelete(job.id)} className="text-gray-600 hover:text-error-400 transition-colors p-2 rounded-lg hover:bg-error-900/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;