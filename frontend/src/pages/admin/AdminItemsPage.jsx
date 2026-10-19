import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Package,
  Search,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar
} from 'lucide-react';

export default function AdminItemsPage() {
  const { success, error } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
      if (search) params.search = search;
      if (type) params.type = type;

      const data = await itemService.searchItems(params);
      setItems(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch {
      error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [page, type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadItems();
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteItem(itemToDelete.id);
      success('Listing administratively removed');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadItems();
    } catch {
      error('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Listings Moderation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, inspect, and remove inappropriate or fraudulent listings ({totalElements} total)
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </form>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        >
          <option value="">All Types (Lost & Found)</option>
          <option value="LOST">Lost Belongings</option>
          <option value="FOUND">Found Belongings</option>
        </select>
      </div>

      {/* Items Table */}
      {loading ? (
        <LoadingSpinner text="Fetching campus listings..." />
      ) : items.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Item Details</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Location & Date</th>
                  <th className="px-6 py-4 font-bold">Poster</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={it.type === 'LOST' ? 'lost' : 'found'}>
                          {it.type}
                        </Badge>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {it.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                        {it.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                      {it.category}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      <div>{it.location}</div>
                      <div>{formatDate(it.dateOccurred)}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {it.ownerName}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={it.status?.toLowerCase()}>
                        {it.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <Link
                        to={`/items/${it.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary-600 inline-block"
                        title="View Post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setItemToDelete(it);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 inline-block"
                        title="Remove Post Administratively"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
          No listings found matching criteria.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Administrative Item Removal"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete listing <strong>"{itemToDelete?.title}"</strong>? An administrative audit log entry will be created.
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
              {deleting ? 'Deleting...' : 'Remove Listing'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
