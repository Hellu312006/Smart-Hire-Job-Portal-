import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../../services/api';
import { EmploymentType, ExperienceLevel } from '../../types';
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react';

export const RecruiterCreateJob: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('FULL_TIME');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('MID');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        title,
        employmentType,
        experienceLevel,
        location,
        description,
        requirements,
      };
      if (minSalary) payload.minSalary = Number(minSalary);
      if (maxSalary) payload.maxSalary = Number(maxSalary);

      await jobApi.createJob(payload);
      navigate('/recruiter/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Post a New Job Opening</h1>
        <p className="text-xs text-slate-500">
          Create an active vacancy that will be immediately visible to candidates platform-wide.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Senior Full Stack Java Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Employment Type *
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white font-medium"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="REMOTE">Remote</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="PART_TIME">Part Time</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Experience Level *
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white font-medium"
            >
              <option value="ENTRY">Entry Level</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior Level</option>
              <option value="LEAD">Lead / Architect</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. San Francisco, CA or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Minimum Salary (USD/yr)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 100000"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Maximum Salary (USD/yr)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 150000"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Job Description & Responsibilities *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Describe the mission, day-to-day responsibilities, and team culture..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Technical Requirements & Qualifications
          </label>
          <textarea
            rows={4}
            placeholder="List required languages, frameworks, education, and years of experience..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/recruiter/jobs')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 disabled:opacity-50 transition-all"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Publishing Opening...' : 'Publish Job Opening'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
