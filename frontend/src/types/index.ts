export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' | 'INTERNSHIP';

export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';

export type JobStatus = 'ACTIVE' | 'CLOSED';

export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'ACCEPTED';

export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  profileImagePath?: string | null;
  enabled: boolean;
}

export interface CompanyDto {
  id: number;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  logoPath?: string | null;
  recruiterId?: number;
}

export interface JobDto {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo?: string | null;
  companyLocation?: string;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  createdAt: string;
  applicantCount?: number;
  saved?: boolean;
}

export interface ApplicationDto {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  companyLogo?: string | null;
  jobLocation?: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  candidateHeadline?: string;
  status: ApplicationStatus;
  resumePath?: string | null;
  coverLetter?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  techStack?: string;
  projectUrl?: string;
}

export interface CertificationItem {
  name: string;
  issuingOrganization: string;
  issueDate?: string;
}

export interface CandidateProfileDocument {
  id?: string;
  userId: number;
  headline?: string;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  resumeMetadata?: Record<string, any>;
  preferredLocations: string[];
  preferredEmploymentTypes: string[];
  updatedAt?: string;
}

export interface InterviewFeedbackDocument {
  id?: string;
  applicationId: number;
  reviewerId: number;
  reviewerName: string;
  interviewRound: string;
  topics: string[];
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface SearchHistoryDocument {
  id?: string;
  userId: number;
  keyword?: string;
  location?: string;
  filters?: Record<string, any>;
  searchedAt: string;
}

export interface ActivityLogDocument {
  id?: string;
  userId: number;
  userEmail: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface CandidateDashboardDto {
  profileCompleteness: number;
  totalApplications: number;
  shortlistedApplications: number;
  rejectedApplications: number;
  savedJobsCount: number;
  recentApplications: ApplicationDto[];
  recommendedJobs: JobDto[];
}

export interface RecruiterDashboardDto {
  activeJobs: number;
  totalApplicants: number;
  shortlistedCount: number;
  rejectedCount: number;
  applicationsByStatus: Record<string, number>;
  recentApplicants: ApplicationDto[];
  activeJobList: JobDto[];
}

export interface AdminDashboardDto {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalCompanies: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
  recentActivityLogs: ActivityLogDocument[];
  recentUsers: UserDto[];
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: UserDto;
}
