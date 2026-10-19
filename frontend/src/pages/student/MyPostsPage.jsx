import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import { claimService } from '../../services/claimService';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../utils/constants';
import {
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

export default function MyPostsPage() {
  const { success, error } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // View Claims Modal State
  const [claimsModalOpen, setClaimsModalOpen] = useState(false);
  const [selectedItemClaims, setSelectedItemClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [currentClaimItem, setCurrentClaimItem] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await itemService.getMyPosts(page, 15);
      setPosts(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  // Tab Filtering
  const filteredPosts = posts.filter(post => {
    if (currentTab === 'LOST') return post.type === 'LOST';
    if (currentTab === 'FOUND') return post.type === 'FOUND';
    if (currentTab === 'ACTIVE') return post.status === 'OPEN' || post.status === 'CLAIM_PENDING';
    if (currentTab === 'RETURNED') return post.status === 'RETURNED';
    return true;
  });

  const handleEditClick = (item) => {
    setEditingItem({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      dateOccurred: item.dateOccurred,
      approximateTime: item.approximateTime || '',
      identifyingFeatures: item.identifyingFeatures || '',
      additionalNotes: item.additionalNotes || '',
      imageUrls: item.imageUrls || [],
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      await itemService.updateItem(editingItem.id, editingItem);
      success('Post updated successfully!');
      setEditModalOpen(false);
      loadPosts();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await itemService.deleteItem(itemToDelete.id);
      success('Post deleted successfully');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadPosts();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkReturned = async (item) => {
    try {
      await itemService.updateStatus(item.id, 'RETURNED');
      success(`Marked "${item.title}" as returned!`);
      loadPosts();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update item status');
    }
  };

  const handleViewClaims = async (item) => {
    setCurrentClaimItem(item);
    setClaimsModalOpen(true);
    setLoadingClaims(true);
    try {
      const claims = await claimService.getItemClaims(item.id);
      setSelectedItemClaims(claims);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load claims for this item');
    } finally {
      setLoadingClaims(false);
    }
  };

  const handleClaimStatusChange = async (claimId, newStatus) => {
    try {
      await claimService.updateClaimStatus(claimId, newStatus);
      success(`Claim status updated to ${newStatus}`);
      // Reload claims list
      const claims = await claimService.getItemClaims(currentClaimItem.id);
      setSelectedItemClaims(claims);
      loadPosts();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to change claim status');
    }
  };

  const tabs = [
    { key: 'ALL', label: 'All Posts' },
    { key: 'LOST', label: 'Lost' },
    { key: 'FOUND', label: 'Found' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'RETURNED', label: 'Returned' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Post Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Campus Posts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your lost and found listings, update statuses, and review claims
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report/lost"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Report Lost
          </Link>
          <Link
            to="/report/found"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Report Found
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              currentTab === tab.key
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <LoadingSpinner text="Loading your posts..." />
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 shrink-0">
                  {post.category?.substring(0, 3)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={post.type === 'LOST' ? 'lost' : 'found'}>
                      {post.type}
                    </Badge>
                    <Badge variant={post.status?.toLowerCase()}>
                      {post.status?.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatDate(post.dateOccurred)} • {post.location}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleViewClaims(post)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  Claims
                </button>

                {post.status !== 'RETURNED' && (
                  <button
                    onClick={() => handleMarkReturned(post)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                    title="Mark item as recovered/returned"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Returned
                  </button>
                )}

                <button
                  onClick={() => handleEditClick(post)}
                  className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Edit Post"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setItemToDelete(post);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to={`/items/${post.id}`}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="View Public Details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
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
          title="No posts in this category"
          description="You don't have any listings in this filter tab."
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Listing Details"
      >
        {editingItem && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Item Title
              </label>
              <input
                type="text"
                required
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Location
                </label>
                <select
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  {CAMPUS_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
              >
                {editSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete listing <strong>"{itemToDelete?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
            >
              {deleting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Item Claims Dialog */}
      <Modal
        isOpen={claimsModalOpen}
        onClose={() => setClaimsModalOpen(false)}
        title={`Claims for: ${currentClaimItem?.title || 'Item'}`}
        maxWidth="max-w-2xl"
      >
        {loadingClaims ? (
          <LoadingSpinner text="Fetching claims..." />
        ) : selectedItemClaims.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedItemClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Claimant: {claim.claimantName}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Submitted on {formatDate(claim.createdAt)}
                    </span>
                  </div>
                  <Badge variant={claim.status?.toLowerCase()}>
                    {claim.status}
                  </Badge>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p><strong>Note:</strong> {claim.privateMessage}</p>
                  <p><strong>Proof / Verification:</strong> {claim.ownershipVerification}</p>
                </div>

                {claim.status === 'PENDING' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => handleClaimStatusChange(claim.id, 'APPROVED')}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                    >
                      Approve & Mark Item Returned
                    </button>
                    <button
                      onClick={() => handleClaimStatusChange(claim.id, 'REJECTED')}
                      className="px-3 py-1.5 text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg"
                    >
                      Reject Claim
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-slate-400">
            No recovery claims submitted for this item yet.
          </div>
        )}
      </Modal>
    </div>
  );
}
