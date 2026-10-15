import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CandidateDashboardDto } from '../../types';
import { candidateApi, fileHelpers } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { JobCard } from '../../components/JobCard';
import {
  Briefcase,
  CheckCircle2,
  Bookmark,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  User,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CandidateDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await candidateApi.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load candidate dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your candidate workspace...</p>
      </div>
    );
  }

  const completeness = data?.profileCompleteness || 30;

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-card">
        <div className="flex items-center space-x-4">
          <img
            src={fileHelpers.getAvatarUrl(user || undefined)}
            alt={user?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-primary-400 p-0.5 bg-primary-800"
          />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-300">
              Candidate Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-xs text-slate-300">
              Track your applications, manage your resume, and discover verified openings.
            </p>
          </div>
        </div>

        <Link
          to="/candidate/profile"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-sm"
        >
          <User className="w-4 h-4 text-primary-300" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Profile Completeness Indicator */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-bold text-slate-900">Profile Completeness</h3>
          </div>
          <span className="text-sm font-extrabold text-primary-700">{completeness}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>

        {completeness < 100 && (
          <p className="text-xs text-slate-500">
            Tip: Complete your skills array, work experience, and upload your PDF resume to maximize recruiter discovery.
          </p>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Applied</span>
            <p className="text-2xl font-extrabold text-slate-900">{data?.totalApplications || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Shortlisted</span>
            <p className="text-2xl font-extrabold text-purple-700">{data?.shortlistedApplications || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Saved Jobs</span>
            <p className="text-2xl font-extrabold text-slate-900">{data?.savedJobsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Not Selected</span>
            <p className="text-2xl font-extrabold text-slate-700">{data?.rejectedApplications || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
            <p className="text-xs text-slate-500">Track your recruitment milestones in real time</p>
          </div>
          <Link
            to="/candidate/applications"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentApplications && data.recentApplications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.recentApplications.map((app) => (
              <div key={app.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={fileHelpers.getCompanyLogoUrl({ logoPath: app.companyLogo, name: app.companyName })}
                    alt={app.companyName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-100 p-0.5 bg-slate-50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{app.jobTitle}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {app.companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={app.status} />
                  <Link
                    to="/candidate/applications"
                    className="text-xs font-semibold text-slate-600 hover:text-primary-600 flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            You haven't submitted any applications yet. Explore openings to get started!
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recommended Opportunities</h3>
            <p className="text-xs text-slate-500">Hand-picked active roles matching technical skills</p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <span>Browse More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {data?.recommendedJobs?.map((job) => (
            <JobCard key={job.id} job={job} onApplicationSuccess={fetchDashboard} />
          ))}
        </div>
      </div>
    </div>
  );
};
