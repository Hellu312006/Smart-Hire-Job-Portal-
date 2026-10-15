import React, { useState, useEffect } from 'react';
import { CompanyDto } from '../../types';
import { recruiterApi, fileHelpers } from '../../services/api';
import { Building2, Globe, MapPin, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const RecruiterCompanyProfile: React.FC = () => {
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const fetchCompany = async () => {
    try {
      const data = await recruiterApi.getCompany();
      setCompany(data);
      setName(data.name || '');
      setIndustry(data.industry || '');
      setWebsite(data.website || '');
      setLocation(data.location || '');
      setDescription(data.description || '');
    } catch (err) {
      console.error('Failed to load company profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const path = await recruiterApi.uploadLogo(formData);
        if (company) setCompany({ ...company, logoPath: path });
        setSuccessMsg('Company brand logo uploaded successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to upload logo');
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await recruiterApi.updateCompany({
        name,
        industry,
        website,
        location,
        description,
      });
      setCompany(updated);
      setSuccessMsg('Company profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Manage Company Profile</h1>
        <p className="text-xs text-slate-500">
          This corporate branding appears on all your job postings and search listings.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Logo Upload Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-5">
        <div className="relative">
          <img
            src={fileHelpers.getCompanyLogoUrl({ logoPath: company?.logoPath, name: company?.name })}
            alt={company?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 p-0.5 bg-slate-50"
          />
          <label
            htmlFor="companyLogoUpload"
            className="absolute -bottom-2 -right-2 p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
            title="Upload brand logo"
          >
            <Camera className="w-4 h-4" />
            <input
              type="file"
              id="companyLogoUpload"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{company?.name}</h3>
          <p className="text-xs text-slate-500">{company?.industry || 'Technology'}</p>
          <p className="text-[11px] text-primary-600 mt-1 font-semibold">
            PNG, JPEG, WebP up to 5MB (Square ratio recommended)
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Industry Domain
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Enterprise Cloud Computing"
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Headquarters Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Austin, TX"
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Company Website URL
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Company Bio & Culture
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share details about what makes working at your company exceptional..."
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 disabled:opacity-50 transition-all"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? 'Saving...' : 'Update Corporate Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
