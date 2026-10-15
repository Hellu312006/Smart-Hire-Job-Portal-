import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchHistoryDocument } from '../../types';
import { candidateApi } from '../../services/api';
import { History, Search, MapPin, Calendar, ArrowRight } from 'lucide-react';

export const CandidateSearchHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<SearchHistoryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await candidateApi.getSearchHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load search history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleRerunSearch = (item: SearchHistoryDocument) => {
    const params = new URLSearchParams();
    if (item.keyword) params.append('keyword', item.keyword);
    if (item.location) params.append('location', item.location);
    navigate(`/jobs?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your search logs from MongoDB...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Search History</h1>
        <p className="text-xs text-slate-500">
          Your search queries are logged in MongoDB collections for quick re-execution and preference tuning.
        </p>
      </div>

      {history.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle divide-y divide-slate-100 overflow-hidden">
          {history.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-bold text-slate-800">
                    "{item.keyword || 'All Jobs'}"
                  </span>
                  {item.location && (
                    <span className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Searched on {new Date(item.searchedAt).toLocaleString()}</span>
                </p>
              </div>

              <button
                onClick={() => handleRerunSearch(item)}
                className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                <span>Re-run Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No search logs yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Search keywords and filters you apply will be automatically recorded here.
          </p>
        </div>
      )}
    </div>
  );
};
