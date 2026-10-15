import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { JobDto, CompanyDto } from '../types';
import { jobApi, companyApi, fileHelpers } from '../services/api';
import { JobCard } from '../components/JobCard';
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<JobDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const [jobs, comps] = await Promise.all([
          jobApi.getFeaturedJobs(6),
          companyApi.getAll(),
        ]);
        setFeaturedJobs(jobs);
        setCompanies(comps);
      } catch (err) {
        console.error('Error loading landing page data', err);
      } finally {
        setLoading(false);
      }
    };

    loadLandingData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    navigate(`/jobs?keyword=${encodeURIComponent(cat)}`);
  };

  const categories = [
    'Java & Spring Boot',
    'React & TypeScript',
    'DevOps & Cloud',
    'Full Stack',
    'Kubernetes',
    'Python & AI',
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Soft Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-800/60 border border-primary-700/60 text-primary-200 text-xs font-semibold backdrop-blur-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>Next-Gen Dual-Database Recruitment Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Find High-Impact Roles at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-sky-300 to-emerald-300">
              Innovative Tech Companies
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            SmartHire connects elite engineering talent with premier organizations using real-time search, transparent interview tracking, and dual MySQL & MongoDB synchronization.
          </p>

          {/* Search Box Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-4xl mx-auto bg-white p-2.5 rounded-2xl shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2 text-slate-800"
          >
            <div className="flex-1 flex items-center space-x-3 px-3 py-2 w-full">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm font-medium outline-none placeholder:text-slate-400 bg-transparent"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-slate-200" />

            <div className="flex-1 flex items-center space-x-3 px-3 py-2 w-full">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Location (e.g. San Francisco, Remote)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm font-medium outline-none placeholder:text-slate-400 bg-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all flex items-center justify-center space-x-2 flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Popular Categories */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Trending:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-primary-900 border border-slate-700/80 text-slate-200 hover:text-white transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Verified Openings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Opportunities
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200/60 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Top Companies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
              Enterprise Employers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Top Engineering Organizations Hiring on SmartHire
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Browse companies offering competitive salaries, transparent career ladders, and remote flexibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <Link
                key={comp.id}
                to={`/companies/${comp.id}`}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-start space-x-4 group"
              >
                <img
                  src={fileHelpers.getCompanyLogoUrl({ logoPath: comp.logoPath, name: comp.name })}
                  alt={comp.name}
                  className="w-12 h-12 rounded-xl object-cover bg-white/10 border border-white/10 p-0.5 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors truncate">
                    {comp.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{comp.industry}</p>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{comp.location}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Streamlined Hiring Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            How SmartHire Works
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Engineered for effortless candidate discovery, verified applications, and real-time status visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto font-black text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Build Your Technical Profile</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Upload your PDF resume, specify verified skills, past projects, and experience stored flexibly in MongoDB.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-black text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">1-Click Fast Application</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Apply to active job listings with custom cover letters and instant duplicate protection enforced by MySQL constraints.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto font-black text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Track & Review Feedback</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Receive status updates through recruitment stages and read round-by-round interview feedback directly in your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Supercharge Your Hiring?</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Whether you are an engineer looking for your next career breakthrough or a recruiter seeking top talent, SmartHire is your complete recruitment engine.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register/candidate"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white text-primary-900 hover:bg-slate-100 text-center shadow-md transition-all"
            >
              Sign Up as Candidate
            </Link>
            <Link
              to="/register/recruiter"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-primary-700/80 hover:bg-primary-700 text-white border border-primary-500/50 text-center transition-all"
            >
              Post Jobs as Recruiter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
