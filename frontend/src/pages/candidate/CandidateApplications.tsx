import React, { useState, useEffect } from 'react';
import { ApplicationDto, InterviewFeedbackDocument } from '../../types';
import { candidateApi, fileHelpers } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Briefcase,
  FileText,
  MessageSquare,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  X,
  ExternalLink,
} from 'lucide-react';

export const CandidateApplications: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback modal
  const [selectedAppFeedback, setSelectedAppFeedback] = useState<InterviewFeedbackDocument[] | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Cover letter modal
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const res = await candidateApi.getApplications(0, 50);
      setApplications(res.content);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewFeedback = async (appId: number) => {
    setFeedbackLoading(true);
    setFeedbackModalOpen(true);
    try {
      const feedback = await candidateApi.getInterviewFeedback(appId);
      setSelectedAppFeedback(feedback);
    } catch (err) {
      console.error('Failed to load interview feedback', err);
      setSelectedAppFeedback([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 1;
      case 'UNDER_REVIEW':
        return 2;
      case 'SHORTLISTED':
        return 3;
      case 'INTERVIEW_SCHEDULED':
        return 4;
      case 'ACCEPTED':
        return 5;
      case 'REJECTED':
        return -1;
      default:
        return 1;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Application Status Tracker</h1>
        <p className="text-xs text-slate-500">
          Monitor your recruitment journey and review feedback submitted by hiring managers.
        </p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => {
            const stepIndex = getStatusStepIndex(app.status);
            const isRejected = app.status === 'REJECTED';

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle hover:shadow-card transition-all space-y-6"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={fileHelpers.getCompanyLogoUrl({ logoPath: app.companyLogo, name: app.companyName })}
                      alt={app.companyName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 p-0.5 bg-slate-50"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{app.jobTitle}</h3>
                      <p className="text-xs text-slate-500 font-semibold flex items-center space-x-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.companyName}</span>
                        <span>•</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <StatusBadge status={app.status} />

                    <button
                      onClick={() => handleViewFeedback(app.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Interview Feedback</span>
                    </button>
                  </div>
                </div>

                {/* Visual Recruitment Stage Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 relative">
                    {[
                      { step: 1, label: 'Applied' },
                      { step: 2, label: 'In Review' },
                      { step: 3, label: 'Shortlisted' },
                      { step: 4, label: 'Interview' },
                      { step: 5, label: isRejected ? 'Rejected' : 'Accepted' },
                    ].map((s) => {
                      const isComplete = !isRejected && stepIndex >= s.step;
                      const isCurrent = !isRejected && stepIndex === s.step;
                      const isThisRejected = isRejected && s.step === 5;

                      return (
                        <div key={s.step} className="text-center space-y-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                              isThisRejected
                                ? 'bg-rose-100 text-rose-700 border-2 border-rose-500'
                                : isComplete
                                ? 'bg-primary-600 text-white shadow-sm'
                                : isCurrent
                                ? 'bg-primary-100 text-primary-800 border-2 border-primary-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isThisRejected ? (
                              <XCircle className="w-4 h-4" />
                            ) : isComplete ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              s.step
                            )}
                          </div>
                          <p
                            className={`text-[11px] font-semibold ${
                              isThisRejected
                                ? 'text-rose-600'
                                : isComplete
                                ? 'text-primary-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {s.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Application Actions / Cover Letter preview */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-3">
                    {app.coverLetter && (
                      <button
                        onClick={() => setSelectedCoverLetter(app.coverLetter || '')}
                        className="text-slate-600 hover:text-primary-600 flex items-center space-x-1 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Cover Letter</span>
                      </button>
                    )}

                    {app.resumePath && (
                      <a
                        href={fileHelpers.getResumeDownloadUrl(app.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-600 hover:text-primary-600 flex items-center space-x-1 font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Attached Resume</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our curated job listings to apply for roles matching your engineering skillset.
          </p>
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
            <h3 className="text-base font-bold text-slate-900">Your Submitted Cover Letter</h3>
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100 max-h-80 overflow-y-auto">
              {selectedCoverLetter}
            </div>
          </div>
        </div>
      )}

      {/* Interview Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                Evaluation Notes
              </span>
              <h3 className="text-lg font-bold text-slate-900">Interview Feedback & Ratings</h3>
              <p className="text-xs text-slate-500">
                Data directly synced from the recruiter's assessment in MongoDB.
              </p>
            </div>

            {feedbackLoading ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Loading feedback documents...
              </div>
            ) : selectedAppFeedback && selectedAppFeedback.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {selectedAppFeedback.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.interviewRound}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Reviewer: {item.reviewerName}
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {item.topics && item.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 py-1">
                        {item.topics.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-100 text-primary-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-100">
                      "{item.feedback}"
                    </p>

                    <p className="text-[10px] text-slate-400 text-right">
                      Logged {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                No formal feedback notes recorded yet for this application round.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
