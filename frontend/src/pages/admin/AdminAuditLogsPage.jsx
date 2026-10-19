import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { formatDateTime } from '../../utils/formatters';
import { History, Shield, Clock, User, Tag } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { error } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const data = await adminService.getAuditLogs(page, 20);
        setLogs(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } catch {
        error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Security & Moderation Audit Trail
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Immutable audit records of administrative, status change, and moderation events ({totalElements} recorded)
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching audit trail..." />
      ) : logs.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                  <th className="px-6 py-4 font-bold">Actor</th>
                  <th className="px-6 py-4 font-bold">Action</th>
                  <th className="px-6 py-4 font-bold">Target</th>
                  <th className="px-6 py-4 font-bold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-3 whitespace-nowrap text-slate-500 font-sans">
                      {formatDateTime(log.createdAt)}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap font-sans font-semibold text-slate-800 dark:text-slate-200">
                      {log.actorEmail || log.actorId}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-900">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap text-slate-500 font-sans">
                      {log.targetType} <span className="text-[10px] text-slate-400">({log.targetId?.substring(0, 8)}...)</span>
                    </td>

                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300 font-sans">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
          No audit logs recorded yet.
        </div>
      )}
    </div>
  );
}
