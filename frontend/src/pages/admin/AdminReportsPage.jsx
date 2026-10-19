import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

export default function AdminReportsPage() {
  const { success, error } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [actionStatus, setActionStatus] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports(statusFilter || null, page, 15);
      setReports(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch {
      error('Failed to load moderation reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [page, statusFilter]);

  const handleOpenReview = (report, status) => {
    setCurrentReport(report);
    setActionStatus(status);
    setAdminNotes('');
    setReviewModalOpen(true);
  };

  const handleConfirmReview = async (e) => {
    e.preventDefault();
    if (!currentReport) return;

    setSubmitting(true);
    try {
      await reportService.updateReportStatus(currentReport.id, actionStatus, adminNotes);
      success(`Report marked as ${actionStatus.toLowerCase()}`);
      setReviewModalOpen(false);
      setCurrentReport(null);
      loadReports();
    } catch {
      error('Failed to update report status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Moderation Reports Queue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review user-submitted flags for suspicious, fraudulent, or inappropriate listings ({totalElements} total)
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
        >
          <option value="">All Statuses (Pending, Resolved, Dismissed)</option>
          <option value="PENDING">Pending Action Only</option>
          <option value="RESOLVED">Resolved Only</option>
          <option value="DISMISSED">Dismissed Only</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching reports queue..." />
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((rep) => {
            const isPending = rep.status === 'PENDING';
            return (
              <div
                key={rep.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={isPending ? 'pending' : rep.status === 'RESOLVED' ? 'open' : 'closed'}>
                      {rep.status}
                    </Badge>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                      Reason: {rep.reason?.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Reported on {formatDate(rep.createdAt)} by <strong className="text-slate-700 dark:text-slate-300">{rep.reporterName}</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Flagged Item: {rep.itemTitle}
                    </h3>
                    <Link
                      to={`/items/${rep.itemId}`}
                      className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      Inspect Post <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    <strong>Reporter Notes:</strong> {rep.description}
                  </p>

                  {rep.adminNotes && (
                    <p className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-200 dark:border-purple-900 leading-relaxed">
                      <strong>Admin Resolution ({rep.reviewedBy}):</strong> {rep.adminNotes}
                    </p>
                  )}
                </div>

                {isPending && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenReview(rep, 'RESOLVED')}
                      className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve (Action Taken)
                    </button>
                    <button
                      onClick={() => handleOpenReview(rep, 'DISMISSED')}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Dismiss (False Alarm)
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
          No reports currently in queue matching this status.
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Confirm Report Resolution (${actionStatus})`}
      >
        <form onSubmit={handleConfirmReview} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            You are about to mark this report regarding <strong>"{currentReport?.itemTitle}"</strong> as <strong>{actionStatus}</strong>.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Resolution Notes / Action Taken
            </label>
            <textarea
              required
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Verified with security desk; listing flagged for user violation or Post confirmed authentic..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm ${
                actionStatus === 'RESOLVED'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              {submitting ? 'Updating...' : `Confirm ${actionStatus}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
