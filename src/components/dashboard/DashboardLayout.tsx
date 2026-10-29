import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { ArtistNotificationPopup } from './ArtistNotificationPopup';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard,
  Tag,
  User as UserIcon,
  Disc3,
  FileBarChart,
  Wallet,
  Users,
  LifeBuoy,
  CreditCard,
  Receipt,
  MoreHorizontal,
  Youtube,
  Mic2,
  Share2,
  FileEdit,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  ShieldAlert,
  Home
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { path, navigate } = useRouter();
  const { user, logout, notifications, markNotificationRead } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState<boolean>(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileDrawerOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Labels', href: '/dashboard/labels', icon: Tag },
    { label: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    { label: 'Releases', href: '/dashboard/releases', icon: Disc3 },
    { label: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
    { label: 'Financial', href: '/dashboard/financial', icon: Wallet },
    { label: 'User Management', href: '/dashboard/users', icon: Users },
    { label: 'Support', href: '/dashboard/support', icon: LifeBuoy },
    { label: 'Subscription Plan', href: '/dashboard/subscription', icon: CreditCard },
    { label: 'Wallet Transaction', href: '/dashboard/wallet-transactions', icon: Receipt },
    { label: 'Others', href: '/dashboard/others', icon: MoreHorizontal },
    { label: 'YouTube', href: '/dashboard/youtube', icon: Youtube },
    { label: 'Manage Artists', href: '/dashboard/artists', icon: Mic2 },
    { label: 'Smart Links', href: '/dashboard/smart-links', icon: Share2 },
    { label: 'Other Requests', href: '/dashboard/other-requests', icon: FileEdit }
  ];

  const handleNav = (href: string) => {
    navigate(href);
    setMobileDrawerOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* 48-Hour Active Decision Popup */}
      <ArtistNotificationPopup />

      {/* Top Header */}
      <header className="sticky top-0 z-30 h-16 bg-[#090e1a]/95 backdrop-blur-md border-b border-slate-800/90 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger icon */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <BrandLogo size="sm" />
          </button>

          {/* Breadcrumb / Title */}
          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <button onClick={() => navigate('/dashboard')} className="hover:text-slate-200">
              Portal
            </button>
            <span>/</span>
            <span className="text-white font-medium">{title || 'Dashboard'}</span>
          </div>
        </div>

        {/* Right actions: Public Site Link, Notifications, User Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Site</span>
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Desk</span>
            </button>
          )}

          {/* Notification Bell Menu */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0b1120] border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Notification Centre
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {notifications.length} total
                  </span>
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications yet. Decisions on submitted music will appear here.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          navigate(`/dashboard/releases/${n.release_id}`);
                          setNotifMenuOpen(false);
                        }}
                        className={`p-3 rounded-lg text-xs cursor-pointer transition-colors border ${
                          !n.read_at
                            ? 'bg-blue-950/30 border-blue-800/60'
                            : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${
                              n.notification_type === 'approved'
                                ? 'text-emerald-400'
                                : n.notification_type === 'changes_requested'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                        <div className="mt-1.5 text-[11px] text-slate-400 font-mono">
                          Release: <span className="text-slate-200">{n.release_title}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="User account menu"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                {user ? user.fullName.slice(0, 1) : 'U'}
              </div>
              <span className="hidden sm:block text-xs font-semibold text-white max-w-[130px] truncate">
                {user ? user.fullName : 'Artist'}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0b1120] border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="text-xs font-semibold text-white truncate">
                    {user ? user.fullName : 'Artist'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {user ? user.email : ''}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/dashboard/profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-left"
                  >
                    <UserIcon className="w-4 h-4 text-blue-400" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/dashboard/profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Desktop Sidebar & Mobile Drawer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar (Collapsible Rail) */}
        <aside
          className={`hidden md:flex flex-col bg-[#080d1a] border-r border-slate-800/90 transition-all duration-200 shrink-0 ${
            collapsed ? 'w-18' : 'w-64'
          }`}
        >
          {/* Collapse Toggle */}
          <div className="p-3 border-b border-slate-800 flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Rail'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Rail'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {!collapsed && (
            <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Rudraatma Portal · v2.6
            </div>
          )}
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Slide drawer */}
            <div className="relative w-72 max-w-[80vw] bg-[#080d1a] border-r border-slate-800 h-full p-4 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <BrandLogo size="xs" />
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNav(item.href)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left ${
                          isActive
                            ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              © 2026 Rudraatma Music. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Encrypted Session</span>
              <span>·</span>
              <span>Direct Bank Settlement</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
