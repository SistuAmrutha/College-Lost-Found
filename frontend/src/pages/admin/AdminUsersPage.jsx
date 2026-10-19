import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const { success, error } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Status Toggle Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [updating, setUpdating] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
      if (search) params.search = search;
      if (role) params.role = role;

      const data = await adminService.getUsers(params);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch {
      error('Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, role]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadUsers();
  };

  const handleStatusChangeClick = (user, status) => {
    if (user.id === currentAdmin?.id) {
      error('You cannot change your own administrative account status');
      return;
    }
    setTargetUser(user);
    setNewStatus(status);
    setStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!targetUser) return;
    setUpdating(true);
    try {
      await adminService.updateUserStatus(targetUser.id, newStatus);
      success(`User account status updated to ${newStatus}`);
      setStatusModalOpen(false);
      setTargetUser(null);
      loadUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            User Account Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, moderate, and manage verified student and staff accounts ({totalElements} total)
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by full name or college email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </form>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        >
          <option value="">All Roles</option>
          <option value="ROLE_STUDENT">Students Only</option>
          <option value="ROLE_ADMIN">Administrators Only</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Loading campus user directory..." />
      ) : users.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">College ID</th>
                  <th className="px-6 py-4 font-bold">Department & Year</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Registered</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {users.map((u) => {
                  const isCurrent = u.id === currentAdmin?.id;
                  const isSuspended = u.accountStatus === 'SUSPENDED';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                            {u.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {u.fullName} {isCurrent && '(You)'}
                            </div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {u.collegeId}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                        <div>{u.department}</div>
                        <div className="text-slate-400">{u.academicYear}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={u.role === 'ROLE_ADMIN' ? 'admin' : 'student'}>
                          {u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'STUDENT'}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isSuspended
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {u.accountStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {!isCurrent && (
                          isSuspended ? (
                            <button
                              onClick={() => handleStatusChangeClick(u, 'ACTIVE')}
                              className="px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Reactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChangeClick(u, 'SUSPENDED')}
                              className="px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              Suspend
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
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
          No user accounts matched your search.
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Confirm Account Status Change"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to change the status of <strong>"{targetUser?.fullName}"</strong> to{' '}
            <strong className={newStatus === 'SUSPENDED' ? 'text-rose-600' : 'text-emerald-600'}>
              {newStatus}
            </strong>?
          </p>
          {newStatus === 'SUSPENDED' && (
            <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
              Suspended users cannot log in, post items, or send messages until reactivated.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmStatusChange}
              disabled={updating}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm ${
                newStatus === 'SUSPENDED'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {updating ? 'Updating...' : `Confirm ${newStatus}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
