import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  FileCheck2,
  MessageSquare,
  Bell,
  User,
  Users,
  ShieldAlert,
  History,
  Compass,
  PlusCircle,
  Package,
  LogOut
} from 'lucide-react';

export default function Sidebar({ mode = 'student' }) {
  const { user, logout } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Posts', path: '/student/my-posts', icon: Layers },
    { name: 'Claims', path: '/student/claims', icon: FileCheck2 },
    { name: 'Messages', path: '/student/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Listings', path: '/admin/items', icon: Package },
    { name: 'Reports Queue', path: '/admin/reports', icon: ShieldAlert },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  const links = mode === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 justify-between transition-colors">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-sm shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {mode === 'admin' ? 'System Administrator' : user?.department || 'Student'}
            </p>
          </div>
        </div>

        {/* Quick Post buttons for student */}
        {mode === 'student' && (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/report/lost"
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 rounded-xl border border-rose-200 dark:border-rose-900/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Lost
            </Link>
            <Link
              to="/report/found"
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 rounded-xl border border-emerald-200 dark:border-emerald-900/40 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Found
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {mode === 'admin' ? (
          <Link
            to="/student/dashboard"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            Switch to Student View
          </Link>
        ) : (
          <Link
            to="/browse"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            Public Listings
          </Link>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
