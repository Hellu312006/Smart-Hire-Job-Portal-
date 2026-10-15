import React from 'react';
import { Briefcase, Loader2, Sparkles } from 'lucide-react';

/**
 * TopProgressBar - High-end YouTube/GitHub style sliding progress bar at top of screen
 */
export const TopProgressBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-100 overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-primary-600 via-sky-400 to-indigo-600 animate-progress-slide" />
    </div>
  );
 };

/**
 * PageLoader - Enterprise branded splash / full-container loading animation
 */
interface PageLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading SmartHire Platform...',
  subMessage = 'Fetching the latest opportunities and matching criteria',
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 transition-all ${
        fullScreen ? 'min-h-[80vh] w-full' : 'py-20 w-full'
      }`}
    >
      <div className="relative mb-6">
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 -m-3 rounded-2xl bg-primary-400/20 blur-xl animate-pulse" />
        <div className="absolute inset-0 -m-2 rounded-2xl border-2 border-primary-200 animate-sonar" />

        {/* Central branded badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 flex items-center justify-center shadow-xl shadow-primary-900/20 text-white">
          <Briefcase className="w-8 h-8 text-sky-400 animate-bounce transition-transform duration-700" />
        </div>
      </div>

      {/* Animated Text & Spinner */}
      <div className="text-center space-y-2 max-w-sm">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
          <h3 className="text-base font-bold text-slate-800 tracking-tight">{message}</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{subMessage}</p>
      </div>

      {/* Shimmering Indicator Pill */}
      <div className="mt-6 flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
        <span>Enterprise Recruitment Engine Active</span>
      </div>
    </div>
  );
};

/**
 * SkeletonJobCard - Real-world card skeleton with light-sweep shimmer effect
 */
export const SkeletonJobCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm relative overflow-hidden space-y-5">
      {/* Light shimmer overlay */}
      <div className="absolute inset-0 shimmer-effect opacity-60 pointer-events-none" />

      {/* Header with logo & title */}
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-200 rounded-md w-1/2" />
        </div>
      </div>

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-md w-full" />
        <div className="h-3.5 bg-slate-200 rounded-md w-5/6" />
      </div>

      {/* Badges row */}
      <div className="flex items-center space-x-2 pt-2">
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
        <div className="h-6 w-24 bg-slate-200 rounded-full" />
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>

      {/* Footer row with salary & action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="h-4 w-28 bg-slate-200 rounded-md" />
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
};

/**
 * SkeletonStatsCard - Metric number skeleton for dashboards
 */
export const SkeletonStatsCard: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden space-y-3">
      <div className="absolute inset-0 shimmer-effect opacity-50 pointer-events-none" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="w-8 h-8 rounded-lg bg-slate-200" />
      </div>
      <div className="h-7 w-16 bg-slate-200 rounded" />
      <div className="h-3 w-32 bg-slate-200 rounded" />
    </div>
  );
};

/**
 * SkeletonTableRow - Table row skeleton for applicants and admin lists
 */
export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-slate-100 relative overflow-hidden">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-6">
          <div
            className="h-4 bg-slate-200 rounded-md shimmer-effect"
            style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
          />
        </td>
      ))}
    </tr>
  );
};

/**
 * ButtonSpinner - Lightweight spinner for button action states
 */
export const ButtonSpinner: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <span className="inline-flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      {text && <span>{text}</span>}
    </span>
  );
};
