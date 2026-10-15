import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CompanyDto, JobDto } from '../types';
import { companyApi, jobApi, fileHelpers } from '../services/api';
import { JobCard } from '../components/JobCard';
import { Building2, Globe, MapPin, Briefcase, ArrowLeft } from 'lucide-react';

export const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyAndJobs = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [comp, jobsRes] = await Promise.all([
          companyApi.getById(Number(id)),
          jobApi.searchJobs({ companyId: Number(id), size: 10 }),
        ]);
        setCompany(comp);
        setJobs(jobsRes.content);
      } catch (err) {
        console.error('Failed to load company', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyAndJobs();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Company Not Found</h2>
        <Link
          to="/companies"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Companies</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/companies"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Companies directory</span>
      </Link>

      {/* Corporate Overview Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-5">
          <img
            src={fileHelpers.getCompanyLogoUrl({ logoPath: company.logoPath, name: company.name })}
            alt={company.name}
            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 p-1 bg-slate-50 flex-shrink-0"
          />
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              {company.industry || 'Technology & Innovation'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {company.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              {company.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{company.location}</span>
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-primary-600 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{company.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Company */}
      {company.description && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-3">
          <h3 className="text-lg font-bold text-slate-900">About {company.name}</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {company.description}
          </p>
        </div>
      )}

      {/* Open Positions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Open Positions at {company.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current active vacancies ({jobs.length})
            </p>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
            No active job openings posted currently. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
};
