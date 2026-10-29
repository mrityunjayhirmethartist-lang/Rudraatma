import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Disc3, ArrowRight, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const PublicHeader: React.FC = () => {
  const { path, navigate } = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/signup' }
  ];

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNav = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
              aria-label="Rudraatma Music Home"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Nav Links Desktop (Clean 4-link summary for Top Bar Contract + hamburger for exhaustive 8 routes) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNav('/')}
              className={`hover:text-white transition-colors focus:outline-none ${path === '/' ? 'text-blue-400 font-semibold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/services')}
              className={`hover:text-white transition-colors focus:outline-none ${path === '/services' ? 'text-blue-400 font-semibold' : ''}`}
            >
              Our Services
            </button>
            <button
              onClick={() => handleNav('/pricing')}
              className={`hover:text-white transition-colors focus:outline-none ${path === '/pricing' ? 'text-blue-400 font-semibold' : ''}`}
            >
              Pricing
            </button>
            <button
              onClick={() => handleNav('/blogs')}
              className={`hover:text-white transition-colors focus:outline-none ${path === '/blogs' ? 'text-blue-400 font-semibold' : ''}`}
            >
              Blogs
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`hover:text-white transition-colors focus:outline-none ${path === '/about' ? 'text-blue-400 font-semibold' : ''}`}
            >
              About
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`hover:text-white transition-colors focus:outline-none ${path === '/contact' ? 'text-blue-400 font-semibold' : ''}`}
            >
              Contact
            </button>
          </nav>

          {/* Action Zone + Hamburger Trigger */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => handleNav('/dashboard')}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/80 rounded-lg hover:bg-blue-900/60 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Artist Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/login')}
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('/signup')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Three-Line Hamburger Trigger */}
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Out Drawer / Dropdown Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={menuRef}
            className="relative w-full max-w-sm sm:max-w-md bg-[#0b1120] border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <BrandLogo size="sm" />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Exact 8 Primary Hamburger Routes */}
              <div className="mt-6 space-y-1">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-mono px-3 mb-2">
                  Navigation
                </div>
                {navLinks.map((item) => {
                  const isActive = path === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNav(item.href)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                          : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs font-mono text-slate-400">{item.href}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Route to Dashboard if Authenticated */}
              {user && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-mono px-3 mb-2">
                    Signed In As
                  </div>
                  <div className="px-3.5 py-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                        {user.fullName.slice(0, 1)}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white truncate">{user.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNav('/dashboard')}
                    className="mt-3 w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Artist Dashboard
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleNav('/admin')}
                      className="mt-2 w-full py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 rounded-lg transition-colors"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Bottom Details */}
            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center justify-between mb-2">
                <span>Verified Support</span>
                <span className="text-slate-300 font-mono">support@rudraatmamusic.com</span>
              </div>
              <div className="text-[11px] text-slate-400">
                © 2026 Rudraatma Music. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
