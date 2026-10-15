import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApplicationDto, ApplicationStatus, CandidateProfileDocument } from '../../types';
import { recruiterApi, fileHelpers } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Users,
  FileText,
  Download,
  Eye,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Star,
  X,
  Building2,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const RecruiterApplicants: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedJobId = searchParams.get('jobId');

  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Candidate Profile Modal state (fetching from MongoDB)
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<CandidateProfileDocument | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Interview Feedback Modal state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackAppId, setFeedbackAppId] = useState<number | null>(null);
  const [interviewRound, setInterviewRound] = useState('Technical Round 1');
  const [rating, setRating] = useState(5);
  const [topicsStr, setTopicsStr] = useState('Java, Spring Boot, System Design');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Cover Letter Modal
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      if (selectedJobId) {
        const res = await recruiterApi.getJobApplications(Number(selectedJobId), 0, 100);
        setApplications(res.content);
      } else {
        const res = await recruiterApi.getAllApplications(0, 100);
        setApplications(res.content);
      }
    } catch (err) {
      console.error('Failed to load applicants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId]);

  const handleStatusChange = async (appId: number, newStatus: string) => {
    try {
      await recruiterApi.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus as ApplicationStatus } : a))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleInspectProfile = async (candidateId: number) => {
    setProfileLoading(true);
    setProfileModalOpen(true);
    try {
      const doc = await recruiterApi.getCandidateProfile(candidateId);
      setSelectedCandidateProfile(doc);
    } catch (err) {
      console.error('Failed to fetch candidate profile from MongoDB', err);
      setSelectedCandidateProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleOpenFeedbackModal = (appId: number) => {
    setFeedbackAppId(appId);
    setFeedbackModalOpen(true);
    setFeedbackSuccess(false);
    setFeedbackComments('');
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackAppId) return;

    setSubmittingFeedback(true);
    try {
      const topics = topicsStr.split(',').map((t) => t.trim()).filter(Boolean);
      await recruiterApi.addInterviewFeedback({
        applicationId: feedbackAppId,
        interviewRound,
        rating,
        topics,
        feedback: feedbackComments,
      });

      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to save interview feedback', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading candidate applicants...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Applicant Tracking System (ATS)</h1>
        <p className="text-xs text-slate-500">
          Review candidate resumes, evaluate MongoDB extended profiles, update statuses, and log interview feedback.
        </p>
      </div>

      {applications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Applied Role</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status Progression</th>
                  <th className="py-4 px-6">Resume & Cover</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Candidate */}
                    <td className="py-4 px-6">
                      <div>
                        <button
                          onClick={() => handleInspectProfile(app.candidateId)}
                          className="font-bold text-slate-900 hover:text-primary-600 text-left flex items-center space-x-1"
                        >
                          <span>{app.candidateName}</span>
                          <Eye className="w-3.5 h-3.5 text-primary-500 ml-1" />
                        </button>
                        <p className="text-[11px] text-slate-500">{app.candidateEmail}</p>
                      </div>
                    </td>

                    {/* Applied Role */}
                    <td className="py-4 px-6 text-slate-800 font-semibold">
                      {app.jobTitle}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>

                    {/* Resume & Cover Letter */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {app.resumePath ? (
                          <a
                            href={fileHelpers.getResumeDownloadUrl(app.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            title="Download PDF Resume"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Resume</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No file</span>
                        )}

                        {app.coverLetter && (
                          <button
                            onClick={() => setSelectedCoverLetter(app.coverLetter || '')}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="View Cover Letter"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleInspectProfile(app.candidateId)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleOpenFeedbackModal(app.id)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Feedback</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No applicants found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Candidates who apply to your posted jobs will appear in this review table.
          </p>
        </div>
      )}

      {/* Candidate Profile Modal (MongoDB deep dive) */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {profileLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Fetching candidate document from MongoDB...
              </div>
            ) : selectedCandidateProfile ? (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                    MongoDB Candidate Profile
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedCandidateProfile.headline || 'Full Stack Engineer'}
                  </h3>
                </div>

                {/* Technical Skills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Verified Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidateProfile.skills?.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Work Experience */}
                {selectedCandidateProfile.experience && selectedCandidateProfile.experience.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Professional Experience
                    </h4>
                    <div className="space-y-2">
                      {selectedCandidateProfile.experience.map((exp, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{exp.role} at {exp.company}</p>
                          <p className="text-[11px] text-slate-400 font-semibold">{exp.duration}</p>
                          <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedCandidateProfile.education && selectedCandidateProfile.education.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Education
                    </h4>
                    <div className="space-y-2">
                      {selectedCandidateProfile.education.map((edu, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{edu.degree}</p>
                          <p className="text-xs text-slate-500">{edu.institution} ({edu.year})</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No MongoDB profile details found for this candidate.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Cover Letter Modal */}
      {selectedCoverLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedCoverLetter(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900">Candidate Cover Letter</h3>
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100 max-h-80 overflow-y-auto">
              {selectedCoverLetter}
            </div>
          </div>
        </div>
      )}

      {/* Interview Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                Evaluation Notes
              </span>
              <h3 className="text-xl font-bold text-slate-900">Record Interview Feedback</h3>
              <p className="text-xs text-slate-500">
                Stored in MongoDB `interview_feedback` collection and shared transparently.
              </p>
            </div>

            {feedbackSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">Feedback Logged in MongoDB!</h4>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Interview Round *
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewRound}
                    onChange={(e) => setInterviewRound(e.target.value)}
                    placeholder="e.g. Technical Round 1 - Java & Concurrency"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Candidate Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Evaluated Topics (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={topicsStr}
                    onChange={(e) => setTopicsStr(e.target.value)}
                    placeholder="Java 21, Spring Boot, MySQL Indexing, System Design"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Detailed Interviewer Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="Describe candidate performance, strengths, architecture skills, and hire recommendation..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {submittingFeedback && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{submittingFeedback ? 'Saving...' : 'Save Feedback'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
