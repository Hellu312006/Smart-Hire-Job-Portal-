import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { JobDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { jobApi, candidateApi, fileHelpers } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ApplyModal } from '../components/ApplyModal';
import {
  MapPin,
  DollarSign,
  Calendar,
  Bookmark,
  Building2,
  Send,
  ArrowLeft,
  Globe,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [job, setJob] = useState<JobDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  const fetchJob = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await jobApi.getJobById(Number(id));
      setJob(data);
      setIsSaved(data.saved || false);
    } catch (err) {
      console.error('Failed to load job details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/jobs/' + id);
      return;
    }
    if (role !== 'CANDIDATE' || !job) return;

    try {
      if (isSaved) {
        await candidateApi.unsaveJob(job.id);
        setIsSaved(false);
      } else {
        await candidateApi.saveJob(job.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark', err);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/jobs/' + id);
      return;
    }
    if (role !== 'CANDIDATE') {
      alert('Only candidate accounts can submit job applications.');
      return;
    }
    setIsApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading position details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-sm text-slate-500">The requested job opening either expired or does not exist.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Listings</span>
        </Link>
      </div>
    );
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive compensation package';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()} USD / year`;
    if (min) return `From $${min.toLocaleString()} USD / year`;
    return `Up to $${(max || 0).toLocaleString()} USD / year`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all jobs</span>
      </Link>

      {/* Main Job Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start space-x-4">
            <img
              src={fileHelpers.getCompanyLogoUrl({ logoPath: job.companyLogo, name: job.companyName })}
              alt={job.companyName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 p-1 bg-slate-50 flex-shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Link
                  to={`/companies/${job.companyId}`}
                  className="text-sm font-semibold text-primary-700 hover:underline flex items-center space-x-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{job.companyName}</span>
                </Link>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{job.location}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            {role === 'CANDIDATE' && (
              <button
                onClick={handleBookmarkToggle}
                className={`p-3 rounded-xl border transition-all ${
                  isSaved
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-amber-500'
                }`}
                title={isSaved ? 'Bookmarked' : 'Bookmark job'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}

            {job.status === 'ACTIVE' && (
              <button
                onClick={handleApplyClick}
                className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Apply for this Position</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-600 font-semibold uppercase tracking-wider block mb-1">
              Employment Type
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {job.employmentType.replace(/_/g, ' ')}
            </span>
          </div>
          <div>
            <span className="text-slate-600 font-semibold uppercase tracking-wider block mb-1">
              Experience Level
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {job.experienceLevel} Level
            </span>
          </div>
          <div>
            <span className="text-slate-600 font-semibold uppercase tracking-wider block mb-1">
              Salary Compensation
            </span>
            <span className="font-bold text-emerald-600 text-sm">
              {formatSalary(job.minSalary, job.maxSalary)}
            </span>
          </div>
          <div>
            <span className="text-slate-600 font-semibold uppercase tracking-wider block mb-1">
              Status
            </span>
            <StatusBadge status={job.status} />
          </div>
        </div>

        {/* Job Description & Requirements */}
        <div className="py-8 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Role Overview & Responsibilities</h3>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {job.requirements && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Requirements & Technical Qualifications</h3>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {job.requirements}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Company Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
            About the Hiring Company
          </span>
          <h4 className="text-xl font-bold text-slate-900">{job.companyName}</h4>
          <p className="text-sm text-slate-500 max-w-xl">
            {job.companyLocation || job.location} • Connect directly with engineering hiring managers.
          </p>
        </div>

        <Link
          to={`/companies/${job.companyId}`}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
        >
          <Building2 className="w-4 h-4" />
          <span>View Company Profile</span>
        </Link>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          setApplied(true);
          fetchJob();
        }}
      />
    </div>
  );
};
