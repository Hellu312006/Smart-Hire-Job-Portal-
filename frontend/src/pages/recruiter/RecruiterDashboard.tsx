import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RecruiterDashboardDto } from '../../types';
import { recruiterApi, fileHelpers } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { PageLoader, TopProgressBar } from '../../components/Loading';
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  PlusCircle,
  BarChart3,
  Building2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<RecruiterDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await recruiterApi.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load recruiter dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <TopProgressBar />
        <PageLoader
          message="Loading recruiter analytics..."
          subMessage="Compiling pipeline metrics, recent applicant activity, and conversion data"
        />
      </>
    );
  }

  // Prepare chart data from status map
  const chartData = data?.applicationsByStatus
    ? Object.entries(data.applicationsByStatus).map(([status, count]) => ({
        name: status.replace(/_/g, ' '),
        count,
      }))
    : [];

  const barColors = ['#3B82F6', '#F59E0B', '#8B5CF6', '#6366F1', '#10B981', '#EF4444'];

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-card">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
            Employer Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruiter Hub • {user?.fullName}
          </h1>
          <p className="text-xs text-slate-300">
            Supervise job openings, candidate pipelines, and evaluation metrics.
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-600/30 transition-all flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job Opening</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Jobs</span>
            <p className="text-2xl font-extrabold text-slate-900">{data?.activeJobs || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
            <p className="text-2xl font-extrabold text-indigo-700">{data?.totalApplicants || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Shortlisted</span>
            <p className="text-2xl font-extrabold text-purple-700">{data?.shortlistedCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Rejected</span>
            <p className="text-2xl font-extrabold text-slate-700">{data?.rejectedCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Analytics */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h3 className="text-base font-bold text-slate-900">Application Pipeline by Status</h3>
          </div>
          <p className="text-xs text-slate-500">
            Real-time candidate volume distributed across recruitment progression stages.
          </p>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recruiter Quick Actions</h3>
            <p className="text-xs text-slate-500">
              Manage company profile, review resumes, and evaluate interview feedback.
            </p>

            <div className="space-y-2 pt-2">
              <Link
                to="/recruiter/create-job"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-semibold text-xs transition-colors"
              >
                <span>Create New Listing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/recruiter/applicants"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-semibold text-xs transition-colors"
              >
                <span>Review All Candidates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/recruiter/company"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-semibold text-xs transition-colors"
              >
                <span>Update Company Profile & Logo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applicants Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Candidate Applications</h3>
            <p className="text-xs text-slate-500">Applicants awaiting review across your listings</p>
          </div>
          <Link
            to="/recruiter/applicants"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <span>View All Applicants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentApplicants && data.recentApplicants.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.recentApplicants.map((app) => (
              <div
                key={app.id}
                className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{app.candidateName}</h4>
                  <p className="text-xs text-slate-500">
                    Applying for: <span className="font-semibold text-slate-700">{app.jobTitle}</span> • Applied{' '}
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={app.status} />
                  <Link
                    to="/recruiter/applicants"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No applicant submissions received yet. Post jobs to start receiving applications!
          </div>
        )}
      </div>
    </div>
  );
};
