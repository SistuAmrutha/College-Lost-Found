import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import ItemCard from '../../components/common/ItemCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../utils/constants';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';

export default function BrowseItemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from URL query or default
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '');
  const [dateTo, setDateTo] = useState(searchParams.get('dateTo') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '0', 10));

  const [itemsData, setItemsData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    // Sync state with URL params
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
    setCategory(searchParams.get('category') || '');
    setLocation(searchParams.get('location') || '');
    setStatus(searchParams.get('status') || '');
    setDateFrom(searchParams.get('dateFrom') || '');
    setDateTo(searchParams.get('dateTo') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page') || '0', 10));
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          size: 12,
          sort,
        };
        if (search) params.search = search;
        if (type) params.type = type;
        if (category) params.category = category;
        if (location) params.location = location;
        if (status) params.status = status;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;

        const data = await itemService.searchItems(params);
        if (isMounted) {
          setItemsData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load items from server');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchListings();
    return () => { isMounted = false; };
  }, [search, type, category, location, status, dateFrom, dateTo, sort, page]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        updated.set(k, v);
      } else {
        updated.delete(k);
      }
    });
    // Reset to page 0 on filter change (unless changing page itself)
    if (!('page' in newParams)) {
      updated.set('page', '0');
    }
    setSearchParams(updated);
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setCategory('');
    setLocation('');
    setStatus('');
    setDateFrom('');
    setDateTo('');
    setSort('newest');
    setPage(0);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(search || type || category || location || status || dateFrom || dateTo || sort !== 'newest');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Browse Lost & Found Items
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search, filter, and discover reported belongings across campus grounds.
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`lg:block ${showFiltersMobile ? 'block' : 'hidden'} space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
              <Filter className="w-4 h-4 text-primary-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {/* Type Filter (Lost vs Found) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Listing Type
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => updateFilters({ type: '' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  type === ''
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ type: 'LOST' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  type === 'LOST'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                }`}
              >
                Lost
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ type: 'FOUND' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  type === 'FOUND'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                Found
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Campus Location Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Campus Location
            </label>
            <select
              value={location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Item Status
            </label>
            <select
              value={status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Active (Open & Claim Pending)</option>
              <option value="OPEN">Open Only</option>
              <option value="CLAIM_PENDING">Claim Pending</option>
              <option value="RETURNED">Returned (Resolved)</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400">From</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">To</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => updateFilters({ dateTo: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Main Content */}
        <section className="lg:col-span-3 space-y-6">
          {/* Top Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateFilters({ search });
              }}
              className="relative flex-1"
            >
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by keywords, characteristics, colors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
            </form>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Results count & status banner */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Found <strong className="text-slate-900 dark:text-slate-100">{itemsData.totalElements}</strong> items
            </span>
            {hasActiveFilters && (
              <span className="text-primary-600 dark:text-primary-400">
                Filters applied
              </span>
            )}
          </div>

          {/* Items Content */}
          {loading ? (
            <LoadingSpinner text="Searching campus listings..." />
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Failed to load listings</h4>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          ) : itemsData.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {itemsData.content.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={itemsData.totalPages}
                onPageChange={(newPage) => updateFilters({ page: newPage.toString() })}
              />
            </>
          ) : (
            <EmptyState
              title="No items found"
              description="No lost or found items matched your search and filter criteria. Try adjusting your filters or search keywords."
              actionText="Reset All Filters"
              onAction={handleClearFilters}
            />
          )}
        </section>
      </div>
    </div>
  );
}
