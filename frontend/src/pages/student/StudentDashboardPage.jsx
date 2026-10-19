import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { itemService } from '../../services/itemService';
import { claimService } from '../../services/claimService';
import { notificationService } from '../../services/notificationService';
import StatCard from '../../components/dashboard/StatCard';
import ItemCard from '../../components/common/ItemCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import {
  Layers,
  Search,
  PlusCircle,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Bell,
  MessageSquare,
  ShieldAlert,
  Inbox
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        const [postsRes, claimsRes, notifsRes] = await Promise.all([
          itemService.getMyPosts(0, 5).catch(() => ({ content: [] })),
          claimService.getMyClaims(0, 5).catch(() => ({ content: [] })),
          notificationService.getNotifications(0, 5).catch(() => ({ content: [] }))
        ]);

        if (isMounted) {
          setMyPosts(postsRes?.content || []);
          setMyClaims(claimsRes?.content || []);
          setNotifications(notifsRes?.content || []);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  // Compute stat counts from user's posts
  const totalPosts = myPosts.length;
  const lostCount = myPosts.filter(p => p.type === 'LOST').length;
  const foundCount = myPosts.filter(p => p.type === 'FOUND').length;
  const returnedCount = myPosts.filter(p => p.status === 'RETURNED').length;

  if (loading) {
    return <LoadingSpinner text="Loading student dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-200">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.fullName || 'Student'}!
          </h1>
          <p className="text-sm text-primary-100 max-w-xl">
            Welcome to your college recovery hub. Manage your reported items, check claim verifications, and coordinate safe handovers.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <Link
              to="/report/lost"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary-700 rounded-xl font-bold text-xs hover:bg-primary-50 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
              Report Lost Item
            </Link>
            <Link
              to="/report/found"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-xs hover:bg-white/30 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-300" />
              Report Found Item
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-xs hover:bg-white/30 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              Browse All Items
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          icon={Layers}
          color="blue"
          subtitle="Your created listings"
        />
        <StatCard
          title="Lost Items"
          value={lostCount}
          icon={Search}
          color="rose"
          subtitle="Belongings sought"
        />
        <StatCard
          title="Found Items"
          value={foundCount}
          icon={PlusCircle}
          color="emerald"
          subtitle="Items in custody"
        />
        <StatCard
          title="Returned Items"
          value={returnedCount}
          icon={CheckCircle2}
          color="amber"
          subtitle="Successfully resolved"
        />
      </div>

      {/* 2-Column Section: Recent Posts vs Notifications & Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Recent Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary-600" />
              Your Recent Posts
            </h2>
            <Link
              to="/student/my-posts"
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myPosts.length > 0 ? (
            <div className="space-y-3">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs shrink-0">
                      {post.category?.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={post.type === 'LOST' ? 'lost' : 'found'}>
                          {post.type}
                        </Badge>
                        <Badge variant={post.status?.toLowerCase()}>
                          {post.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {post.location} • {formatDate(post.dateOccurred)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/items/${post.id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500">You haven't posted any items yet.</p>
              <div className="mt-4 flex justify-center gap-3">
                <Link
                  to="/report/lost"
                  className="text-xs font-semibold px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg"
                >
                  Report Lost
                </Link>
                <Link
                  to="/report/found"
                  className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg"
                >
                  Report Found
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Notifications Preview & Profile Card */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Profile Summary
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 font-extrabold flex items-center justify-center text-lg">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                  {user?.fullName}
                </h4>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ID: {user?.collegeId} • {user?.department}
                </p>
              </div>
            </div>
            <Link
              to="/student/profile"
              className="block w-full py-2 text-center text-xs font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
            >
              Manage Full Profile
            </Link>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-primary-600" />
                Latest Alerts
              </h3>
              <Link to="/student/notifications" className="text-xs font-bold text-primary-600 hover:underline">
                All
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {notif.title}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
