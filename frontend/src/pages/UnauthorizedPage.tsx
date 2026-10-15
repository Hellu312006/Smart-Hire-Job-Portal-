import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">403 - Access Denied</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          You do not have the required permissions or role privileges to view this section of the portal.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
