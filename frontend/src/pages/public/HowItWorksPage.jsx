import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  Lock,
  PlusCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-3 py-1 rounded-full border border-primary-200 dark:border-primary-900">
          Campus Recovery Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How the College Lost & Found System Works
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Learn how to report lost items, verify ownership securely, protect sensitive information, and safely return recovered belongings to fellow students.
        </p>
      </div>

      {/* 2 Paths: Lost vs Found */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* If you lost something */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-950/60 p-8 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            If You Lost Something
          </h2>
          <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong>Check Recent Found Items:</strong> Search the browse directory for matching campus locations and categories.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong>Create a Lost Item Report:</strong> Submit a post with description, date, and approximate time. Avoid publicly disclosing private recovery secrets.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong>Submit a Verification Claim:</strong> When someone posts your found item, click "Claim This Item" and provide private ownership proof.
              </div>
            </li>
          </ol>
          <Link
            to="/report/lost"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Report Lost Belonging
          </Link>
        </div>

        {/* If you found something */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-emerald-950/60 p-8 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            If You Found Something
          </h2>
          <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong>Post a Found Report:</strong> Describe the item generally (e.g. "Black Bifold Wallet found in Library") without publishing full contents.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong>Review Incoming Claims:</strong> Check claims in your student dashboard. Match the claimant's private verification notes against the item.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong>Approve and Return:</strong> Once verified, approve the claim, meet at a campus public spot, and mark the listing as returned.
              </div>
            </li>
          </ol>
          <Link
            to="/report/found"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Report Found Item
          </Link>
        </div>
      </div>

      {/* Safety Section */}
      <div id="safety" className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-6">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" />
          Campus Handover & Privacy Protocols
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Vital Safety Tips for Students
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-300">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Meet in Public Campus Spaces
            </h4>
            <p>
              Always arrange in-person exchanges during daytime at visible campus points like the Central Library circulation desk, department main office, or main gate security booth.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              Keep Sensitive Details Private
            </h4>
            <p>
              Never post complete student ID numbers, government ID numbers, credit card digits, or laptop unlock passwords in public descriptions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              Insist on Verification
            </h4>
            <p>
              Ask the claimant to unlock phones, show student ID matching wallet names, or specify unique internal engravings before handing over high-value goods.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Report Suspicious Activity
            </h4>
            <p>
              If anyone demands money, makes false claims, or posts inappropriate images, use the "Report Listing" button immediately for administrative action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
