import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                College <span className="text-primary-400">Lost & Found</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A centralized, trusted campus community portal enabling students and staff to safely report, locate, claim, and recover misplaced belongings across university grounds.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Campus student verification & safe handover guidance active.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse?type=LOST" className="hover:text-white transition-colors">
                  Lost Items
                </Link>
              </li>
              <li>
                <Link to="/browse?type=FOUND" className="hover:text-white transition-colors">
                  Found Items
                </Link>
              </li>
              <li>
                <Link to="/report/lost" className="hover:text-white transition-colors">
                  Report Lost Belonging
                </Link>
              </li>
              <li>
                <Link to="/report/found" className="hover:text-white transition-colors">
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/browse?category=Electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Identity Documents" className="hover:text-white transition-colors">
                  Identity Documents
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Wallets and Money" className="hover:text-white transition-colors">
                  Wallets & Keys
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Books and Stationery" className="hover:text-white transition-colors">
                  Books & Notes
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Water Bottles" className="hover:text-white transition-colors">
                  Bottles & Bags
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Safety & Privacy</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#safety" className="hover:text-white transition-colors">
                  Safe Handover Tips
                </Link>
              </li>
              <li>
                <a href="mailto:lostfound@college.edu" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-primary-400" />
                  Support Desk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} College Lost & Found System. Built for campus safety.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for university students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
