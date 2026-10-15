import React, { useState, useEffect } from 'react';
import { ActivityLogDocument } from '../../types';
import { adminApi } from '../../services/api';
import { Activity, ShieldCheck, RefreshCw, Terminal } from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getActivityLogs(0, 50);
      setLogs(res.content);
    } catch (err) {
      console.error('Failed to load activity logs from MongoDB', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Live MongoDB Activity Logs</h1>
          <p className="text-xs text-slate-500">
            Real-time audit telemetry captured across authentication, job applications, and profile edits.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-subtle transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl text-slate-300 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Collection: smarthire_nosql.activity_logs
            </span>
          </div>
          <span className="text-[11px] text-slate-500">{logs.length} entries</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Streaming logs from MongoDB collection...
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
            {logs.map((log, idx) => (
              <div
                key={log.id || idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-950 border border-primary-800 text-primary-300 uppercase">
                    {log.action}
                  </span>
                  <span className="text-slate-200 font-medium">{log.details}</span>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 flex-shrink-0">
                  <span>{log.userEmail || 'system'}</span>
                  <span>•</span>
                  <span>{log.ipAddress}</span>
                  <span>•</span>
                  <span className="text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            No audit records found in MongoDB.
          </div>
        )}
      </div>
    </div>
  );
};
