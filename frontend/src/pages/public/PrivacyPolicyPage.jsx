import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          Trust & Safety
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">
          Last updated: October 2026 • University Campus Lost & Found System
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            1. Student Data Protection & Masking
          </h2>
          <p>
            The College Lost & Found platform is committed to maintaining student anonymity while enabling effective item recovery. Phone numbers and full college ID numbers are never displayed on public listings. Student contact details are kept strictly between verified claimants and item owners upon mutual agreement.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-primary-500" />
            2. Confidentiality of Found Identity Documents
          </h2>
          <p>
            When sensitive items such as student ID cards, wallets, passbooks, or keys are reported, users are strongly advised not to publish full serial numbers, card photographs, or personal home addresses. Claim verification must happen privately via our secure claim messaging flow.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            3. Information Collected & Retention
          </h2>
          <p>
            We collect student registration details (name, college email, college ID, department, year) exclusively to prevent unauthorized impostors and ensure safety within the university community. Passwords are cryptographically hashed using BCrypt and are never stored in plaintext.
          </p>
        </section>
      </div>
    </div>
  );
}
