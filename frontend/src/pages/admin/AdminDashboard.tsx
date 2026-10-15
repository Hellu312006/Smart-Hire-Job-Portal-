 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminDashboardDto } from '../../types';
import { adminApi } from '../../services/api';
import { PageLoader, TopProgressBar } from '../../components/Loading';
import {
  Users,
  Building2,
  Briefcase,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
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

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const res = await adminApi.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <TopProgressBar />
        <PageLoader
          message="Loading system administration metrics..."
          subMessage="Streaming audit telemetry, user distributions, and platform health stats"
        />
      </>
    );
  }

  const chartData = data?.applicationsByStatus
    ? Object.entries(data.applicationsByStatus).map(([status, count]) => ({
        name: status.replace(/_/g, ' '),
        count,
      }))
    : [];

  const barColors = ['#2563EB', '#F59E0B', '#8B5CF6', '#6366F1', '#10B981', '#EF4444'];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-primary-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System Executive Overview
          </h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry spanning MySQL transactional entities and MongoDB activity documents.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/activity-logs"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-md shadow-primary-600/30"
          >
            Live MongoDB Logs
          </Link>
        </div>
      </div>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <p className="text-2xl font-extrabold text-slate-900">{data?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Companies</span>
            <p className="text-2xl font-extrabold text-purple-700">{data?.totalCompanies || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Jobs</span>
            <p className="text-2xl font-extrabold text-emerald-600">{data?.activeJobs || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Applications</span>
            <p className="text-2xl font-extrabold text-slate-900">{data?.totalApplications || 0}</p>
          </div>
        </div>
      </div>

      {/* Global Recruitment Pipeline Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="text-base font-bold text-slate-900">Platform-Wide Application Distribution</h3>
        </div>
        <p className="text-xs text-slate-500">
          Aggregated status counts across all jobs and companies stored in MySQL.
        </p>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
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

      {/* Recent MongoDB Audit Logs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Platform Activity (MongoDB)</h3>
            <p className="text-xs text-slate-500">Audit trail captured in `activity_logs` collection</p>
          </div>
          <Link
            to="/admin/activity-logs"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <span>View Full Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentActivityLogs && data.recentActivityLogs.length > 0 ? (
          <div className="divide-y divide-slate-100 font-mono text-xs">
            {data.recentActivityLogs.slice(0, 8).map((log, idx) => (
              <div key={log.id || idx} className="py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {log.action}
                  </span>
                  <span className="text-slate-700 font-medium">{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString()} • {log.userEmail || 'System'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">No activity logs recorded yet.</div>
        )}
      </div>
    </div>
  );
};
