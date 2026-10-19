import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { itemService } from '../../services/itemService';
import { claimService } from '../../services/claimService';
import { messageService } from '../../services/messageService';
import { reportService } from '../../services/reportService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ItemCard from '../../components/common/ItemCard';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { REPORT_REASONS } from '../../utils/constants';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldAlert,
  Send,
  MessageSquare,
  CheckCircle2,
  FileCheck2,
  ArrowLeft,
  Tag,
  AlertTriangle,
  Lock,
  Share2
} from 'lucide-react';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Claim Modal State
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimForm, setClaimForm] = useState({ privateMessage: '', ownershipVerification: '' });
  const [claimSubmitting, setClaimSubmitting] = useState(false);

  // Message Modal State
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [messageSubmitting, setMessageSubmitting] = useState(false);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: 'INAPPROPRIATE_CONTENT', description: '' });
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadItemData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await itemService.getItem(id);
        if (isMounted) {
          setItem(data);
          // fetch related
          if (data.category) {
            const related = await itemService.getRelated(data.id, data.category).catch(() => []);
            if (isMounted) setRelatedItems(related);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg(err.response?.data?.message || 'Item not found');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadItemData();
    return () => { isMounted = false; };
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setClaimSubmitting(true);
    try {
      await claimService.createClaim({
        itemId: item.id,
        privateMessage: claimForm.privateMessage,
        ownershipVerification: claimForm.ownershipVerification,
      });
      success('Claim submitted successfully! The finder has been notified.');
      setClaimModalOpen(false);
      // Reload item to show updated status
      const updated = await itemService.getItem(id);
      setItem(updated);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setClaimSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setMessageSubmitting(true);
    try {
      await messageService.createConversation({
        recipientId: item.ownerId,
        relatedItemId: item.id,
        message: initialMessage,
      });
      success('Conversation started! Redirecting to messages...');
      setMessageModalOpen(false);
      navigate('/student/messages');
    } catch (err) {
      error(err.response?.data?.message || 'Could not send message');
    } finally {
      setMessageSubmitting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setReportSubmitting(true);
    try {
      await reportService.createReport({
        itemId: item.id,
        reason: reportForm.reason,
        description: reportForm.description,
      });
      success('Report submitted to campus moderation team.');
      setReportModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading item details..." />;
  }

  if (errorMsg || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Item Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {errorMsg || 'The listing you requested does not exist or has been removed.'}
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.ownerId;
  const isFound = item.type === 'FOUND';
  const isReturned = item.status === 'RETURNED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Item Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            {/* Header Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={item.type === 'LOST' ? 'lost' : 'found'} size="lg">
                {item.type === 'LOST' ? 'Lost Belonging' : 'Found Belonging'}
              </Badge>
              <Badge variant="category" size="lg">
                {item.category}
              </Badge>
              {item.status && (
                <Badge variant={item.status.toLowerCase()} size="lg">
                  {item.status.replace('_', ' ')}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-4">
              {item.title}
            </h1>

            {/* Metadata Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Date: {formatDate(item.dateOccurred)}</span>
              </div>
              {item.approximateTime && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Time: {item.approximateTime}</span>
                  </div>
                </>
              )}
            </div>

            {/* Image Gallery */}
            {item.imageUrls && item.imageUrls.length > 0 && (
              <div className="my-6">
                <div className="aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4 my-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
                Detailed Description
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {item.description}
              </p>
            </div>

            {/* Identifying Features */}
            {item.identifyingFeatures && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 my-6">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary-500" />
                  Distinct Characteristics
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.identifyingFeatures}
                </p>
              </div>
            )}

            {/* Additional Notes */}
            {item.additionalNotes && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 my-6">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1">
                  Additional Notes
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {item.additionalNotes}
                </p>
              </div>
            )}

            {/* Privacy Protection Notice */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                Student Privacy Active: Private contact numbers, emails, and full ID serial numbers are masked to safeguard student privacy and prevent fraudulent claims.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Action Box & Poster Card */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Take Action
            </h3>

            {/* If Item is Returned */}
            {isReturned && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span>This item has been safely returned to its owner.</span>
              </div>
            )}

            {/* Action buttons depending on role & item type */}
            {!isReturned && !isOwner && (
              <div className="space-y-3">
                {isFound ? (
                  <button
                    onClick={() => setClaimModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Claim This Item
                  </button>
                ) : (
                  <button
                    onClick={() => setMessageModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    I Found This Item / Contact Owner
                  </button>
                )}

                <button
                  onClick={() => setMessageModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Message Poster
                </button>
              </div>
            )}

            {isOwner && (
              <div className="space-y-3">
                <div className="p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-xs text-primary-700 dark:text-primary-300 font-medium">
                  You are the creator of this listing.
                </div>
                <Link
                  to="/student/my-posts"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
                >
                  Manage In My Posts
                </Link>
              </div>
            )}

            {/* Poster Info Card */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Posted By
              </span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-sm">
                  {item.ownerName?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.ownerName || 'Verified Student'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Posted on {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Listing Trigger */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setReportModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Report Inappropriate or Suspicious Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items Section */}
      {relatedItems.length > 0 && (
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Related Listings in {item.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedItems.map((rel) => (
              <ItemCard key={rel.id} item={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Claim Modal */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Submit Item Recovery Claim"
      >
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
            <strong>Important:</strong> Provide private details that only the genuine owner would know (e.g., hidden marks, locked screen wallpaper, internal contents). This information will only be shared with the poster and campus admins.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Private Message to Finder
            </label>
            <textarea
              required
              rows={3}
              value={claimForm.privateMessage}
              onChange={(e) => setClaimForm({ ...claimForm, privateMessage: e.target.value })}
              placeholder="Explain how you lost the item and where you can meet..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Proof / Ownership Verification Description
            </label>
            <textarea
              required
              rows={3}
              value={claimForm.ownershipVerification}
              onChange={(e) => setClaimForm({ ...claimForm, ownershipVerification: e.target.value })}
              placeholder="Describe specific identifying marks, stickers, serial characters, or internal wallet card types..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setClaimModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={claimSubmitting}
              className="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm disabled:opacity-50"
            >
              {claimSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Message Modal */}
      <Modal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        title={`Message ${item.ownerName || 'Poster'}`}
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Start a direct conversation regarding <strong>{item.title}</strong>.
          </p>

          <div>
            <textarea
              required
              rows={4}
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMessageModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={messageSubmitting}
              className="px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm disabled:opacity-50"
            >
              {messageSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Suspicious or Inappropriate Listing"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Reason for Report
            </label>
            <select
              value={reportForm.reason}
              onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Additional Details
            </label>
            <textarea
              required
              rows={3}
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              placeholder="Please explain why this post should be moderated..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reportSubmitting}
              className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm disabled:opacity-50"
            >
              {reportSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
