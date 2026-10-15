import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fileHelpers } from '../services/api';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  History,
  PlusCircle,
  Users,
  Building2,
  Activity,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const candidateLinks = [
    { to: '/candidate/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/candidate/profile', label: 'My Profile', icon: User },
    { to: '/candidate/applications', label: 'My Applications', icon: Briefcase },
    { to: '/candidate/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
    { to: '/candidate/search-history', label: 'Search History', icon: History },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/recruiter/create-job', label: 'Post a Job', icon: PlusCircle },
    { to: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/recruiter/applicants', label: 'All Applicants', icon: Users },
    { to: '/recruiter/company', label: 'Company Profile', icon: Building2 },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Platform Stats', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/activity-logs', label: 'Live Audit Logs', icon: Activity },
  ];

  const links = role === 'CANDIDATE' ? candidateLinks : role === 'RECRUITER' ? recruiterLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 sticky top-16">
      <div className="space-y-6">
        {/* User Mini Profile Card */}
        {user && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
            <img
              src={fileHelpers.getAvatarUrl(user)}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-primary-600" />
                <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20'
                        : 'text-slate-600 hover:text-primary-800 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                        <span>{link.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout & Footer Link */}
      <div className="pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
