import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Role } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { JobListingsPage } from './pages/JobListingsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { CandidateRegisterPage } from './pages/CandidateRegisterPage';
import { RecruiterRegisterPage } from './pages/RecruiterRegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Candidate Dashboard Pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { CandidateProfile } from './pages/candidate/CandidateProfile';
import { CandidateApplications } from './pages/candidate/CandidateApplications';
import { CandidateSavedJobs } from './pages/candidate/CandidateSavedJobs';
import { CandidateSearchHistory } from './pages/candidate/CandidateSearchHistory';

// Recruiter Dashboard Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterJobs } from './pages/recruiter/RecruiterJobs';
import { RecruiterCreateJob } from './pages/recruiter/RecruiterCreateJob';
import { RecruiterApplicants } from './pages/recruiter/RecruiterApplicants';
import { RecruiterCompanyProfile } from './pages/recruiter/RecruiterCompanyProfile';

// Admin Dashboard Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminActivityLogs } from './pages/admin/AdminActivityLogs';

// Protected Route Guard
const ProtectedRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role={role} />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobListingsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/candidate" element={<CandidateRegisterPage />} />
        <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Candidate Protected Portal */}
      <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/applications" element={<CandidateApplications />} />
        <Route path="/candidate/saved-jobs" element={<CandidateSavedJobs />} />
        <Route path="/candidate/search-history" element={<CandidateSearchHistory />} />
      </Route>

      {/* Recruiter Protected Portal */}
      <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/create-job" element={<RecruiterCreateJob />} />
        <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
        <Route path="/recruiter/company" element={<RecruiterCompanyProfile />} />
      </Route>

      {/* Admin Protected Portal */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
      </Route>
    </Routes>
  );
};

export default App;
