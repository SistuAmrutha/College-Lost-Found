import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function NotificationsPage() {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(page, 15);
      setNotifications(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [page]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      success('All notifications marked as read');
    } catch {
      error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      success('Notification dismissed');
    } catch {
      error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CLAIM_SUBMITTED':
      case 'CLAIM_APPROVED':
      case 'CLAIM_REJECTED':
        return <FileCheck2 className="w-5 h-5 text-indigo-500" />;
      case 'MESSAGE_RECEIVED':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'REPORT_REVIEWED':
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time status updates on your claims, posts, and message alerts
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching notifications..." />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-900 shadow-sm'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.message}
                </p>

                {/* Actions & Links */}
                <div className="flex items-center gap-4 pt-2">
                  {notif.relatedEntityType === 'CLAIM' && (
                    <Link
                      to="/student/claims"
                      className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      View Claim <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  {notif.relatedEntityType === 'CONVERSATION' && (
                    <Link
                      to="/student/messages"
                      className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      Open Messages <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  {notif.relatedEntityType === 'ITEM' && notif.relatedEntityId && (
                    <Link
                      to={`/items/${notif.relatedEntityId}`}
                      className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      View Listing <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 ml-auto p-1"
                    title="Dismiss notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! You will be notified here whenever claims, messages, or status changes occur."
        />
      )}
    </div>
  );
}
