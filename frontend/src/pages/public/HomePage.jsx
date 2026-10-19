import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import ItemCard from '../../components/common/ItemCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CATEGORIES } from '../../utils/constants';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileQuestion,
  Users
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, itemsData] = await Promise.all([
          itemService.getStatistics().catch(() => null),
          itemService.searchItems({ size: 6 }).catch(() => ({ content: [] }))
        ]);

        if (statsData) {
          setStats(statsData);
        } else {
          setStatsError(true);
        }

        setRecentItems(itemsData?.content || []);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Official University Campus Lost & Found
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Lost Something? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-300">
              Let's Help You Find It.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The safe, verified university network connecting students who lost their belongings with those who found them. Search listings, submit claims, and recover items securely.
          </p>

          {/* Call to action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/report/lost"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-lg shadow-rose-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              Report Lost Item
            </Link>

            <Link
              to="/browse?type=FOUND"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Browse Found Items
            </Link>
          </div>

          {/* Quick Search Bar preview */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Link
              to="/browse"
              className="flex items-center w-full px-5 py-4 text-left text-sm text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary-400 transition-all group"
            >
              <Search className="w-5 h-5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mr-3" />
              <span className="flex-1">Search lost or found items (e.g. calculator, keys, blue bottle, ID card)...</span>
              <span className="hidden sm:inline-block px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 rounded-lg">
                Browse All
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400">
                  {stats.totalLost}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-2">
                  Reported Lost
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  {stats.totalFound}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-2">
                  Items Found
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                  {stats.totalReturned}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-2">
                  Safely Returned
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {stats.totalActive}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-2">
                  Active Listings
                </p>
              </div>
            </div>
          ) : statsError ? (
            <div className="text-center p-4 text-xs text-slate-400">
              Live statistics temporarily unavailable. Connecting to campus database...
            </div>
          ) : (
            <LoadingSpinner size="sm" text="Updating campus statistics..." />
          )}
        </div>
      </section>

      {/* Recent Listings Grid */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Fresh Listings
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Recent Lost & Found Posts
              </h2>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 group"
            >
              <span>View all listings</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading recent campus posts..." />
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No recent items reported yet. Be the first to post!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Browse by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Explore Common Belongings
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/browse?category=${encodeURIComponent(category)}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/40 transition-all text-center group"
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              How Campus Recovery Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-extrabold text-xl flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Report with Details
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Post lost or found belongings with category, campus location, date, and safe identifying descriptions without disclosing sensitive personal numbers.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Privately Claim & Verify
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Claimants submit ownership verification (e.g. wallpaper description, unique marks) via secure private messages to prevent false claims.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold text-xl flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Safe Handover & Return
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Meet at designated campus security checkpoints or departmental helpdesks to return the item and mark the post as safely returned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips Banner */}
      <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Campus Safety Protocol
              </div>
              <h3 className="text-2xl font-bold">
                Student Privacy & Safe Handover Rules
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Never post full student ID numbers, confidential documents, or sensitive keys publicly. Always conduct item exchanges in open, well-lit campus areas like the library desk or security post.
              </p>
            </div>
            <Link
              to="/how-it-works#safety"
              className="shrink-0 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
            >
              Read Safety Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
