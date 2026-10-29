import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { Mail, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const PublicFooter: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#05080f] border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={() => navigate('/')} className="text-left group focus:outline-none">
              <BrandLogo size="md" />
            </button>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Professional digital music distribution, rights administration, and consolidated royalty tracking built for independent artists, producers, and record labels.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:support@rudraatmamusic.com" className="text-slate-300 hover:text-white transition-colors">
                  support@rudraatmamusic.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Desk Hours: Mon–Fri, 10:00 AM – 6:00 PM IST (Response: 24–48h)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Artist Payouts via Verified IMPS & UPI</span>
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-300 font-mono font-semibold mb-4">
              Platform & Features
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors text-left">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors text-left">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors text-left">
                  Pricing & Plans
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blogs')} className="hover:text-white transition-colors text-left">
                  Blogs & Knowledge Base
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors text-left">
                  About Rudraatma Music
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors text-left">
                  Contact Artist Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Portal */}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-300 font-mono font-semibold mb-4">
              Artist Portal
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-white transition-colors text-left">
                  Artist Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/signup')} className="hover:text-white transition-colors text-left">
                  Create Account (Sign Up)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors text-left">
                  Artist Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/releases')} className="hover:text-white transition-colors text-left">
                  Release Management
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/reports')} className="hover:text-white transition-colors text-left">
                  Royalty Reporting
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/support')} className="hover:text-white transition-colors text-left">
                  Support Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Agreements */}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-300 font-mono font-semibold mb-4">
              Legal & Compliance
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/refund-policy')} className="hover:text-white transition-colors text-left">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cancellation-policy')} className="hover:text-white transition-colors text-left">
                  Subscription & Cancellation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/distribution-agreement')} className="hover:text-white transition-colors text-left">
                  Music Distribution Agreement
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Rudraatma Music. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>All visible content in English</span>
            <span>·</span>
            <span>Zero Unverified Claims Policy</span>
            <span>·</span>
            <span>100% Artist Copyright Retention</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
