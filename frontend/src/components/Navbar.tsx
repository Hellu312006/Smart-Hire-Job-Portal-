import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fileHelpers } from '../services/api';
import { Briefcase, User, LogOut, LayoutDashboard, Menu, X, ChevronDown, Bookmark, Building2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const getDashboardPath = () => {
    if (role === 'CANDIDATE') return '/candidate/dashboard';
    if (role === 'RECRUITER') return '/recruiter/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-900 to-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-900/10 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-primary-900">
                  Smart<span className="text-primary-600">Hire</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 -mt-1">
                  Enterprise Recruitment
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 pl-6">
              <Link
                to="/jobs"
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Companies
              </Link>
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {role === 'CANDIDATE' && (
                  <Link
                    to="/candidate/saved-jobs"
                    title="Saved Jobs"
                    className="p-2 text-slate-500 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Bookmark className="w-5 h-5" />
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-50 border border-slate-200 transition-all focus:outline-none"
                  >
                    <img
                      src={fileHelpers.getAvatarUrl(user)}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                      {user.fullName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-600 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Dashboard</span>
                      </Link>

                      {role === 'CANDIDATE' && (
                        <Link
                          to="/candidate/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                      )}

                      {role === 'RECRUITER' && (
                        <Link
                          to="/recruiter/company"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                        >
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>Company Profile</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-primary-800 hover:text-primary-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register/candidate"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-sm transition-colors"
                >
                  Candidate Sign Up
                </Link>
                <Link
                  to="/register/recruiter"
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Post a Job
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Companies
          </Link>
          {isAuthenticated && user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-primary-700 bg-primary-50 rounded-md"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-md"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign in
              </Link>
              <Link
                to="/register/candidate"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg"
              >
                Candidate Sign Up
              </Link>
              <Link
                to="/register/recruiter"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold text-primary-700 bg-primary-50 rounded-lg"
              >
                Recruiter Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
