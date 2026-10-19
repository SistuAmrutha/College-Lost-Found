import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { claimService } from '../../services/claimService';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { FileCheck2, ExternalLink, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function ClaimsPage() {
  const { error } = useToast();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      try {
        const data = await claimService.getMyClaims(page, 10);
        setClaims(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        error(err.response?.data?.message || 'Failed to load your submitted claims');
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          My Recovery Claims
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track the verification status of claims you've submitted for found items
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading submitted claims..." />
      ) : claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={claim.status?.toLowerCase()}>
                    {claim.status}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Claimed on {formatDate(claim.createdAt)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {claim.itemTitle}
                </h3>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p><strong>Your Message:</strong> {claim.privateMessage}</p>
                  <p><strong>Verification Details:</strong> {claim.ownershipVerification}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/items/${claim.itemId}`}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors flex items-center gap-1.5"
                >
                  <span>View Item</span>
                  <ExternalLink className="w-3.5 h-3.5" />
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
          icon={FileCheck2}
          title="No claims submitted"
          description="When you spot an item in the Found directory that belongs to you, submit a claim to notify the finder."
          actionText="Browse Found Items"
          onAction={() => window.location.href = '/browse?type=FOUND'}
        />
      )}
    </div>
  );
}
