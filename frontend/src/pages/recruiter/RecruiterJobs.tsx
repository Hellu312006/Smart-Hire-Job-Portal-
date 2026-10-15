import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobDto, JobStatus } from '../../types';
import { recruiterApi, jobApi } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Briefcase,
  PlusCircle,
  Users,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  MapPin,
  Calendar,
} from 'lucide-react';

export const RecruiterJobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await recruiterApi.getPostedJobs(0, 50);
      setJobs(res.content);
    } catch (err) {
      console.error('Failed to load posted jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job: JobDto) => {
    const nextStatus: JobStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await jobApi.patchJobStatus(job.id, nextStatus);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
      );
    } catch (err) {
      console.error('Failed to change status', err);
    }
  };

  const handleDelete = async (jobId: number) => {
    if (window.confirm('Are you sure you want to delete this job listing? All associated applications will also be removed.')) {
      try {
        await jobApi.deleteJob(jobId);
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      } catch (err) {
        console.error('Failed to delete job', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your job listings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Posted Jobs</h1>
          <p className="text-xs text-slate-500">
            Supervise active listings, close vacancies, and review candidate talent pipelines.
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Position</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Type & Level</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Posted Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-slate-900 hover:text-primary-600 flex items-center space-x-1"
                      >
                        <span>{job.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {job.employmentType.replace(/_/g, ' ')}
                      </span>{' '}
                      • {job.experienceLevel}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/recruiter/applicants?jobId=${job.id}`}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          title="View Applicants"
                        >
                          <Users className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleToggleStatus(job)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            job.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={`Toggle Status (Currently ${job.status})`}
                        >
                          {job.status === 'ACTIVE' ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No jobs posted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Post New Job" above to establish your first vacancy.
          </p>
        </div>
      )}
    </div>
  );
};
