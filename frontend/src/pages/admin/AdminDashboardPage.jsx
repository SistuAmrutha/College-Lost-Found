import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/dashboard/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Package,
  Search,
  PlusCircle,
  CheckCircle2,
  ShieldAlert,
  FileCheck2,
  History,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminService.getDashboard();
        setStats(data);
      } catch {
        // error handling
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading campus administration analytics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            University Moderation Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-purple-200 mt-1 max-w-xl">
            Monitor all reported campus belongings, review moderation flags, manage user privileges, and inspect the security audit trail.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            Moderation Queue ({stats?.pendingReports ?? 0})
          </Link>
          <Link
            to="/admin/audit-logs"
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            Audit Trail
          </Link>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          color="purple"
          subtitle="Registered students & staff"
        />
        <StatCard
          title="Total Listings"
          value={stats?.totalListings ?? 0}
          icon={Package}
          color="blue"
          subtitle="All-time campus posts"
        />
        <StatCard
          title="Lost Items"
          value={stats?.lostListings ?? 0}
          icon={Search}
          color="rose"
          subtitle="Current lost reports"
        />
        <StatCard
          title="Found Items"
          value={stats?.foundListings ?? 0}
          icon={PlusCircle}
          color="emerald"
          subtitle="Found belongings"
        />
      </div>

      {/* Second Row: Action Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Recoveries
            </span>
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {stats?.returnedItems ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Items successfully returned to owners
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-950/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-500">
              Pending Reports
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {stats?.pendingReports ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Flagged posts awaiting review
          </p>
          <Link
            to="/admin/reports"
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 pt-1"
          >
            Review Reports Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-indigo-950/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-indigo-500">
              Active Claims
            </span>
            <FileCheck2 className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats?.pendingClaims ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Recovery claims undergoing verification
          </p>
        </div>
      </div>

      {/* Management Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">User Moderation</h4>
            <p className="text-xs text-slate-400">Manage student accounts</p>
          </div>
        </Link>

        <Link
          to="/admin/items"
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Item Moderation</h4>
            <p className="text-xs text-slate-400">Inspect & delete listings</p>
          </div>
        </Link>

        <Link
          to="/admin/reports"
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Reports Queue</h4>
            <p className="text-xs text-slate-400">Resolve flagged posts</p>
          </div>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Audit Logs</h4>
            <p className="text-xs text-slate-400">Security event trail</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
