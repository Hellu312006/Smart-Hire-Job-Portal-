import React, { useState, useEffect } from 'react';
import { JobDto } from '../../types';
import { candidateApi } from '../../services/api';
import { JobCard } from '../../components/JobCard';
import { Bookmark, Briefcase } from 'lucide-react';

export const CandidateSavedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await candidateApi.getSavedJobs(0, 30);
      setJobs(res.content);
    } catch (err) {
      console.error('Failed to load saved jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleBookmarkToggle = (jobId: number, isSaved: boolean) => {
    if (!isSaved) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Saved Job Bookmarks</h1>
        <p className="text-xs text-slate-500">
          Revisit opportunities you've saved and apply when you are ready.
        </p>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onBookmarkToggle={handleBookmarkToggle}
              onApplicationSuccess={fetchSavedJobs}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No saved jobs yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any job card across the listings to store it here for later.
          </p>
        </div>
      )}
    </div>
  );
};
