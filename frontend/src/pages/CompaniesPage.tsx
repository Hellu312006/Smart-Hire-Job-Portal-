import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CompanyDto } from '../types';
import { companyApi, fileHelpers } from '../services/api';
import { Building2, MapPin, Globe, ArrowRight, Search } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyApi.getAll();
        setCompanies(data);
      } catch (err) {
        console.error('Failed to load companies', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.industry && c.industry.toLowerCase().includes(search.toLowerCase())) ||
      (c.location && c.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
          Partner Directory
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Explore Hiring Companies
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Discover top startups and enterprise organizations actively recruiting on SmartHire.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by company name, industry, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 shadow-subtle"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => (
            <Link
              key={comp.id}
              to={`/companies/${comp.id}`}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-hover hover:border-primary-300 card-hover flex flex-col justify-between transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={fileHelpers.getCompanyLogoUrl({ logoPath: comp.logoPath, name: comp.name })}
                    alt={comp.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100 p-0.5 bg-slate-50 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors truncate">
                      {comp.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary-600 truncate mt-0.5">
                      {comp.industry || 'Technology'}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{comp.location || 'Multiple Locations'}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {comp.description || 'Leading technology and software solutions company.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:text-primary-700">
                <span>View Open Positions</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
