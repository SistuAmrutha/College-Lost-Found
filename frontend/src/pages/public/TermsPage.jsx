import React from 'react';
import { FileCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Campus Code of Conduct
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">
          Last updated: October 2026 • University Campus Lost & Found System
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            1. Zero Tolerance for Fraudulent Claims
          </h2>
          <p>
            Claiming belongings that do not belong to you or falsely declaring ownership of another student's property constitutes academic misconduct and will result in immediate account suspension and referral to the university discipline committee.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary-500" />
            2. Responsible Posting Guidelines
          </h2>
          <p>
            Users must submit honest, accurate information regarding lost and found dates, locations, and descriptions. Duplicate spam posts, profane imagery, or advertisements are strictly prohibited and actively removed by moderators.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            3. Safe Exchanges & Disclaimers
          </h2>
          <p>
            The University provides this portal to facilitate item discovery. Both finders and claimants are expected to verify ownership diligently. The University strongly advises conducting all handovers inside campus boundaries in daylight.
          </p>
        </section>
      </div>
    </div>
  );
}
