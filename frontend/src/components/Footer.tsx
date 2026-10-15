import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Database, Server, Code2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Smart<span className="text-primary-400">Hire</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enterprise full-stack recruitment architecture uniting MySQL relational integrity with MongoDB document elasticity for next-generation hiring.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                <Server className="w-3.5 h-3.5 text-primary-400" />
                <span>Spring Boot 3</span>
              </span>
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MySQL + MongoDB</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition-colors">
                  Hiring Companies
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Candidate Login
                </Link>
              </li>
              <li>
                <Link to="/register/recruiter" className="hover:text-white transition-colors">
                  Employer Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Dashboards */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/candidate/dashboard" className="hover:text-white transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-white transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                  Platform Administration
                </Link>
              </li>
              <li>
                <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  OpenAPI / Swagger Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Project notes */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Academic Project
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Designed as a comprehensive Computer Engineering portfolio project demonstrating production-grade microservice patterns, JWT security, and dual relational/NoSQL storage.
            </p>
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Code2 className="w-3.5 h-3.5 text-primary-400" />
              <span>Full-Stack Java 21 & React TS</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartHire Recruitment Platform. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 inline" /> for BE Computer Engineering Portfolio
          </p>
        </div>
      </div>
    </footer>
  );
};
