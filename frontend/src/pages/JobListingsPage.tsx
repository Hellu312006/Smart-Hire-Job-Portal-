import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JobDto, EmploymentType, ExperienceLevel, PagedResponse } from '../types';
import { jobApi } from '../services/api';
import { JobCard } from '../components/JobCard';
import { TopProgressBar, SkeletonJobCard } from '../components/Loading';
import {
  Search,
  MapPin,
  Filter,
  DollarSign,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

export const JobListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [employmentType, setEmploymentType] = useState<string>(searchParams.get('employmentType') || '');
  const [experienceLevel, setExperienceLevel] = useState<string>(searchParams.get('experienceLevel') || '');
  const [minSalary, setMinSalary] = useState<string>(searchParams.get('minSalary') || '');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<string>('desc');
  const [page, setPage] = useState<number>(0);

  const [data, setData] = useState<PagedResponse<JobDto> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: 9,
        sortBy,
        sortDir,
      };
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (employmentType) params.employmentType = employmentType;
      if (experienceLevel) params.experienceLevel = experienceLevel;
      if (minSalary) params.minSalary = minSalary;

      const res = await jobApi.searchJobs(params);
      setData(res);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, employmentType, experienceLevel, minSalary, sortBy, sortDir]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setEmploymentType('');
    setExperienceLevel('');
    setMinSalary('');
    setSortBy('createdAt');
    setSortDir('desc');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Controls Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-3 rounded-2xl shadow-subtle border border-slate-200 flex flex-col md:flex-row items-center gap-3"
      >
        <div className="flex-1 flex items-center space-x-3 px-3 py-1.5 w-full">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by job title, skill, or keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-200" />

        <div className="flex-1 flex items-center space-x-3 px-3 py-1.5 w-full">
          <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Location or 'Remote'..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-sm font-medium outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex-1 flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <button
            type="submit"
            className="flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Main Content Layout: Sidebar + Job Cards Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter Sidebar (Desktop) */}
        <aside
          className={`w-full lg:w-64 bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Filter className="w-4 h-4 text-primary-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-primary-600 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Employment Type
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'All Types', value: '' },
                { label: 'Full Time', value: 'FULL_TIME' },
                { label: 'Remote', value: 'REMOTE' },
                { label: 'Contract', value: 'CONTRACT' },
                { label: 'Internship', value: 'INTERNSHIP' },
                { label: 'Part Time', value: 'PART_TIME' },
              ].map((item) => (
                <label key={item.value} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="employmentType"
                    checked={employmentType === item.value}
                    onChange={() => {
                      setEmploymentType(item.value);
                      setPage(0);
                    }}
                    className="text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Experience Level
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'All Levels', value: '' },
                { label: 'Entry Level', value: 'ENTRY' },
                { label: 'Mid Level', value: 'MID' },
                { label: 'Senior Level', value: 'SENIOR' },
                { label: 'Lead / Principal', value: 'LEAD' },
              ].map((item) => (
                <label key={item.value} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="experienceLevel"
                    checked={experienceLevel === item.value}
                    onChange={() => {
                      setExperienceLevel(item.value);
                      setPage(0);
                    }}
                    className="text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Salary Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Minimum Salary (USD)
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'Any Salary', value: '' },
                { label: '$50,000+', value: '50000' },
                { label: '$80,000+', value: '80000' },
                { label: '$100,000+', value: '100000' },
                { label: '$130,000+', value: '130000' },
              ].map((item) => (
                <label key={item.value} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="minSalary"
                    checked={minSalary === item.value}
                    onChange={() => {
                      setMinSalary(item.value);
                      setPage(0);
                    }}
                    className="text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Job Results Container */}
        <div className="flex-1 space-y-6 w-full">
          {/* Header Controls: Count & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
            <p className="text-sm text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{data?.totalElements || 0}</span> active job openings
            </p>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDir(dir);
                  setPage(0);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="maxSalary-desc">Salary: High to Low</option>
                <option value="minSalary-asc">Salary: Low to High</option>
              </select>
            </div>
          </div>

          {/* Top Progress Bar when fetching */}
          {loading && <TopProgressBar />}

          {/* Job List Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonJobCard key={n} />
              ))}
            </div>
          ) : data && data.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.content.map((job) => (
                <JobCard key={job.id} job={job} onApplicationSuccess={fetchJobs} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No jobs found matching your criteria</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try broadening your keyword, resetting active filters, or checking back soon for new openings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: data.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    page === i
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                disabled={data.last}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
