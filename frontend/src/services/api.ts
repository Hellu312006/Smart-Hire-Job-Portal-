import axios from 'axios';
import {
  ApiResponse,
  AuthResponse,
  CandidateDashboardDto,
  CandidateProfileDocument,
  CompanyDto,
  InterviewFeedbackDocument,
  JobDto,
  PagedResponse,
  RecruiterDashboardDto,
  AdminDashboardDto,
  SearchHistoryDocument,
  UserDto,
  ActivityLogDocument,
  ApplicationDto
} from '../types';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smarthire_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and on a dashboard route, clear expired token
      if (window.location.pathname.includes('/candidate') ||
          window.location.pathname.includes('/recruiter') ||
          window.location.pathname.includes('/admin')) {
        localStorage.removeItem('smarthire_token');
        localStorage.removeItem('smarthire_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data.data;
  },
  registerCandidate: async (data: any): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register/candidate', data);
    return res.data.data;
  },
  registerRecruiter: async (data: any): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register/recruiter', data);
    return res.data.data;
  },
  getCurrentUser: async (): Promise<UserDto> => {
    const res = await api.get<ApiResponse<UserDto>>('/auth/me');
    return res.data.data;
  },
};

export const jobApi = {
  searchJobs: async (params: any = {}): Promise<PagedResponse<JobDto>> => {
    const res = await api.get<ApiResponse<PagedResponse<JobDto>>>('/jobs', { params });
    return res.data.data;
  },
  getJobById: async (id: number): Promise<JobDto> => {
    const res = await api.get<ApiResponse<JobDto>>(`/jobs/${id}`);
    return res.data.data;
  },
  getFeaturedJobs: async (limit = 6): Promise<JobDto[]> => {
    const res = await api.get<ApiResponse<JobDto[]>>('/jobs/featured', { params: { limit } });
    return res.data.data;
  },
  createJob: async (data: any): Promise<JobDto> => {
    const res = await api.post<ApiResponse<JobDto>>('/jobs', data);
    return res.data.data;
  },
  updateJob: async (id: number, data: any): Promise<JobDto> => {
    const res = await api.put<ApiResponse<JobDto>>(`/jobs/${id}`, data);
    return res.data.data;
  },
  patchJobStatus: async (id: number, status: string): Promise<JobDto> => {
    const res = await api.patch<ApiResponse<JobDto>>(`/jobs/${id}/status`, null, { params: { status } });
    return res.data.data;
  },
  deleteJob: async (id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },
};

