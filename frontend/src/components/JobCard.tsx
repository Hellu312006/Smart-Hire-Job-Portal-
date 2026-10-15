import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { JobDto } from '../types';
import { useAuth } from '../context/AuthContext';
import { candidateApi, fileHelpers } from '../services/api';
import { StatusBadge } from './StatusBadge';
import { ApplyModal } from './ApplyModal';
import { MapPin, DollarSign, Calendar, Bookmark, Building2, Send } from 'lucide-react';

interface JobCardProps {
  job: JobDto;
  onBookmarkToggle?: (jobId: number, isSaved: boolean) => void;
  onApplicationSuccess?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onBookmarkToggle, onApplicationSuccess }) => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(job.saved || false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login?redirect=/jobs');
      return;
    }

    if (role !== 'CANDIDATE') return;

    try {
      if (isSaved) {
        await candidateApi.unsaveJob(job.id);
        setIsSaved(false);
        if (onBookmarkToggle) onBookmarkToggle(job.id, false);
      } else {
        await candidateApi.saveJob(job.id);
        setIsSaved(true);
        if (onBookmarkToggle) onBookmarkToggle(job.id, true);
      }
    } catch (err) {
      console.error('Error toggling bookmark', err);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login?redirect=/jobs');
      return;
    }

    if (role !== 'CANDIDATE') {
      alert('Only registered candidates can submit applications.');
      return;
    }

    setIsApplyModalOpen(true);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k / yr`;
    if (min) return `From $${(min / 1000).toFixed(0)}k / yr`;
    return `Up to $${((max || 0) / 1000).toFixed(0)}k / yr`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-hover hover:border-primary-300 card-hover flex flex-col justify-between transition-all group">
        <div>
          {/* Header Row: Company Logo & Bookmark */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center space-x-3">
              <img
                src={fileHelpers.getCompanyLogoUrl({ logoPath: job.companyLogo, name: job.companyName })}
                alt={job.companyName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-100 p-0.5 bg-slate-50 flex-shrink-0"
              />
              <div className="min-w-0">
                <Link
                  to={`/companies/${job.companyId}`}
                  className="text-xs font-semibold text-slate-500 hover:text-primary-600 flex items-center space-x-1 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{job.companyName}</span>
                </Link>
                <Link to={`/jobs/${job.id}`}>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                </Link>
              </div>
            </div>

            {role === 'CANDIDATE' && (
              <button
                onClick={handleBookmark}
                title={isSaved ? 'Remove bookmark' : 'Save job'}
                className={`p-2 rounded-xl border transition-all ${
                  isSaved
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
              {job.employmentType.replace(/_/g, ' ')}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 text-primary-700">
              {job.experienceLevel} Level
            </span>
            <StatusBadge status={job.status} />
          </div>

          {/* Key Details Row: Location & Salary */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium py-2.5 border-y border-slate-100 my-3">
            <div className="flex items-center space-x-1.5 truncate">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center space-x-1.5 truncate">
              <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="truncate">{formatSalary(job.minSalary, job.maxSalary)}</span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        </div>

        {/* Footer Actions: Posted Date & Apply */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(job.createdAt)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/jobs/${job.id}`}
              className="px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-primary-700 hover:bg-slate-50 transition-colors"
            >
              Details
            </Link>

            {job.status === 'ACTIVE' && (
              <button
                onClick={handleApplyClick}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm shadow-primary-600/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          if (onApplicationSuccess) onApplicationSuccess();
        }}
      />
    </>
  );
};
