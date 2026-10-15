import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CandidateProfileDocument } from '../../types';
import { candidateApi, fileHelpers } from '../../services/api';
import {
  User,
  Camera,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
} from 'lucide-react';

export const CandidateProfile: React.FC = () => {
  const { user, updateUserContext } = useAuth();
  const [profile, setProfile] = useState<CandidateProfileDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form local state
  const [headline, setHeadline] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');

  // Experience state
  const [experience, setExperience] = useState<CandidateProfileDocument['experience']>([]);
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpDuration, setNewExpDuration] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  // Education state
  const [education, setEducation] = useState<CandidateProfileDocument['education']>([]);
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduSchool, setNewEduSchool] = useState('');
  const [newEduYear, setNewEduYear] = useState('');

  // Projects state
  const [projects, setProjects] = useState<CandidateProfileDocument['projects']>([]);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  // Certifications state
  const [certifications, setCertifications] = useState<CandidateProfileDocument['certifications']>([]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertOrg, setNewCertOrg] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await candidateApi.getProfile();
      setProfile(data);
      setHeadline(data.headline || '');
      setSkills(data.skills || []);
      setPreferredLocations(data.preferredLocations || []);
      setExperience(data.experience || []);
      setEducation(data.education || []);
      setProjects(data.projects || []);
      setCertifications(data.certifications || []);
    } catch (err) {
      console.error('Failed to load candidate profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const path = await candidateApi.uploadPhoto(formData);
        updateUserContext({ profileImagePath: path });
        setSuccessMsg('Profile photo updated successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to upload photo');
      }
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        await candidateApi.uploadResume(formData);
        await fetchProfile();
        setSuccessMsg('Resume PDF uploaded and indexed successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to upload resume');
      }
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addLocation = () => {
    if (newLocation.trim() && !preferredLocations.includes(newLocation.trim())) {
      setPreferredLocations([...preferredLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const removeLocation = (locToRemove: string) => {
    setPreferredLocations(preferredLocations.filter((l) => l !== locToRemove));
  };

  const addExperienceItem = () => {
    if (newExpCompany.trim() && newExpRole.trim()) {
      setExperience([
        ...experience,
        {
          company: newExpCompany.trim(),
          role: newExpRole.trim(),
          duration: newExpDuration.trim(),
          description: newExpDesc.trim(),
        },
      ]);
      setNewExpCompany('');
      setNewExpRole('');
      setNewExpDuration('');
      setNewExpDesc('');
    }
  };

  const removeExperienceItem = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducationItem = () => {
    if (newEduDegree.trim() && newEduSchool.trim()) {
      setEducation([
        ...education,
        {
          degree: newEduDegree.trim(),
          institution: newEduSchool.trim(),
          year: newEduYear.trim(),
        },
      ]);
      setNewEduDegree('');
      setNewEduSchool('');
      setNewEduYear('');
    }
  };

  const removeEducationItem = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addProjectItem = () => {
    if (newProjTitle.trim()) {
      setProjects([
        ...projects,
        {
          title: newProjTitle.trim(),
          techStack: newProjTech.trim(),
          description: newProjDesc.trim(),
        },
      ]);
      setNewProjTitle('');
      setNewProjTech('');
      setNewProjDesc('');
    }
  };

  const removeProjectItem = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        headline,
        skills,
        preferredLocations,
        experience,
        education,
        projects,
        certifications,
      };

      await candidateApi.updateProfile(payload);
      setSuccessMsg('Comprehensive candidate profile saved in MongoDB!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading candidate profile...</p>
      </div>
    );
  }

  const resumeMeta = profile?.resumeMetadata;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Manage Candidate Profile</h1>
        <p className="text-xs text-slate-500">
          Your profile is indexed across MongoDB collections to deliver rich technical portfolios to recruiters.
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

      {/* Top Media Row: Profile Photo & Resume Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex items-center space-x-5">
          <div className="relative">
            <img
              src={fileHelpers.getAvatarUrl(user || undefined)}
              alt={user?.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 p-0.5 bg-slate-50"
            />
            <label
              htmlFor="photoUpload"
              className="absolute -bottom-2 -right-2 p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full cursor-pointer shadow-md transition-transform hover:scale-110"
              title="Upload new photo"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                id="photoUpload"
                accept="image/png, image/jpeg, image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{user?.fullName}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-[11px] text-primary-600 mt-1 font-semibold">
              JPEG, PNG, WebP up to 5MB
            </p>
          </div>
        </div>

        {/* Resume Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Curriculum Vitae (PDF)</h4>
                <p className="text-xs text-slate-500">
                  {resumeMeta?.fileName || 'No resume uploaded yet'}
                </p>
                {resumeMeta?.uploadedAt && (
                  <p className="text-[10px] text-slate-400">
                    Uploaded: {new Date(resumeMeta.uploadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <label
              htmlFor="resumeDocUpload"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors"
            >
              Upload PDF
              <input
                type="file"
                id="resumeDocUpload"
                accept="application/pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Core Headline & Preferred Locations
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full Stack Java Engineer | Microservices Specialist"
              className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Preferred Work Locations
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {preferredLocations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => removeLocation(loc)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="flex-1 text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addLocation}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Skills Tag Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Technical Skills (Stored as Array in MongoDB)
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-primary-400 hover:text-rose-600 ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. Java 21, Spring Boot, React, Docker..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="flex-1 text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-primary-600 text-white hover:bg-primary-700"
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              <h3 className="text-base font-bold text-slate-900">Work Experience</h3>
            </div>
          </div>

          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                  <p className="text-xs font-semibold text-primary-600">{exp.company} • {exp.duration}</p>
                  <p className="text-xs text-slate-500 mt-1">{exp.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeExperienceItem(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add experience inputs */}
          <div className="p-4 rounded-xl border border-dashed border-slate-200 space-y-3">
            <p className="text-xs font-bold uppercase text-slate-500">Add Position</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Company Name"
                value={newExpCompany}
                onChange={(e) => setNewExpCompany(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
              <input
                type="text"
                placeholder="Job Role (e.g. Software Engineer)"
                value={newExpRole}
                onChange={(e) => setNewExpRole(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 2022 - 2024)"
                value={newExpDuration}
                onChange={(e) => setNewExpDuration(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Key accomplishments and technologies..."
              value={newExpDesc}
              onChange={(e) => setNewExpDesc(e.target.value)}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none"
            />
            <button
              type="button"
              onClick={addExperienceItem}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </button>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-5 h-5 text-primary-600" />
            <h3 className="text-base font-bold text-slate-900">Education History</h3>
          </div>

          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                  <p className="text-xs text-slate-600">{edu.institution} ({edu.year})</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeEducationItem(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-200 space-y-3">
            <p className="text-xs font-bold uppercase text-slate-500">Add Academic Record</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Degree (e.g. BE Computer Engineering)"
                value={newEduDegree}
                onChange={(e) => setNewEduDegree(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
              <input
                type="text"
                placeholder="University / College"
                value={newEduSchool}
                onChange={(e) => setNewEduSchool(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
              <input
                type="text"
                placeholder="Graduation Year"
                value={newEduYear}
                onChange={(e) => setNewEduYear(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addEducationItem}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>
        </div>

        {/* Save Changes Floating Action */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 disabled:opacity-50 transition-all"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? 'Saving to Database...' : 'Save Complete Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