export const candidateApi = {
  getDashboard: async (): Promise<CandidateDashboardDto> => {
    const res = await api.get<ApiResponse<CandidateDashboardDto>>('/candidate/dashboard');
    return res.data.data;
  },
  getProfile: async (): Promise<CandidateProfileDocument> => {
    const res = await api.get<ApiResponse<CandidateProfileDocument>>('/candidate/profile');
    return res.data.data;
  },
  updateProfile: async (data: any): Promise<CandidateProfileDocument> => {
    const res = await api.put<ApiResponse<CandidateProfileDocument>>('/candidate/profile', data);
    return res.data.data;
  },
  uploadPhoto: async (formData: FormData): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/candidate/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  uploadResume: async (formData: FormData): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/candidate/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  applyForJob: async (jobId: number, formData: FormData): Promise<ApplicationDto> => {
    const res = await api.post<ApiResponse<ApplicationDto>>(`/candidate/jobs/${jobId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  getApplications: async (page = 0, size = 10): Promise<PagedResponse<ApplicationDto>> => {
    const res = await api.get<ApiResponse<PagedResponse<ApplicationDto>>>('/candidate/applications', { params: { page, size } });
    return res.data.data;
  },
  getSavedJobs: async (page = 0, size = 10): Promise<PagedResponse<JobDto>> => {
    const res = await api.get<ApiResponse<PagedResponse<JobDto>>>('/candidate/saved-jobs', { params: { page, size } });
    return res.data.data;
  },
  saveJob: async (jobId: number): Promise<void> => {
    await api.post(`/candidate/saved-jobs/${jobId}`);
  },
  unsaveJob: async (jobId: number): Promise<void> => {
    await api.delete(`/candidate/saved-jobs/${jobId}`);
  },
  getSearchHistory: async (): Promise<SearchHistoryDocument[]> => {
    const res = await api.get<ApiResponse<SearchHistoryDocument[]>>('/candidate/search-history');
    return res.data.data;
  },
  getInterviewFeedback: async (applicationId: number): Promise<InterviewFeedbackDocument[]> => {
    const res = await api.get<ApiResponse<InterviewFeedbackDocument[]>>(`/candidate/interview-feedback/${applicationId}`);
    return res.data.data;
  },
};

export const recruiterApi = {
  getDashboard: async (): Promise<RecruiterDashboardDto> => {
    const res = await api.get<ApiResponse<RecruiterDashboardDto>>('/recruiter/dashboard');
    return res.data.data;
  },
  getCompany: async (): Promise<CompanyDto> => {
    const res = await api.get<ApiResponse<CompanyDto>>('/recruiter/company');
    return res.data.data;
  },
  updateCompany: async (data: any): Promise<CompanyDto> => {
    const res = await api.put<ApiResponse<CompanyDto>>('/recruiter/company', data);
    return res.data.data;
  },
  uploadLogo: async (formData: FormData): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/recruiter/company/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  getPostedJobs: async (page = 0, size = 10): Promise<PagedResponse<JobDto>> => {
    const res = await api.get<ApiResponse<PagedResponse<JobDto>>>('/recruiter/jobs', { params: { page, size } });
    return res.data.data;
  },
  getJobApplications: async (jobId: number, page = 0, size = 10): Promise<PagedResponse<ApplicationDto>> => {
    const res = await api.get<ApiResponse<PagedResponse<ApplicationDto>>>(`/recruiter/jobs/${jobId}/applications`, { params: { page, size } });
    return res.data.data;
  },
  getAllApplications: async (page = 0, size = 10): Promise<PagedResponse<ApplicationDto>> => {
    const res = await api.get<ApiResponse<PagedResponse<ApplicationDto>>>('/recruiter/applications', { params: { page, size } });
    return res.data.data;
  },
  updateApplicationStatus: async (applicationId: number, status: string, comment?: string): Promise<ApplicationDto> => {
    const res = await api.patch<ApiResponse<ApplicationDto>>(`/recruiter/applications/${applicationId}/status`, { status, comment });
    return res.data.data;
  },
  getCandidateProfile: async (candidateId: number): Promise<CandidateProfileDocument> => {
    const res = await api.get<ApiResponse<CandidateProfileDocument>>(`/recruiter/candidates/${candidateId}/profile`);
    return res.data.data;
  },
  addInterviewFeedback: async (feedback: any): Promise<InterviewFeedbackDocument> => {
    const res = await api.post<ApiResponse<InterviewFeedbackDocument>>('/recruiter/interview-feedback', feedback);
    return res.data.data;
  },
};

export const adminApi = {
  getDashboard: async (): Promise<AdminDashboardDto> => {
    const res = await api.get<ApiResponse<AdminDashboardDto>>('/admin/dashboard');
    return res.data.data;
  },
  getUsers: async (page = 0, size = 15): Promise<PagedResponse<UserDto>> => {
    const res = await api.get<ApiResponse<PagedResponse<UserDto>>>('/admin/users', { params: { page, size } });
    return res.data.data;
  },
  toggleUserStatus: async (userId: number): Promise<UserDto> => {
    const res = await api.patch<ApiResponse<UserDto>>(`/admin/users/${userId}/toggle-status`);
    return res.data.data;
  },
  getActivityLogs: async (page = 0, size = 20): Promise<PagedResponse<ActivityLogDocument>> => {
    const res = await api.get<ApiResponse<any>>('/admin/logs', { params: { page, size } });
    return res.data.data;
  },
};

export const companyApi = {
  getAll: async (): Promise<CompanyDto[]> => {
    const res = await api.get<ApiResponse<CompanyDto[]>>('/companies');
    return res.data.data;
  },
  getById: async (id: number): Promise<CompanyDto> => {
    const res = await api.get<ApiResponse<CompanyDto>>(`/companies/${id}`);
    return res.data.data;
  },
};

export const fileHelpers = {
  getAvatarUrl: (user?: { profileImagePath?: string | null; fullName?: string }): string => {
    if (user?.profileImagePath) {
      return `${API_BASE_URL}/files/download/${user.profileImagePath}`;
    }
    const name = encodeURIComponent(user?.fullName || 'User');
    return `${API_BASE_URL}/files/placeholder/avatar/${name}`;
  },
  getCompanyLogoUrl: (company?: { logoPath?: string | null; name?: string }): string => {
    if (company?.logoPath) {
      return `${API_BASE_URL}/files/download/${company.logoPath}`;
    }
    const name = encodeURIComponent(company?.name || 'Company');
    return `${API_BASE_URL}/files/placeholder/logo/${name}`;
  },
  getResumeDownloadUrl: (applicationId: number): string => {
    return `${API_BASE_URL}/files/applications/${applicationId}/resume`;
  },
};

export default api;
